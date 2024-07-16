import { Arbol } from "./control";
import { Estado } from "./estado";
import { BGrafo } from "./GrafoS";

export interface Operador {

    nodo: BGrafo;
    coste: number;

    // Antes de llamar a transición hay que
    // revisar condiciones del estado.
    cumpleCondiciones(estado: Estado): boolean;

    transicion(estado: Estado): {
        coste: number,
        nodo: Arbol
    }
}

export class Operador implements Operador {

    constructor(
        public coste: number,
        public nodo: BGrafo) {

        }

    // Antes de llamar a transición hay que
    // revisar condiciones del estado.
    cumpleCondiciones(estado: Estado): boolean {
        return true;
    }

    transicion(estado: Estado): {
        coste: number,
        nodo: Arbol
    } {
        return {
            coste: this.coste,
            nodo: this.nodo
        }
    }
}