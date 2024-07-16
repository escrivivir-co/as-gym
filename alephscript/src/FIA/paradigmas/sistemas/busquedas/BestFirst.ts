import { AGBG } from './agbg';
import { BGrafo } from './GrafoS';

export class PrimeroElMejor extends AGBG {

    busqueda(): BGrafo[] {
        console.log("Búsqueda no informada. Primero el Mejor");
        return super.busqueda();
    }

    ordenarAbierta() {

        // Completo: sí, // admisible: sí
        const t = this.tabla_a;
        this.abierta.sort((a, b) =>
            t[a.Id()].coste_desde_inicio < t[b.Id()].coste_desde_inicio ? -1 : 1);

    }

    test() {
        this.esperado = ['N6', 'N7', 'N1'];
        return super.test();
    }

}