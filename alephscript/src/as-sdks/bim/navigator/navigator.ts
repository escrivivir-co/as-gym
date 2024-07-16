import { ITreeNode } from "../../../as-seed/as-importers/tree-loader";
import { IRow } from "../../../as-seed/core/model";

export class NavigatorBIM {

    navegarYSintetizar(target: string, profundidad: number) {
        console.log("Start to navigate, target: ", target)

        const ocurrencias = this.index.filter(i => (i.data.nombre + "").indexOf(target) > -1);

        // console.log(this.index)

        console.log("found ocurrences: ", ocurrencias.length);

        if (ocurrencias.length < 2) {
            return {
                ocurrencias
            }
        }

        const caminosIndex = [];
        const caminos = [];

        ocurrencias.forEach(o => {

            if (o.fk) {
                // console.log("The o", o.fk)
                caminosIndex.push(o.fk)
                const camino = this.obtenerCamino(this.bosque, o.fk.split("/").filter(f => f).reverse(), []);
                caminos.push(camino);
            }

        });

        console.log("found paths: ", caminos[0].length);

        console.log("Ajustando profundidad");

        const sintesis = this.sintetizarCamino(target, caminosIndex, profundidad);
        return {
            ocurrencias,
            caminos,
            caminosIndex,
            sintesis
        }


    }

    obtenerCamino(arbol: ITreeNode, segmentos: string[], camino: ITreeNode[]): ITreeNode[] {

        let segmento = segmentos.pop();
        if (!segmento) {
            segmento = segmentos.pop();
        }

        if (!segmento) {
            return camino;
        }

        // console.log("The arbol", arbol, segmento)
        const child = arbol.hijos.find(h => {
            // console.log("comparanddo", h.pk, segmento)
            return h.pk == segmento
        });
        if (child) {
            // console.log("encontrado", segment)
            camino.push(child);
            return this.obtenerCamino(child, segmentos, camino);
        }

        return camino;

    }

    sintetizarCamino(pk: string, caminos: string[], profundidad: number) {

        console.log("El bosque", this.bosque,  this.bosque.hijos[0].hijos.map(n => n.pk));

        const sintesis: ITreeNode[] = [];

        console.log("Iniciar sintesis", pk, "Caminos", caminos);
        for(const camino of caminos) {

            let tree: ITreeNode[] = this.bosque.hijos;

            const segmentos = camino.split("/").slice(0, profundidad);
            console.log(">>>>>>>>>>>>>>>>>>> Procesando a PROFUNDIDAD: ", profundidad, " Resulta: ", segmentos, "]")

            for(const segmento of segmentos) {

                // console.log(">>>>>>>>>>>>>", sintesis);
                const s = sintesis.find(t => t.pk == segmento);
                //console.log("\t - Primera ocurrencia: ", segmento, "La sintesis", s, "]");

                const nodo = tree.find(n => n.pk == segmento);

                if (!nodo) {
                    console.log("\t - No encontrado", segmento, tree.map(h => h))
                    continue
                }
                if (s) {
                    // console.log("Ya existe", camino, segmento, nodo);
                } else {
                    //console.log("\t - Caso:", segmento, nodo);
                    if (nodo) {
                        sintesis.push(nodo);
                        // console.log("ERROR ---------- path no existe:", tree.hijos.map(n => n.pk));
                    }
                }
                tree = nodo.hijos;
            }
        }

        return sintesis;
    }

    public index: IRow[];
    public bosque: ITreeNode;

    constructor() {

    }


}