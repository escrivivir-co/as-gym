/**
 * ParadigmaCientifica - Descubrimiento científico automatizado (AM, BACON, etc.)
 */

import { IPercepto } from '@fia/core';
import { IMundo } from '@fia/core';
import { ParadigmaBase, IResultadoRazonamiento } from '../interfaces/IParadigma';

export class ParadigmaCientifica extends ParadigmaBase {
    readonly nombre = 'cientifica';
    readonly descripcion = 'Descubrimiento científico con generación y prueba de hipótesis';

    async razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento> {
        this.estado.ciclos++;
        return { exito: true, acciones: [], meta: { stub: true, paradigma: this.nombre } };
    }
}
