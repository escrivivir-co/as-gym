/**
 * IParadigma - Interfaz base para todos los paradigmas de IA
 * 
 * Cada paradigma implementa esta interfaz para definir su método
 * de razonamiento específico.
 */

import { iFIA, IPercepto, IAccion, IMundo } from '@fia/core';

/**
 * Estado de ejecución de un paradigma
 */
export interface IParadigmaEstado {
    /** Nombre del paradigma */
    nombre: string;
    /** Si está activo */
    activo: boolean;
    /** Ciclos de razonamiento ejecutados */
    ciclos: number;
    /** Último resultado */
    ultimoResultado?: any;
    /** Timestamp del último ciclo */
    ultimoCiclo?: Date;
}

/**
 * Configuración de un paradigma
 */
export interface IParadigmaConfig {
    /** Activar logging verbose */
    debug?: boolean;
    /** Máximo de ciclos por razonamiento */
    maxCiclos?: number;
    /** Timeout en ms */
    timeout?: number;
    /** Configuración específica del paradigma */
    opciones?: Record<string, unknown>;
}

/**
 * Resultado de un ciclo de razonamiento
 */
export interface IResultadoRazonamiento {
    /** Si tuvo éxito */
    exito: boolean;
    /** Acciones producidas */
    acciones: IAccion[];
    /** Nuevo estado del mundo (si cambió) */
    mundoActualizado?: IMundo;
    /** Información adicional */
    meta?: Record<string, unknown>;
    /** Errores si los hubo */
    errores?: string[];
}

/**
 * Interfaz que todo paradigma debe implementar
 */
export interface IParadigma {
    /** Nombre único del paradigma */
    readonly nombre: string;
    
    /** Descripción del paradigma */
    readonly descripcion: string;
    
    /** Estado actual */
    estado: IParadigmaEstado;
    
    /**
     * Inicializar el paradigma
     * @param config Configuración
     */
    inicializar(config?: IParadigmaConfig): Promise<void>;
    
    /**
     * Ejecutar un ciclo de razonamiento
     * @param percepto Entrada sensorial
     * @param mundo Estado del mundo
     */
    razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento>;
    
    /**
     * Detener el paradigma
     */
    detener(): Promise<void>;
    
    /**
     * Reiniciar el paradigma a estado inicial
     */
    reiniciar(): Promise<void>;
}

/**
 * Clase base abstracta para paradigmas
 */
export abstract class ParadigmaBase implements IParadigma {
    abstract readonly nombre: string;
    abstract readonly descripcion: string;
    
    estado: IParadigmaEstado = {
        nombre: '',
        activo: false,
        ciclos: 0
    };
    
    protected config: IParadigmaConfig = {};
    
    async inicializar(config?: IParadigmaConfig): Promise<void> {
        this.config = config || {};
        this.estado = {
            nombre: this.nombre,
            activo: true,
            ciclos: 0
        };
    }
    
    abstract razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento>;
    
    async detener(): Promise<void> {
        this.estado.activo = false;
    }
    
    async reiniciar(): Promise<void> {
        this.estado.ciclos = 0;
        this.estado.ultimoResultado = undefined;
        this.estado.ultimoCiclo = undefined;
    }
}
