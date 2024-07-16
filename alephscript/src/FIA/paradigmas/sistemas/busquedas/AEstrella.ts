import { GrafoAGBG, OperadorFinito } from './agbg';
import { PrimeroElMejor } from './BestFirst';
import { BGrafo, HashDataItem } from "./GrafoS";
import { Operador } from "./operador";

export type HashData = {[key: string]: HashDataItem};

export class AEstrella extends PrimeroElMejor {

    gStar: (n: BGrafo) => number;
    hStar: (n: BGrafo) => number;
    fStar: (n: BGrafo) => number;

    cStar: number;

    constructor(){

        super(new GrafoAGBG());
        this.gStar = (n: GrafoAGBG) => this.tabla_a[n.Id()]?.coste_desde_inicio || 0;

        this.hStar = (n: GrafoAGBG) => {
            return n.estimado;
        };
        this.fStar = (n: GrafoAGBG) => this.gStar(n) + this.hStar(n);

        this.sucesores = (arcos) => arcos.sort((a, b) => this.fStar(a.nodo) < this.fStar(b.nodo) ? -1 : 1);
    }

    busqueda(): BGrafo[] {

        console.log("Búsqueda Heurística. A*");

        this.abierta = [this.estadoInicial];

        this.tabla_a[this.estadoInicial?.Id()] = {
            anterior: null,
            coste_desde_inicio: 0,
            profundidad: 0,
            sucesores: [],
            h: 0
        };
        this.imprimir(true, true);

        while (this.abierta.length > 0) {

            console.log("\t - Abierta: ", this.abierta.length);
            const n = this.abiertaPrimero();

            console.log("\t - Nodo n: ", n.Id(),
                `p: ${this.tabla_a[n.Id()].profundidad}` ,
                `g(n): ${this.gStar(n)}`,
                `h(n): ${this.hStar(n)}`);

            if (n.nodo.esObjetivo()) {
                console.log("\t - esObjetivo: ", n.Id());
                this.metas = this.camino(this.estadoInicial, n);
                this.cStar = this.tabla_a[n.Id()]?.coste_desde_inicio;
                return this.metas;
            }

            let S = this.sucesores(n.arcos);
            this.tabla_a[n.Id()].sucesores = S.map(s => s as OperadorFinito);

            console.log(`\t\t - Actualizando sucesores de ${n.Id()}: ${S.length}`);

            S.forEach(q => {
                console.log("\t - Sucesor q: ", q.nodo.Id());

                let qEnTa = this.tabla_a[q.nodo.Id()];

                if (qEnTa) {
                    this.RectificarLista(n);

                } else {
                    const ta = this.calcularNodoTablaA(n, q as OperadorFinito);
                    this.tabla_a[q.nodo.Id()] = ta;
                    this.abierta.push(q.nodo);
                }
                this.ordenarAbierta();
            });
            this.imprimir(true, true);

        }


        return this.metas;
    }

    calcularNodoTablaA(n: GrafoAGBG, q: OperadorFinito): HashDataItem {
        return {
            anterior: n,
            coste_desde_inicio: this.gStar(n) + q.coste,
            profundidad: this.tabla_a[n.Id()].profundidad + 1,
            h: this.hStar(q.nodo)
        };
    }

    ordenarAbierta() {

        // Completo: sí, // admisible: sí
        const t = this.tabla_a;
        this.abierta.sort((a, b) =>
            this.fStar(a) < this.fStar(b) ? -1 : 1
        );

    }

    Rectificar(n: GrafoAGBG, p: GrafoAGBG, costePN) {
        const taN = this.tabla_a[n.Id()] || { profundidad: 0, sucesores: []};
        const taP = this.tabla_a[p.Id()] || { profundidad: 0};

        const id = `\t\t\t [n: ${n.Id()}(${taN.profundidad})]->[p: ${p.Id()}(${taP.profundidad})]`;
        console.log(`${id}, g(p) ${this.gStar(p)} + CosteNP ${costePN} < g(n) ${this.gStar(n)}`)

        if (this.gStar(p) + costePN < this.gStar(n)) {
            this.tabla_a[n.Id()] = {
                anterior: p,
                coste_desde_inicio: this.gStar(p) + costePN,
                profundidad: taP.profundidad + 1,
                sucesores: taN.sucesores
            }
            console.log(`\t\t\t Nuevo valor: ${n.Id()}, T_a: `, this.imprimir_tabla_a(n.Id()))
            this.RectificarLista(n);
        }
    }

    imprimir(abierta: boolean, tabla_a: boolean)
    {
        if (abierta) console.log("\t\t - Abierta", this.abierta.map(a => `${a.Id()}(${this.gStar(a)} + ${this.hStar(a)})`))
        if (tabla_a) console.log("\t\t - Tabla_A",
            Object.keys(this.tabla_a)
                .map(a => this.imprimir_tabla_a(a)
            )
        );
    }

    test() {

        const N1 = this.creaNodoE("N1", 100);
        const N2 = this.creaNodoE("N2", 50);
        const N3 = this.creaNodoE("N3", 50);
        const N4 = this.creaNodoE("N4", 50);
        const N5 = this.creaNodoE("N5", 50);
        const N6 = this.creaNodoE("N6", 0, true);
        const N7 = this.creaNodoE("N7", 45);

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

        const esperado = ['N6', 'N5', 'N4', 'N1'];
        const obtenido = metas.map(m => m.Id());

        const assert = esperado.every((element, index) => element === obtenido[index]);
        console.log("Test: ", assert, "Coste: ", this.cStar);

        const fs = this.fStar(this.estadoInicial);
        const gs = this.gStar(this.estadoInicial);
        if (this.cStar == fs && fs == gs) {
            console.log("CStar diferente de FStar y/o gStar", this.cStar, fs, gs);
        }
        if (!assert) {
            console.log("Esperado", esperado, "obtenido", obtenido);
        }

    }

    test2() {

        const A = this.creaNodoE("A", 28);
        const B = this.creaNodoE("B", 1);
        const C = this.creaNodoE("C", 2);
        const D = this.creaNodoE("D", 2);
        const E = this.creaNodoE("E", 1);
        const F = this.creaNodoE("F", 2);
        const G = this.creaNodoE("G", 1);
        const H = this.creaNodoE("H", 1);
        const I = this.creaNodoE("I", 500);
        const J = this.creaNodoE("J", 0, true);
        const K = this.creaNodoE("K", 100);
        const L = this.creaNodoE("L", 100);
        const M = this.creaNodoE("M", 100);
        const N = this.creaNodoE("N", 100);

        A.arcos.push(new Operador(10, B));
        A.arcos.push(new Operador(5, C));
        A.arcos.push(new Operador(1, K));

        B.arcos.push(new Operador(18, D));
        B.arcos.push(new Operador(4, E));

        C.arcos.push(new Operador(2, E));
        C.arcos.push(new Operador(20, F));

        D.arcos.push(new Operador(4, G));

        E.arcos.push(new Operador(6, G));
        E.arcos.push(new Operador(7, H));

        F.arcos.push(new Operador(10, H));

        G.arcos.push(new Operador(14, I));

        H.arcos.push(new Operador(14, I));

        I.arcos.push(new Operador(21, J));

        K.arcos.push(new Operador(5, C));
        K.arcos.push(new Operador(1, F));
        K.arcos.push(new Operador(1, L));

        L.arcos.push(new Operador(1, F));
        L.arcos.push(new Operador(1, M));

        M.arcos.push(new Operador(1, H));
        M.arcos.push(new Operador(1, N));

        N.arcos.push(new Operador(1, I));

        this.estadoInicial = A;

        const metas = this.busqueda();

        metas.forEach(m => console.log(" >> ", m.Id(), this.tabla_a[m.Id()].profundidad, 
            this.tabla_a[m.Id()]?.coste_desde_inicio));

        const esperado = [  'J', 'I', 'N', 'M', 'L', 'K', 'A' ];
        const obtenido = metas.map(m => m.Id());

        const assert = esperado.every((element, index) => element === obtenido[index]);
        console.log("Test: ", assert, "Coste: ", this.cStar);

        const fs = this.fStar(this.estadoInicial);
        const gs = this.gStar(this.estadoInicial);
        if (this.cStar == fs && fs == gs) {
            console.log("CStar diferente de FStar y/o gStar", this.cStar, fs, gs);
        }
        if (!assert) {
            console.log("Esperado", esperado, "obtenido", obtenido);
        }

    }
}