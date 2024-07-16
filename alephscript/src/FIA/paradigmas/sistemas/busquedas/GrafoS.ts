import { OperadorFinito, OperadorInfinito } from './agbg';
import { Estado } from './estado';
import { Operador } from "./operador";

export type TablaA_Id = string;
export type HashDataItem = {
    anterior: BGrafo,
    coste_desde_inicio: number,
    profundidad: number,
    sucesores?: (OperadorFinito | OperadorInfinito) [],

    g?: number,
    h?: number
}
export type HashData = {[key: string]: HashDataItem};

/**
 * Un grafo dirigido o digrafo (oposición, no dirigido):
 * es un tipo de grafo en el cual las aristas tienen
 * un sentido definido.
 *
 * Grafos simple (por oposición a Multigrafo):
 * Es un tipo de grafo el cual no incluye ciclos ni
 * aristas paralelas.
 */
export interface BGrafo {

    nodo: Estado;
    arcos: Operador[];
    Id(): string;

}

export class BGrafo implements BGrafo {

    nodo: Estado;
    arcos: Operador[] = [];
    estimado: number;

    Id(): string {
        return this.nodo.modelo.dominio.base as string;
    }
}
