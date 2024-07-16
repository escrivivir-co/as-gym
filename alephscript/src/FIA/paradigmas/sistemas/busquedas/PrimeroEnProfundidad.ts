import { Control, Arbol } from "./control";
import { Operador } from "./operador";

export class PrimeroEnProfundidad extends Control {

    izquierda_a_derecha: boolean = false;

    maximaProfundidad: number = 10;
    /**
     * La búsqueda en profundidad no es ni completa ni admisible
     * (puede entrar en una rama infinita y nunca llegar a una solución).
     * Ni poniendo una profundidad límite se garantiza la completitud.
     */
    // Siempre encuentra la solución
    completo: false;

    // Siempre encuentra la solución óptima
    admisible: false;

    busquedaNoInformada(): Arbol[] {

        console.log("Búsqueda no informada. Primero en profunidad. Max Prof:", this.maximaProfundidad);

        this.abierta = [this.estadoInicial];

        this.tabla_a[this.estadoInicial?.Id()] = {
            anterior: null,
            coste_desde_inicio: 0,
            profundidad: 0
        };

        while (this.abierta.length > 0) {

            console.log("\t - Abierta: ", this.abierta.length);
            const n = this.abiertaUltimo();

            console.log("\t - Nodo n: ", n.Id());
            if (n.nodo.esObjetivo()) {
                console.log("\t - esObjetivo: ", n.Id());
                this.metas = this.camino(this.estadoInicial, n);
                return this.metas;
            }

            let S = [];
            if (this.tabla_a[n.Id()].profundidad < this.maximaProfundidad) {
                const reverse = (arcos) => { const cs = [...arcos]; return cs.reverse() };
                S = this.izquierda_a_derecha ? reverse(n.arcos) : n.arcos;
            }

            if (S.length == 0) {
                const p = this.tabla_a[n.Id()]?.anterior;

                if (p && Array.isArray(p)) {
                    const limpiar = p.arcos.filter(c => this.abierta.find(a => a.Id() == c.nodo.Id())).length > -1;
                    if (limpiar) {
                        // console.log("\t Limpiar", p.Id(), this.tabla_a);
                        delete this.tabla_a[p.Id()];
                        // console.log("\t Limpiado", p.Id(), this.tabla_a);
                    }
                }
            }

            S.forEach(q => {
                console.log("\t - Sucesor q: ", q.nodo.Id());
                const ta = {
                    anterior: n,
                    coste_desde_inicio: (this.tabla_a[n.Id()]?.coste_desde_inicio || 0) + q.coste,
                    profundidad: (this.tabla_a[n.Id()]?.profundidad || 0) + 1
                };

                this.tabla_a[q.nodo.Id()] = ta;
                this.abierta.push(q.nodo);
            });
            this.imprimir(true, true);
        }

        return this.metas;
    }

    test() {

        const gsF = this.creaNodo("F");
        const gsC = this.creaNodo("C", true);
        const gsE = this.creaNodo("E");
        const gsD = this.creaNodo("D");
        const gsB = this.creaNodo("B");
        const gs = this.creaNodo("A");

        gs.arcos.push(new Operador(2, gsB));
        gs.arcos.push(new Operador(5, gsD));
        gs.arcos.push(new Operador(3, gsE));

        gsD.arcos.push(new Operador(4, gsC));
        gsE.arcos.push(new Operador(2, gsF));

        this.estadoInicial = gs;

        const metas = this.busquedaNoInformada();

        metas.forEach(m => console.log(" >> ", m.Id(), this.tabla_a[m.Id()].profundidad, this.tabla_a[m.Id()].coste_desde_inicio));

        const esperado = ["C", "D", "A"];
        const obtenido = metas.map(m => m.Id());

        const assert = esperado.every((element, index) => element === obtenido[index]);
        console.log("Test: ", assert);

        if (!assert) {
            console.log("Esperado", esperado, "obtenido", obtenido);
        }


    }
}
