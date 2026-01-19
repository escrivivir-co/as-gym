/**
 * ParadigmaSBR - Sistemas Basados en Reglas (RETE, Forward/Backward chaining)
 */

import { IPercepto } from '@fia/core';
import { IMundo } from '@fia/core';
import { ParadigmaBase, IResultadoRazonamiento } from '../interfaces/IParadigma';

export class ParadigmaSBR extends ParadigmaBase {
    readonly nombre = 'sbr';
    readonly descripcion = 'Sistemas de reglas con algoritmo RETE y encadenamiento';

    async razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento> {
        this.estado.ciclos++;
        return { exito: true, acciones: [], meta: { stub: true, paradigma: this.nombre } };
    }
}
