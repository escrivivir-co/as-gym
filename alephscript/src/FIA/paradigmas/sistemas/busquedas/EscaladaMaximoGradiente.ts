import { AEstrella } from "./AEstrella";
import { OperadorFinito } from "./agbg";
import { BGrafo } from "./GrafoS";
import { Operador } from "./operador";

/**
 * Utilice como criterio de selección el de mejor vecino.
 * Utilice como criterio de terminación el que no se hayan producido mejoras durante los tres últimos pasos del algoritmo.
 */
export class EscaladaMaximoGradiente extends AEstrella {

    iteracionesSinMejoras = 0;
    maxIteracionesSinMejoras = 3;

    busqueda() {

        console.log("Búsqueda Heurística. Algoritmos de escalda o máximo gradiente");

        this.abierta = [this.estadoInicial];

        this.tabla_a[this.estadoInicial?.Id()] = {
            anterior: null,
            coste_desde_inicio: 0,
            profundidad: 0,
            sucesores: [],
            h: 0
        };
        this.imprimir(true, true);

        this.metas = this.solucionInicial();

        while(!this.terminado()) {

            console.log("\t - Abierta: ", this.abierta.length);
            const n = this.abiertaPrimero();

            console.log("\t - Nodo n: ", n.Id(),
                `g(n): ${this.gStar(n)}`,
                `h(n): ${this.hStar(n)}`);

            const v = this.solucionesVecinas(n);
            this.evaluarSolucionesVecinas(v);

            if (this.criterioAceptacion(n)) {
                this.iteracionesSinMejoras++;
            } else {
                this.abierta = [];
            }
        }

        return this.metas;
    }

    solucionInicial(): BGrafo[] {
        return [];
    }

    terminado(): boolean {
        console.log(`\t\t - ¿Terminado? ${this.iteracionesSinMejoras} - ${this.maxIteracionesSinMejoras}: ${this.iteracionesSinMejoras >= this.maxIteracionesSinMejoras}`)
        return this.abierta.length == 0  || this.iteracionesSinMejoras > this.maxIteracionesSinMejoras;
    }

    ordenarAbierta() {

        // Completo: sí, // admisible: sí
        const t = this.tabla_a;
        this.abierta.sort((a, b) =>
            a.estimado < b.estimado ? -1 : 1
        );

    }

    solucionesVecinas(n: BGrafo): Operador[] {
        this.abierta = [];
        let S = this.sucesores(n.arcos);
        if (S.length == 0) {
            console.log(n.Id(), " no tiene hijos");
        }
        S.forEach(s => this.abierta.push(s.nodo));
        return S;
    }

    evaluarSolucionesVecinas(S: Operador[]) {
        this.ordenarAbierta();
        this.imprimir(true, false);
    }

    criterioAceptacion(n: BGrafo): boolean {

        if (this.abierta.length == 0) return false;
        const p = this.abierta[0];

        console.log(`\t\t\t - CriterioAceptacion: ${p.Id()}/${n.Id()}(${p.estimado} <= ${n.estimado}): ${p.estimado <= n.estimado}`);
        const aceptar = (p.estimado <= n.estimado);
        if (aceptar) {
            this.metas.push(p);
            console.log("--> Encola", p.Id())
        }
        return aceptar;
    }

    test() {

        this.abierta = [];
        this.maxIteracionesSinMejoras = 3;
        this.iteracionesSinMejoras = 0;

        const A = this.creaNodoE("A", 50);
        const B = this.creaNodoE("B", 2);
        const C = this.creaNodoE("C", 30);
        const D = this.creaNodoE("D", 30);
        const E = this.creaNodoE("E", 30);
        const F = this.creaNodoE("F", 80);
        const G = this.creaNodoE("G", 7);
        const H = this.creaNodoE("H", 1);
        const I = this.creaNodoE("I", 3);
        const J = this.creaNodoE("J", 2);
        const K = this.creaNodoE("K", 4);

        A.arcos.push(new Operador(1, I));
        A.arcos.push(new Operador(22, J));
        A.arcos.push(new Operador(20, K));

        B.arcos.push(new Operador(20, A));
        B.arcos.push(new Operador(2, H));

        C.arcos.push(new Operador(2, B));

        D.arcos.push(new Operador(1, A));
        D.arcos.push(new Operador(2, E));
        D.arcos.push(new Operador(3, F));

        E.arcos.push(new Operador(2, C));
        E.arcos.push(new Operador(10, G));

        F.arcos.push(new Operador(2, G));

        G.arcos.push(new Operador(2, H));

        H.arcos.push(new Operador(2, A));
        H.arcos.push(new Operador(1, B));

        K.arcos.push(new Operador(20, I));

        this.estadoInicial = D;

        const metas = this.busqueda();

        const esperado = ['H'];
        const obtenidoN = metas.pop();
        const obtenido = obtenidoN?.Id();

        console.log("Ultimo nodo:", obtenido, obtenidoN.estimado);
        const assert = esperado.every((element, index) => element === obtenido[index]);
        console.log("Test: ", assert);

        if (!assert) {
            console.log("Esperado", esperado, "obtenido", obtenido);
        }
    }

    test2() {

        this.abierta = [];
        this.maxIteracionesSinMejoras = 3;
        this.iteracionesSinMejoras = 0;

        const A = this.creaNodoE("A", 5);
        const B = this.creaNodoE("B", 20);
        const C = this.creaNodoE("C", 30);
        const D = this.creaNodoE("D", 30);
        const E = this.creaNodoE("E", 30);
        const F = this.creaNodoE("F", 80);
        const G = this.creaNodoE("G", 7);
        const H = this.creaNodoE("H", 10);
        const I = this.creaNodoE("I", 1);
        const J = this.creaNodoE("J", 2);
        const K = this.creaNodoE("K", 1);

        A.arcos.push(new Operador(2, J));
        A.arcos.push(new Operador(20, K));

        B.arcos.push(new Operador(20, A));
        B.arcos.push(new Operador(2, H));

        C.arcos.push(new Operador(2, B));

        D.arcos.push(new Operador(2, E));
        D.arcos.push(new Operador(20, B));
        D.arcos.push(new Operador(80, F));

        E.arcos.push(new Operador(2, C));

        F.arcos.push(new Operador(2, G));

        G.arcos.push(new Operador(2, H));

        H.arcos.push(new Operador(2, A));

        K.arcos.push(new Operador(20, I));

        this.estadoInicial = D;

        const metas = this.busqueda();

        const esperado = ['I'];
        const obtenidoN = metas.pop();
const obtenido = obtenidoN?.Id();

        console.log("Ultimo nodo:", obtenido, obtenidoN.estimado);
        const assert = esperado.every((element, index) => element === obtenido[index]);
        console.log("Test: ", assert);

        if (!assert) {
            console.log("Esperado", esperado, "obtenido", obtenido);
        }

    }

    test3() {

        this.abierta = [];
        this.maxIteracionesSinMejoras = 3;
        this.iteracionesSinMejoras = 0;

        const A = this.creaNodoE("A", 30);
        const B = this.creaNodoE("B", 30);
        const C = this.creaNodoE("C", 30);
        const D = this.creaNodoE("D", 30);
        const E = this.creaNodoE("E", 30);
        const F = this.creaNodoE("F", 29);
        const G = this.creaNodoE("G", 29);
        const H = this.creaNodoE("H", 29);
        const I = this.creaNodoE("I", 3);
        const J = this.creaNodoE("J", 2);
        const K = this.creaNodoE("K", 4);

        A.arcos.push(new Operador(1, I));
        A.arcos.push(new Operador(22, J));
        A.arcos.push(new Operador(20, K));

        B.arcos.push(new Operador(2, A));
        B.arcos.push(new Operador(29, H));

        C.arcos.push(new Operador(2, B));

        D.arcos.push(new Operador(2, E));
        D.arcos.push(new Operador(30, A));
        D.arcos.push(new Operador(3, F));

        E.arcos.push(new Operador(2, C));

        F.arcos.push(new Operador(2, G));
        F.arcos.push(new Operador(2, C));

        G.arcos.push(new Operador(2, H));

        H.arcos.push(new Operador(2, A));

        J.arcos.push(new Operador(2, I));

        K.arcos.push(new Operador(20, I));

        this.estadoInicial = D;

        const metas = this.busqueda();

        const esperado = ['H'];
        const obtenidoN = metas.pop();
        const obtenido = obtenidoN?.Id();

        if (!obtenidoN) {
            console.log("No se ha obtenido solución")
        } else {
            console.log("Ultimo nodo:", obtenido, obtenidoN.estimado);
            const assert = esperado.every((element, index) => element === obtenido[index]);
            console.log("Test: ", assert);

            if (!assert) {
                console.log("Esperado", esperado, "obtenido", obtenido);
            }
        }

    }

    test4() {

        this.abierta = [];
        this.maxIteracionesSinMejoras = 5;
        this.iteracionesSinMejoras = 0;

        const A = this.creaNodoE("A", 10);
        const B = this.creaNodoE("B", 25);
        const C = this.creaNodoE("C", 20);
        const D = this.creaNodoE("D", 30);
        const E = this.creaNodoE("E", 35);
        const F = this.creaNodoE("F", 8);
        const G = this.creaNodoE("G", 40);
        const H = this.creaNodoE("H", 2);
        const I = this.creaNodoE("I", 20);

        B.arcos.push(new Operador(0, I));
        B.arcos.push(new Operador(0, C));

        C.arcos.push(new Operador(0, G));
        C.arcos.push(new Operador(0, F));

        D.arcos.push(new Operador(0, B));
        D.arcos.push(new Operador(0,I));
        D.arcos.push(new Operador(0, E));

        E.arcos.push(new Operador(0, I));
        E.arcos.push(new Operador(0, G));

        F.arcos.push(new Operador(0, H));

        G.arcos.push(new Operador(0, F));
        G.arcos.push(new Operador(0, A));

        I.arcos.push(new Operador(0, C));
        I.arcos.push(new Operador(0, G));

        this.estadoInicial = D;

        const metas = this.busqueda();

        const esperado = ['H'];
        const obtenidoN = metas.pop();
        const obtenido = obtenidoN?.Id();

        if (!obtenido) {
            console.log("No se ha encontrado ninguna solución!");
        } else {
            console.log("Ultimo nodo:", obtenido, obtenidoN.estimado);
            const assert = esperado.every((element, index) => element === obtenido[index]);
            console.log("Test: ", assert);

            if (!assert) {
                console.log("Esperado", esperado, "obtenido", obtenido);
            }
        }

    }

    test5() {

        this.abierta = [];
        this.maxIteracionesSinMejoras = 5;
        this.iteracionesSinMejoras = 0;

        const A = this.creaNodoE("A", 10);
        const B = this.creaNodoE("B", 2);
        const C = this.creaNodoE("C", 30);
        const D = this.creaNodoE("D", 30);
        const E = this.creaNodoE("E", 25);
        const F = this.creaNodoE("F", 8);
        const G = this.creaNodoE("G", 10);

        C.arcos.push(new Operador(0, G));
        C.arcos.push(new Operador(0, F));

        D.arcos.push(new Operador(0, C));
        D.arcos.push(new Operador(0, E));

        E.arcos.push(new Operador(0, C));
        E.arcos.push(new Operador(0, G));

        F.arcos.push(new Operador(0, B));

        G.arcos.push(new Operador(0, F));
        G.arcos.push(new Operador(0, A));

        this.estadoInicial = D;

        const metas = this.busqueda();

        const esperado = ['B'];
        const obtenidoN = metas.pop();
        const obtenido = obtenidoN?.Id();

        if (!obtenido) {
            console.log("No se ha encontrado ninguna solución!");
        } else {
            console.log("Ultimo nodo:", obtenido, obtenidoN.estimado);
            const assert = esperado.every((element, index) => element === obtenido[index]);
            console.log("Test: ", assert);

            if (!assert) {
                console.log("Esperado", esperado, "obtenido", obtenido);
            }
        }

    }


    test6() {

        this.abierta = [];
        this.maxIteracionesSinMejoras = 5;
        this.iteracionesSinMejoras = 0;

        const A = this.creaNodoE("A", 5);
        const B = this.creaNodoE("B", 27);
        const C = this.creaNodoE("C", 28);
        const D = this.creaNodoE("D", 30);
        const E = this.creaNodoE("E", 29);
        const F = this.creaNodoE("F", 8);
        const G = this.creaNodoE("G", 7);

        const H = this.creaNodoE("H", 6);
        const I = this.creaNodoE("I", 1);
        const J = this.creaNodoE("J", 2);
        const K = this.creaNodoE("K", 4);
        const L = this.creaNodoE("L", 3);

        A.arcos.push(new Operador(0, J));
        A.arcos.push(new Operador(0, K));

        B.arcos.push(new Operador(0, A));

        C.arcos.push(new Operador(0, B));

        D.arcos.push(new Operador(0, E));
        D.arcos.push(new Operador(0, F));

        E.arcos.push(new Operador(0, C));

        F.arcos.push(new Operador(0, G));

        G.arcos.push(new Operador(0, H));
        H.arcos.push(new Operador(0, A));

        J.arcos.push(new Operador(0, I));
        K.arcos.push(new Operador(0, L));


        this.estadoInicial = D;

        const metas = this.busqueda();

        const esperado = ['I'];
        const obtenidoN = metas.pop();
        const obtenido = obtenidoN?.Id();

        if (!obtenido) {
            console.log("No se ha encontrado ninguna solución!");
        } else {
            console.log("Ultimo nodo:", obtenido, obtenidoN.estimado);
            const assert = esperado.every((element, index) => element === obtenido[index]);
            console.log("Test: ", assert);

            if (!assert) {
                console.log("Esperado", esperado, "obtenido", obtenido);
            }
        }

    }
}
