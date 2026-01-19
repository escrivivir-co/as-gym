/**
 * ParadigmaHibrido - Combinación de múltiples paradigmas
 */

import { IPercepto } from '@fia/core';
import { IMundo } from '@fia/core';
import { ParadigmaBase, IParadigmaConfig, IResultadoRazonamiento } from '../interfaces/IParadigma';
import { IParadigma } from '../interfaces/IParadigma';

export interface IHibridoConfig extends IParadigmaConfig {
    /** Paradigmas a combinar */
    paradigmas?: IParadigma[];
    /** Estrategia de combinación */
    estrategia?: 'secuencial' | 'paralelo' | 'votacion';
}

export class ParadigmaHibrido extends ParadigmaBase {
    readonly nombre = 'hibrido';
    readonly descripcion = 'Combinación de múltiples paradigmas con diferentes estrategias';

    private paradigmas: IParadigma[] = [];
    private estrategia: 'secuencial' | 'paralelo' | 'votacion' = 'secuencial';

    async inicializar(config?: IHibridoConfig): Promise<void> {
        await super.inicializar(config);
        if (config?.paradigmas) {
            this.paradigmas = config.paradigmas;
        }
        if (config?.estrategia) {
            this.estrategia = config.estrategia;
        }
    }

    async razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento> {
        this.estado.ciclos++;
        this.estado.ultimoCiclo = new Date();

        if (this.paradigmas.length === 0) {
            return {
                exito: false,
                acciones: [],
                errores: ['No hay paradigmas configurados']
            };
        }

        // Por ahora solo implementamos secuencial
        const resultados: IResultadoRazonamiento[] = [];
        let mundoActual = mundo;

        for (const paradigma of this.paradigmas) {
            const resultado = await paradigma.razonar(percepto, mundoActual);
            resultados.push(resultado);
            if (resultado.mundoActualizado) {
                mundoActual = resultado.mundoActualizado;
            }
        }

        // Combinar resultados
        const acciones = resultados.flatMap(r => r.acciones);
        const exito = resultados.every(r => r.exito);

        return {
            exito,
            acciones,
            mundoActualizado: mundoActual,
            meta: {
                paradigma: this.nombre,
                estrategia: this.estrategia,
                subResultados: resultados.length
            }
        };
    }

    /**
     * Añade un paradigma a la combinación
     */
    addParadigma(paradigma: IParadigma): void {
        this.paradigmas.push(paradigma);
    }
}
