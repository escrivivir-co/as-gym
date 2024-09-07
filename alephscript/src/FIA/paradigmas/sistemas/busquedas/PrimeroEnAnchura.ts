import { Subject } from "rxjs";
import { Control, Arbol } from "./control";
import { Operador } from "./operador";

export type FuncSucesores = (arcos: Operador[]) => Operador[];
export class PrimeroEnAnchura extends Control {

	events: Subject<Partial<Control>> = new Subject();

    static sucesores: FuncSucesores = (arcos) => arcos;

    derecha_a_izquierda: boolean = false;

    constructor(public titulo: string, public sucesores: FuncSucesores) {
        super(new Arbol());
    }

    // Siempre encuentra la solución
    // Si, encuentra la solución más cercana
    // a la raíz
    completo: true;

    // Siempre encuentra la solución óptima
    // Si el coste es igual para todos los arcos
    // entonces sí sería admisible.
    admisible: false;

    busquedaNoInformada(): Arbol[] {

        console.log("Búsqueda no informada.", this.titulo);

        this.abierta = [this.estadoInicial];

        this.tabla_a[this.estadoInicial?.Id()] = {
            anterior: null,
            coste_desde_inicio: 0,
            profundidad: 0
        };

        while (this.abierta.length > 0) {

            console.log("\t - Abierta: ", this.abierta.length);
            const n = this.abiertaPrimero();

            console.log("\t - Nodo n: ", n.Id());
            if (n.nodo.esObjetivo()) {
                console.log("\t - esObjetivo: ", n.Id());
                this.metas = this.camino(this.estadoInicial, n);
                return this.metas;
            }

            const reverse = (arcos) => { const cs = [...arcos]; return cs.reverse() };
            const S = this.sucesores(this.derecha_a_izquierda ? reverse(n.arcos) : n.arcos);
            S.forEach(q => {
                console.log("\t - Sucesor q: ", q.nodo.Id());
                const ta = {
                    anterior: n,
                    coste_desde_inicio: (this.tabla_a[n.Id()]?.coste_desde_inicio || 0) + q.coste,
                    profundidad: this.tabla_a[n.Id()].profundidad + 1
                };

                this.tabla_a[q.nodo.Id()] = ta;
                this.abierta.push(q.nodo);
            });
            this.imprimir(true, true);
        }

        return this.metas;
    }

	busquedaNoInformadaStepInit(): void {

        console.log("Búsqueda no informada.", this.titulo);

        this.abierta = [this.estadoInicial];

        this.tabla_a[this.estadoInicial?.Id()] = {
            anterior: null,
            coste_desde_inicio: 0,
            profundidad: 0
        };

	}
	
	busquedaNoInformadaStep(): Arbol[] {

		console.log("\t - Abierta: ", this.abierta.length);
		const n = this.abiertaPrimero();

		console.log("\t - Nodo n: ", n.Id());
		if (n.nodo.esObjetivo()) {
			console.log("\t - esObjetivo: ", n.Id());
			this.metas = this.camino(this.estadoInicial, n);
			return this.metas;
		}

		const reverse = (arcos) => { const cs = [...arcos]; return cs.reverse() };
		const S = this.sucesores(this.derecha_a_izquierda ? reverse(n.arcos) : n.arcos);
		S.forEach(q => {
			console.log("\t - Sucesor q: ", q.nodo.Id());
			const ta = {
				anterior: n,
				coste_desde_inicio: (this.tabla_a[n.Id()]?.coste_desde_inicio || 0) + q.coste,
				profundidad: this.tabla_a[n.Id()].profundidad + 1
			};

			this.tabla_a[q.nodo.Id()] = ta;
			this.abierta.push(q.nodo);
		});
		this.imprimir(true, true);

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
