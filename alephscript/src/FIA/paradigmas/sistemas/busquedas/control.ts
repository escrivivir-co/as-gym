import { Dominio } from "../../../mundos/dominio";
import { Modelo } from "../../../mundos/modelo";
import { Estado } from './estado';
import { BGrafo, HashData, TablaA_Id } from "./GrafoS";
import { FuncSucesores } from "./PrimeroEnAnchura";

export class Arbol extends BGrafo {}

export interface Control {

    abierta: BGrafo[];
    tabla_a: HashData;

    sucesores: FuncSucesores;

    camino(inicio: BGrafo, destino: BGrafo): BGrafo[];
    coste(inicio: Estado, destino: Estado): number;

    espacioBusqueda: BGrafo;

    estadoInicial: BGrafo;

    metas: BGrafo[];

    camino(inicio: BGrafo, destino: BGrafo): BGrafo[];

    busquedaNoInformada(): BGrafo[];

    busquedaHeuristica(): BGrafo[];

    creaNodo(valor: string): BGrafo;

    imprimir(abierta: boolean, tabla_a: boolean);

    /**
     * Si el factor de ramificación (número medio de sucesores de un nodo) es b, la profundidad (número de arcos del nodo inicial hasta la solución) es d, los órdenes de magnitud de las complejidades espacial y temporal son:
 
        ----        | Anchura | Profundidad | Bidireccional
        Espacial    | O(b^d)  | O(b . d)    | O(b^d/2)
        Temporal    | O(b^d)  | O(b^d)      | O(b^d/2

    O sea, la búsqueda en anchura tiene complejidad espacial y temporal exponencial en la profundidad, la búsqueda en profundidad tiene complejidad espacial lineal y temporal exponencial, y la bidireccional es exponencial pero en orden d/2.
    */
}

export class Control implements Control {

    abierta: BGrafo[] = [];
    tabla_a: HashData = {};

    sucesores: FuncSucesores = (arcos) => arcos;

    estadoInicial: BGrafo;
    metas: BGrafo[] = [];

    constructor(public espacioBusqueda: BGrafo) {
    }

    abiertaPrimero(): BGrafo {
        return this.abierta.splice(0, 1)[0];
    }

    abiertaUltimo(): BGrafo {
        return this.abierta.pop();
    }

    camino(inicio: BGrafo, destino: BGrafo): BGrafo[] {

        console.log("\t - Camino desde/a: ", inicio.Id(), destino.Id());

        let index = 0;
        let nodo: BGrafo = destino;
        const camino: BGrafo[] = [];
        do {

            camino.push(nodo);
            nodo = this.tabla_a[nodo.Id()]?.anterior;
            console.log("\t\t - ruta: ", nodo.Id());
            index++;

        } while (nodo != null && inicio != nodo && index < 10000000);

        if (inicio == nodo) {
            camino.push(inicio);
        }
        return camino;
    }

    creaNodoE(valor: string, estimado: number, objetivo: boolean = false): BGrafo {
        const gs = this.creaNodo(valor, objetivo);
        gs.estimado = estimado;
        return gs;
    }

    creaNodo(valor: string, objetivo: boolean = false): BGrafo {

        const g = new Estado();
        g.esObjetivo = () => objetivo;
        g.modelo = new Modelo();
        g.modelo.dominio = new Dominio({});
        g.modelo.dominio.base = valor;
        const gs = new BGrafo();
        gs.nodo = g;
        return gs;
    }

    imprimir(abierta: boolean, tabla_a: boolean)
    {
        if (abierta) console.log("\t\t - Abierta", this.abierta.map(a => a.Id()))
        if (tabla_a) console.log("\t\t - Tabla_A",
            Object.keys(this.tabla_a)
                .map(a => this.imprimir_tabla_a(a)
            )
        );
    }

    imprimir_tabla_a(ta: TablaA_Id) {

        const i = this.tabla_a[ta];
        if (!i) return "[T_a vacía]";
        const ids = `[${i.anterior?.Id() || " - "}]->[${ta}]: `
        const coste = `coste(inicio, n): ${i.coste_desde_inicio}; p: ${i.profundidad || "- "}; `;
        const sucesores = `s: ${(i.sucesores || []).length}: [${(i.sucesores || []).map(i => i.nodo.Id()).join(',')}]`
        return ids + coste + sucesores;
    }
}
