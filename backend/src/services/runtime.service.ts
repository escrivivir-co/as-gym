/**
 * Runtime Service - FIA Execution Engine
 * 
 * Integra @fia/paradigmas con el backend AAIA.
 * Reemplaza los stubs de fia.service.ts con ejecución real.
 * 
 * @épica ALEPHSCRIPT-MIGRATION-1.0.0
 * @fase 2 - Backend Integration
 * @fecha 2026-01-19
 */

import { logger } from '../utils/logger';
import { 
  IFIAInfo, 
  IEferencia, 
  IPercepto, 
  RunStateEnum 
} from '../types';

// Tipo extendido para FIAInfo con config opcional
export interface IFIAInfoExtended extends IFIAInfo {
  config?: {
    programa?: string[];
    [key: string]: unknown;
  };
}

// Tipos internos del runtime
export interface IFIARuntime {
  index: number;
  nombre: string;
  paradigma: string;
  instance: any; // IFIACompleta de @fia/paradigmas
  programa?: string[]; // Para paradigma lógico
  estado: {
    runState: RunStateEnum;
    ciclos: number;
    ultimoResultado?: any;
  };
}

export interface IStepResult {
  exito: boolean;
  eferencia: IEferencia;
  ciclos: number;
  executionTimeMs: number;
}

/**
 * RuntimeService - Motor de ejecución de FIAs
 * 
 * Mantiene las instancias activas de FIAs y ejecuta sus ciclos
 * de razonamiento usando @fia/paradigmas.
 */
export class RuntimeService {
  private fiaInstances: Map<string, Map<number, IFIARuntime>> = new Map();

  /**
   * Inicializa el runtime (lazy loading de @fia/paradigmas)
   */
  private async loadParadigmas(): Promise<any> {
    // Carga dinámica para evitar errores si el paquete no está compilado
    try {
      // Cargar desde el paquete npm linked
      return await import('@fia/paradigmas');
    } catch (error: any) {
      logger.warn(`RuntimeService: Failed to load @fia/paradigmas - ${error.message}`);
      logger.warn('RuntimeService: Running in stub mode');
      return null;
    }
  }

  /**
   * Crea una instancia de FIA en el runtime
   */
  async createFIA(
    sessionId: string,
    fiaInfo: IFIAInfoExtended
  ): Promise<IFIARuntime> {
    logger.info(`RuntimeService: Creating FIA ${fiaInfo.nombre} [${fiaInfo.paradigma}]`);

    try {
      const paradigmas = await this.loadParadigmas();
      
      if (!paradigmas) {
        throw new Error('Paradigmas module not available');
      }
      
      const { createFIA } = paradigmas;
      
      // Crear instancia real usando FIAFactory
      const fia = await createFIA({
        nombre: fiaInfo.nombre,
        paradigma: fiaInfo.paradigma as any,
        paradigmaConfig: (fiaInfo.config || {}) as Record<string, unknown>
      });

      const runtime: IFIARuntime = {
        index: fiaInfo.index,
        nombre: fiaInfo.nombre,
        paradigma: fiaInfo.paradigma,
        instance: fia,
        programa: fiaInfo.config?.programa || [],
        estado: {
          runState: RunStateEnum.STOP,
          ciclos: 0
        }
      };

      // Registrar en el mapa
      if (!this.fiaInstances.has(sessionId)) {
        this.fiaInstances.set(sessionId, new Map());
      }
      this.fiaInstances.get(sessionId)!.set(fiaInfo.index, runtime);

      logger.info(`RuntimeService: FIA ${fiaInfo.nombre} created successfully`);
      return runtime;

    } catch (error: any) {
      logger.error(`RuntimeService: Failed to create FIA - ${error.message}`);
      
      // Fallback a stub si falla
      const stubRuntime: IFIARuntime = {
        index: fiaInfo.index,
        nombre: fiaInfo.nombre,
        paradigma: fiaInfo.paradigma,
        instance: null,
        estado: {
          runState: RunStateEnum.STOP,
          ciclos: 0
        }
      };

      if (!this.fiaInstances.has(sessionId)) {
        this.fiaInstances.set(sessionId, new Map());
      }
      this.fiaInstances.get(sessionId)!.set(fiaInfo.index, stubRuntime);

      return stubRuntime;
    }
  }

  /**
   * Ejecuta un ciclo de razonamiento
   */
  async stepFIA(
    sessionId: string,
    fiaIndex: number,
    percepto?: IPercepto
  ): Promise<IStepResult> {
    const startTime = Date.now();
    
    const sessionFias = this.fiaInstances.get(sessionId);
    const runtime = sessionFias?.get(fiaIndex);

    if (!runtime) {
      throw new Error(`FIA ${fiaIndex} not found in runtime for session ${sessionId}`);
    }

    runtime.estado.ciclos++;
    const ciclo = runtime.estado.ciclos;

    // Si no hay instancia real, usar stub
    if (!runtime.instance) {
      logger.warn(`RuntimeService: FIA ${fiaIndex} running in stub mode`);
      
      const eferencia: IEferencia = {
        tipo: 'estado',
        payload: {
          fiaIndex,
          nombre: runtime.nombre,
          paradigma: runtime.paradigma,
          ciclo,
          simulated: true,
          stub: true
        },
        timestamp: new Date().toISOString()
      };

      return {
        exito: true,
        eferencia,
        ciclos: ciclo,
        executionTimeMs: Date.now() - startTime
      };
    }

    // Ejecutar ciclo real
    try {
      const inputPercepto = percepto || {
        tipo: 'tick',
        fuente: 'runtime',
        payload: { ciclo }
      };

      const resultado = await runtime.instance.ciclo(inputPercepto);
      runtime.estado.ultimoResultado = resultado;

      const eferencia: IEferencia = {
        tipo: resultado.exito ? 'estado' : 'evento', // resultado → estado, error → evento
        payload: {
          fiaIndex,
          nombre: runtime.nombre,
          paradigma: runtime.paradigma,
          ciclo,
          acciones: resultado.acciones,
          meta: resultado.meta,
          errores: resultado.errores || [],
          exito: resultado.exito
        },
        timestamp: new Date().toISOString()
      };

      logger.debug(`RuntimeService: FIA ${fiaIndex} step completed, ciclo=${ciclo}`);

      return {
        exito: resultado.exito,
        eferencia,
        ciclos: ciclo,
        executionTimeMs: Date.now() - startTime
      };

    } catch (error: any) {
      logger.error(`RuntimeService: FIA step error - ${error.message}`);

      const eferencia: IEferencia = {
        tipo: 'evento', // error se comunica como evento con payload.error
        payload: {
          fiaIndex,
          nombre: runtime.nombre,
          paradigma: runtime.paradigma,
          ciclo,
          error: error.message,
          exito: false
        },
        timestamp: new Date().toISOString()
      };

      return {
        exito: false,
        eferencia,
        ciclos: ciclo,
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Envía un percepto a todas las FIAs de una sesión
   */
  async sendPercepto(
    sessionId: string,
    percepto: IPercepto
  ): Promise<IStepResult[]> {
    const sessionFias = this.fiaInstances.get(sessionId);
    if (!sessionFias) {
      return [];
    }

    const results: IStepResult[] = [];
    for (const [fiaIndex, runtime] of sessionFias) {
      if (runtime.estado.runState === RunStateEnum.PLAY) {
        const result = await this.stepFIA(sessionId, fiaIndex, percepto);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Obtiene el runtime de una FIA
   */
  getRuntime(sessionId: string, fiaIndex: number): IFIARuntime | undefined {
    return this.fiaInstances.get(sessionId)?.get(fiaIndex);
  }

  /**
   * Lista todas las FIAs activas en una sesión
   */
  listFIAs(sessionId: string): IFIARuntime[] {
    const sessionFias = this.fiaInstances.get(sessionId);
    if (!sessionFias) {
      return [];
    }
    return Array.from(sessionFias.values());
  }

  /**
   * Actualiza el estado de ejecución de una FIA
   */
  setRunState(sessionId: string, fiaIndex: number, state: RunStateEnum): void {
    const runtime = this.getRuntime(sessionId, fiaIndex);
    if (runtime) {
      runtime.estado.runState = state;
    }
  }

  /**
   * Destruye el runtime de una sesión
   */
  destroySession(sessionId: string): void {
    const sessionFias = this.fiaInstances.get(sessionId);
    if (sessionFias) {
      // Limpiar instancias
      for (const runtime of sessionFias.values()) {
        if (runtime.instance?.paradigma?.detener) {
          runtime.instance.paradigma.detener();
        }
      }
      this.fiaInstances.delete(sessionId);
      logger.info(`RuntimeService: Session ${sessionId} destroyed`);
    }
  }

  /**
   * Consulta directa al paradigma lógico (si aplica)
   */
  async queryLogica(
    sessionId: string,
    fiaIndex: number,
    query: string
  ): Promise<{ exito: boolean; soluciones: any[] }> {
    const runtime = this.getRuntime(sessionId, fiaIndex);
    if (!runtime?.instance) {
      return { exito: false, soluciones: [] };
    }

    if (runtime.paradigma !== 'logica') {
      throw new Error(`FIA ${fiaIndex} is not a logic paradigm`);
    }

    const logicaParadigma = runtime.instance.paradigma;
    return logicaParadigma.consultar(query);
  }

  /**
   * Estadísticas del runtime
   */
  getStats(): {
    sessions: number;
    totalFIAs: number;
    activeFIAs: number;
  } {
    let totalFIAs = 0;
    let activeFIAs = 0;

    for (const sessionFias of this.fiaInstances.values()) {
      for (const runtime of sessionFias.values()) {
        totalFIAs++;
        if (runtime.estado.runState === RunStateEnum.PLAY) {
          activeFIAs++;
        }
      }
    }

    return {
      sessions: this.fiaInstances.size,
      totalFIAs,
      activeFIAs
    };
  }
}

// Singleton
export const runtimeService = new RuntimeService();
