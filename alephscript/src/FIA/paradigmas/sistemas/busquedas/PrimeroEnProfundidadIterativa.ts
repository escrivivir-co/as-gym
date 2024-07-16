import { Arbol } from "./control";
import { Operador } from "./operador";
import { PrimeroEnProfundidad } from "./PrimeroEnProfundidad";

export class PrimeroEnProfundidadIterativa extends PrimeroEnProfundidad {

    busquedaNoInformadaIterativa(): Arbol[] {

        console.log("Búsqueda no informada. Primero en Profundidad Iterativa");

        this.maximaProfundidad = 1;
        let metas = this.busquedaNoInformada();

        while(metas.length == 0) {
            this.tabla_a = {}
            this.maximaProfundidad++;
            metas = this.busquedaNoInformada();
        }

        return metas;

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

        const metas = this.busquedaNoInformadaIterativa();

        metas.forEach(m => console.log(" >> ", m.Id(), this.tabla_a[m.Id()].profundidad, this.tabla_a[m.Id()]?.coste_desde_inicio));

        const esperado = ["C", "D", "A"];
        const obtenido = metas.map(m => m.Id());

        const assert = esperado.every((element, index) => element === obtenido[index]);
        console.log("Test: ", assert);

        if (!assert) {
            console.log("Esperado", esperado, "obtenido", obtenido);
        }

    }
}
