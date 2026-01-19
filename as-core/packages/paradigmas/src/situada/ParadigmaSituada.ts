/**
 * ParadigmaSituada - IA embodied y robótica cognitiva
 */

import { IPercepto } from '@fia/core';
import { IMundo } from '@fia/core';
import { ParadigmaBase, IResultadoRazonamiento } from '../interfaces/IParadigma';

export class ParadigmaSituada extends ParadigmaBase {
    readonly nombre = 'situada';
    readonly descripcion = 'IA embodied con sensores, actuadores y ciclo percepción-acción';

    async razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento> {
        this.estado.ciclos++;
        return { exito: true, acciones: [], meta: { stub: true, paradigma: this.nombre } };
    }
}
