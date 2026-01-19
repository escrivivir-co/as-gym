/**
 * ParadigmaLogica - Paradigma de IA basado en lógica de primer orden
 * 
 * Implementa razonamiento deductivo usando resolución SLD (Prolog).
 * 
 * @épica ALEPHSCRIPT-MIGRATION-1.0.0
 */

import { IPercepto, IMundo } from '@fia/core';
import { 
    ParadigmaBase, 
    IParadigmaConfig, 
    IResultadoRazonamiento 
} from '../interfaces/IParadigma';
import { Parser } from './resolucion/Parser';
import { Resolver } from './resolucion/Resolver';
import { dTF } from './unificador/dTF';
import { IFuncion } from './types';

export interface ILogicaConfig extends IParadigmaConfig {
    /** Programa Prolog inicial */
    programa?: string[];
    /** Máxima profundidad de búsqueda */
    maxProfundidad?: number;
}

export class ParadigmaLogica extends ParadigmaBase {
    readonly nombre = 'logica';
    readonly descripcion = 'Paradigma de IA basado en lógica de primer orden con resolución SLD';

    private programa: string[] = [];
    private parser?: Parser;
    private maxProfundidad = 100;

    async inicializar(config?: ILogicaConfig): Promise<void> {
        await super.inicializar(config);
        if (config?.programa) {
            this.cargarPrograma(config.programa);
        }
        if (config?.maxProfundidad) {
            this.maxProfundidad = config.maxProfundidad;
        }
    }

    /**
     * Carga un programa Prolog
     */
    cargarPrograma(lineas: string[]): void {
        this.programa = lineas;
        this.parser = new Parser(lineas);
    }

    /**
     * Ejecuta consulta Prolog
     */
    consultar(query: string): { exito: boolean; soluciones: any[] } {
        if (!this.parser) {
            return { exito: false, soluciones: [] };
        }

        const queryParser = new Parser([query]);
        if (queryParser.lineas.length === 0) {
            return { exito: false, soluciones: [] };
        }

        const objetivo = queryParser.lineas[0].cabeza;
        const resolver = new Resolver(objetivo);
        resolver.resolver('', [objetivo], this.parser.lineas, resolver.nodo);

        return {
            exito: resolver.ciertos.length > 0,
            soluciones: resolver.ciertos.map(sol => {
                const bindings: Record<string, string> = {};
                sol.forEach(umg => {
                    umg.forEach(s => {
                        if (objetivo.parametros.find(p => p.v === s.V.v)) {
                            bindings[s.V.v] = s.c.imprimir();
                        }
                    });
                });
                return bindings;
            })
        };
    }

    /**
     * Razona sobre un percepto usando el programa cargado
     */
    async razonar(
        percepto: IPercepto,
        mundo: IMundo
    ): Promise<IResultadoRazonamiento> {
        this.estado.ciclos++;
        this.estado.ultimoCiclo = new Date();

        // Extraer query del percepto
        const query = percepto.payload?.query as string || 
                     percepto.payload?.objetivo as string;

        if (!query) {
            return {
                exito: false,
                acciones: [],
                errores: ['Percepto sin query: payload.query requerido']
            };
        }

        const resultado = this.consultar(query);

        // Convertir soluciones a acciones
        const acciones = resultado.soluciones.map((sol, i) => ({
            tipo: 'solucion',
            payload: {
                indice: i,
                bindings: sol
            }
        }));

        this.estado.ultimoResultado = resultado;

        return {
            exito: resultado.exito,
            acciones,
            meta: {
                query,
                numSoluciones: resultado.soluciones.length,
                paradigma: this.nombre
            }
        };
    }

    /**
     * Añade un hecho o regla al programa
     */
    assertz(linea: string): void {
        this.programa.push(linea);
        this.parser = new Parser(this.programa);
    }

    /**
     * Obtiene el programa actual
     */
    getPrograma(): string[] {
        return [...this.programa];
    }
}
