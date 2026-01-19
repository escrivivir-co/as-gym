/**
 * ParadigmaSBC - Sistemas Basados en Conocimiento (Expert Systems)
 */

import { IPercepto } from '@fia/core';
import { IMundo } from '@fia/core';
import { ParadigmaBase, IResultadoRazonamiento } from '../interfaces/IParadigma';

export class ParadigmaSBC extends ParadigmaBase {
    readonly nombre = 'sbc';
    readonly descripcion = 'Sistemas expertos con motor de inferencia y base de conocimiento';

    async razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento> {
        this.estado.ciclos++;
        return { exito: true, acciones: [], meta: { stub: true, paradigma: this.nombre } };
    }
}
