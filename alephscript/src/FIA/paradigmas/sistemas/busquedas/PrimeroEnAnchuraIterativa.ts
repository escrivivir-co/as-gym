import { Arbol } from "./control";
import { Operador } from "./operador";
import { PrimeroEnAnchura } from "./PrimeroEnAnchura";


export class PrimeroEnAnchuraIterativa extends PrimeroEnAnchura {

    anchuraLimiteMaxima: number = 10;
    anchuraLimite: number = 0;

    busquedaNoInformadaIterativa(): Arbol[] {

        console.log("Búsqueda no informada. Primero en anchura iterativa.");

        while(this.metas.length == 0 && this.anchuraLimite < this.anchuraLimiteMaxima) {

            this.tabla_a = {};
            console.log("Búsqueda no informada. Primero en anchura iterativa. Anchura", this.anchuraLimite);
            this.anchuraLimite++;
            this.sucesores = (arcos) => PrimeroEnAnchura.sucesores(arcos).slice(0, this.anchuraLimite);
            this.metas = this.busquedaNoInformada();

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

        const metas = this.busquedaNoInformadaIterativa();

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
