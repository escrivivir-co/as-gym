/**
 * Nodo - Nodo del árbol de resolución SLD
 * 
 * @migrado-desde alephscript/src/FIA/paradigmas/logica/resolucion/arbol.ts
 */

import { ITerminal, Sustitucion } from '../types';

export class Nodo {
    padre!: Nodo;
    exito: boolean = false;
    hijos: Nodo[] = [];

    constructor(
        public nivel: number,
        public umg: Sustitucion[],
        public etiqueta: ITerminal[]
    ) {}

    agregarHijo(nodo: Nodo): void {
        nodo.padre = this;
        this.hijos.push(nodo);
    }

    /**
     * Imprime el árbol de resolución
     */
    imprimir(nivel: number = 0): void {
        const prefijo = '\t'.repeat(nivel);
        console.log(
            `${prefijo} - Nodo`,
            nivel,
            this.exito ? '[exito]' : '',
            'L: ' + this.nivel,
            ' { ' +
                this.umg.map(
                    (u) => '<' + u.V.imprimir() + ', ' + u.c.imprimir() + '>'
                ) +
                ' } ',
            this.etiqueta.map((e) => e.imprimir()).join(', ')
        );

        this.hijos.forEach((hijo) => hijo.imprimir(nivel + 1));
    }

    /**
     * Serializa el nodo a objeto plano
     */
    toJSON(): object {
        return {
            nivel: this.nivel,
            exito: this.exito,
            umg: this.umg.map((u) => ({
                variable: u.V.imprimir(),
                valor: u.c.imprimir(),
            })),
            etiqueta: this.etiqueta.map((e) => e.imprimir()),
            hijos: this.hijos.map((h) => h.toJSON()),
        };
    }
}
