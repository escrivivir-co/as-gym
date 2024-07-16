import { Control } from "./control";
import { BGrafo } from "./GrafoS";
import { Operador } from "./operador";

export type Finito = boolean;
export type Infinito = boolean;

export interface OperadorFinito extends Operador {

    espacio: Finito;
    nodo: GrafoAGBG;
}

export interface OperadorInfinito extends Operador {

    espacio: Infinito;
    nodo: GrafoAGBG;
    
}

export class GrafoAGBG extends BGrafo {

    arcos: (OperadorFinito)[] = [];

}

/**
 * 
 * Algoritmo General Busqueda de Grafos
 */
export class AGBG extends Control {
    esperado: string[];

    busqueda(): BGrafo[] {

        console.log("Búsqueda no informada. Algoritmo General Búsqueda en Grafos AGBG");

        this.abierta = [this.estadoInicial];

        this.tabla_a[this.estadoInicial?.Id()] = {
            anterior: null,
            coste_desde_inicio: 0,
            profundidad: 0,
            sucesores: []
        };

        while (this.abierta.length > 0) {

            console.log("\t - Abierta: ", this.abierta.length);
            const n = this.abiertaPrimero();

            console.log("\t - Nodo n: ", n.Id(), this.tabla_a[n.Id()].profundidad);
            if (n.nodo.esObjetivo()) {
                console.log("\t - esObjetivo: ", n.Id());
                this.metas = this.camino(this.estadoInicial, n);
                return this.metas;
            }

            let S = n.arcos;
            this.tabla_a[n.Id()].sucesores = S;

            console.log(`\t\t - Actualizando sucesores de ${n.Id()}: ${S.length}`);

            S.forEach(q => {
                console.log("\t - Sucesor q: ", q.nodo.Id());

                let qEnTa = this.tabla_a[q.nodo.Id()];

                if (qEnTa) {

                    // Rectificar(q, n, Coste(n,q))
                    this.RectificarLista(n);
                    //qEnTa.coste_desde_inicio
                    // Ordenar(Abierta);

                } else {
                    const ta = {
                        anterior: n,
                        coste_desde_inicio: (this.tabla_a[n.Id()]?.coste_desde_inicio || 0) + q.coste,
                        profundidad: this.tabla_a[n.Id()].profundidad + 1
                    };
                    this.tabla_a[q.nodo.Id()] = ta;
                    this.abierta.push(q.nodo);
                }
                this.ordenarAbierta();
            });
            this.imprimir(true, true);
        }

        return this.metas;
    }

    ordenarAbierta() {
        // Completo: sí, // admisible: no
    }

    Rectificar(n: GrafoAGBG, p: GrafoAGBG, costePN) {
        const taN = this.tabla_a[n.Id()];
        const taP = this.tabla_a[p.Id()];

        console.log(`\t\t\t [n: ${n.Id()}(${taN.profundidad})]/[p: ${p.Id()}(${taP.profundidad})]Coste(inicio, p) ${taP.coste_desde_inicio} + CosteNP ${costePN} < Coste(inicio, n) ${taN.coste_desde_inicio}`)
        if (taP.coste_desde_inicio + costePN < taN.coste_desde_inicio) {
            this.tabla_a[n.Id()] = {
                anterior: p,
                coste_desde_inicio: taP.coste_desde_inicio + costePN,
                profundidad: taP.profundidad + 1
            }
            console.log(`\t\t\t Nuevo valor: ${n.Id()}, T_a: `, this.imprimir_tabla_a(n.Id()))
        }
    }

    RectificarLista(n: GrafoAGBG) {

        const taN = this.tabla_a[n.Id()];

        console.log(`\t\t Rectificar lista: ${n.Id()}, T_a: `, this.imprimir_tabla_a(n.Id()))
        const lista = taN?.sucesores || [];
        lista.forEach(
            l => this.Rectificar(
                l.nodo, n, l.coste
            )
        );
    }

    abiertaPrimero(): GrafoAGBG {
        return this.abierta.splice(0, 1)[0] as GrafoAGBG;
    }

    abiertaUltimo(): GrafoAGBG {
        return this.abierta.pop() as GrafoAGBG;
    }

    test() {

        const N1 = this.creaNodo("N1");
        const N2 = this.creaNodo("N2");
        const N3 = this.creaNodo("N3");
        const N4 = this.creaNodo("N4");
        const N5 = this.creaNodo("N5");
        const N6 = this.creaNodo("N6", true);
        const N7 = this.creaNodo("N7");

        N1.arcos.push(new Operador(200, N2));
        N1.arcos.push(new Operador(30, N3));
        N1.arcos.push(new Operador(40, N4));
        N1.arcos.push(new Operador(200, N5));
        N1.arcos.push(new Operador(325, N6));
        N1.arcos.push(new Operador(250, N7));

        N2.arcos.push(new Operador(25, N3));
        N2.arcos.push(new Operador(100, N7));

        N4.arcos.push(new Operador(35, N3));
        N4.arcos.push(new Operador(150, N5));

        N5.arcos.push(new Operador(100, N6));

        N7.arcos.push(new Operador(25, N6));

        this.estadoInicial = N1;

        const metas = this.busqueda();

        metas.forEach(m => console.log(" >> ", m.Id(), this.tabla_a[m.Id()].profundidad, this.tabla_a[m.Id()]?.coste_desde_inicio));

        const obtenido = metas.map(m => m.Id());

        if (this.esperado == null) {
            this.esperado = ['N6', 'N5', 'N4', 'N1'];
        }

        const assert = this.esperado.every((element, index) => element === obtenido[index]);
        console.log("Test: ", assert);

        if (!assert) {
            console.log("Esperado", this.esperado, "obtenido", obtenido);
        }

    }
}


