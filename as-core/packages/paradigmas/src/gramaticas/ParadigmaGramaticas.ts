/**
 * ParadigmaGramaticas - NLP con gramáticas formales
 */

import { IPercepto } from '@fia/core';
import { IMundo } from '@fia/core';
import { ParadigmaBase, IResultadoRazonamiento } from '../interfaces/IParadigma';

export class ParadigmaGramaticas extends ParadigmaBase {
    readonly nombre = 'gramaticas';
    readonly descripcion = 'Procesamiento de lenguaje natural con gramáticas formales';

    async razonar(percepto: IPercepto, mundo: IMundo): Promise<IResultadoRazonamiento> {
        this.estado.ciclos++;
        return { exito: true, acciones: [], meta: { stub: true, paradigma: this.nombre } };
    }
}
