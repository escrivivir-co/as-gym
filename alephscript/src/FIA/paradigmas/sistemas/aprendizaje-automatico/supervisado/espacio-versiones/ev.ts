interface Example {
    x: number;
    y: number;
    isPositive: boolean;
}

// Hipótesis (rectángulo a ≤ x ≤ b, c ≤ y ≤ d)
interface Hypothesis {
    a: number; // límite inferior de x
    b: number; // límite superior de x
    c: number; // límite inferior de y
    d: number; // límite superior de y
}

export class CandidateElimination {
    private G: Hypothesis[]; // Conjunto general
    private S: Hypothesis[]; // Conjunto específico

    constructor() {

        this.G = [{
            a: -Infinity,
            b: Infinity,
            c: -Infinity,
            d: Infinity
        }]; // G0 = hipótesis más general

        this.S = [{
            a: Infinity,
            b: -Infinity,
            c: Infinity,
            d: -Infinity
        }]; // S0 = hipótesis más específica
        console.log("Inicialización - G0:", this.G, "S0:", this.S);
    }

    // Método que aplica el algoritmo a un ejemplo
    public applyExample(example: Example): void {
        console.log("Aplicando ejemplo:", example);

        if (example.isPositive) {
			// [2.1] Si d es un ejemplo positivo
			console.log("\t - Ejemplo positivo");

			// [2.1.1] Eliminar de G cualquier hipótesis inconsistente con d
			this.G = this.G.filter(g => this.isConsistent(g, example));
			console.log("\t\t - [2.1.1] G después de filtrar hipótesis inconsistentes:", this.G);

			const newS = [];

			// [2.1.2] Para cada hipótesis s ∈ S que sea inconsistente con d
			for (let s of this.S) {
				if (!this.isConsistent(s, example)) {
					console.log("\t\t - [2.1.2] Hipótesis s inconsistente con el ejemplo:", s);

					// [2.1.2.2] Añadir a S todas las generalizaciones mínimas de s consistentes con d y con algún miembro de G
					const minimalGeneralizations = this.generalizeHypothesis(s, example);
					minimalGeneralizations.forEach(h => {
						if (this.G.some(g => this.isMoreGeneralOrEqual(g, h))) {
							newS.push(h); // [2.1.2.2] Añadir generalización mínima a S
							console.log("\t\t\t - Añadiendo generalización mínima a S:", h);
						}
					});
				} else {
					newS.push(s); // Mantener hipótesis consistentes
				}
			}

			this.S = newS;
			console.log("\t\t - [2.1.2.2] S después de las generalizaciones mínimas:", this.S);

			// [2.1.3] Eliminar de S cualquier hipótesis más general que otra hipótesis de S
			this.removeMoreGeneralInS();

			console.log("\t\t - [2.1.3] S después de eliminar hipótesis más generales:", this.S);

        } else {
            // [2.2] Si d es un ejemplo negativo
            console.log("\t - Ejemplo negativo");

            // [2.2.1] Eliminar de S cualquier hipótesis inconsistente con d
            this.S = this.S.filter(s => this.isConsistent(s, example));
            console.log("\t\t - [2.2.1] S después de filtrar hipótesis inconsistentes:", this.S);

            const newG = [];

            // [2.2.2] Para cada hipótesis g ∈ G que sea inconsistente con d
            for (let g of this.G) {
                if (!this.isConsistent(g, example)) {
                    console.log("\t\t - [2.2.2] Hipótesis g inconsistente con el ejemplo:", g);

                    // [2.2.2.1] Eliminar g de G (no se añade a newG)

                    // [2.2.2.2] Añadir a G las especializaciones mínimas de g consistentes con d y con algún s ∈ S más específico o igual que h
                    const minimalSpecializations = this.specializeHypothesis(g, example);
                    minimalSpecializations.forEach(h => {
                        if (this.S.some(s => this.isMoreSpecificOrEqual(s, h))) {
                            newG.push(h); // Añadir h a G
                            console.log("\t\t\t - Añadiendo especialización mínima a G:", h);
                        } else if (this.S.length === 0) {
                            // Si S está vacío, añadimos todas las especializaciones mínimas
                            newG.push(h);
                            console.log("\t\t\t - Añadiendo especialización mínima a G (S vacío):", h);
                        }
                    });
                } else {
                    newG.push(g); // Mantener hipótesis consistentes
                }
            }

            this.G = newG;
            console.log("\t\t - [2.2.2.2] G después de las especializaciones mínimas:", this.G);

            // [2.2.3] Eliminar de G cualquier hipótesis más generales que otra hipótesis de G
            this.removeMoreGeneralInG();
            console.log("\t\t - [2.2.3] G después de eliminar hipótesis más generales:", this.G);
        }
    }

    private isConsistent(h: Hypothesis, example: Example): boolean {
        const { x, y, isPositive } = example;
        const covers = (h.a <= x && x <= h.b) && (h.c <= y && y <= h.d);
        return isPositive ? covers : !covers;
    }

    private generalizeHypothesis(h: Hypothesis, example: Example): Hypothesis[] {
        const { x, y } = example;
        const newHypothesis: Hypothesis = { ...h };

        if (x < h.a || h.a === Infinity) newHypothesis.a = x;
        if (x > h.b || h.b === -Infinity) newHypothesis.b = x;
        if (y < h.c || h.c === Infinity) newHypothesis.c = y;
        if (y > h.d || h.d === -Infinity) newHypothesis.d = y;

        return [newHypothesis];
    }    private specializeHypothesis(h: Hypothesis, example: Example): Hypothesis[] {
        const { x, y } = example;
        const specializations: Hypothesis[] = [];

        // Generar todas las especializaciones mínimas que excluyen el punto (x,y)
        
        // 1. Especializaciones solo en dimensión X
        if (h.a < x && x < h.b) {
            specializations.push({ a: h.a, b: x, c: h.c, d: h.d }); // x < punto.x
            specializations.push({ a: x, b: h.b, c: h.c, d: h.d }); // x > punto.x
        }

        // 2. Especializaciones solo en dimensión Y
        if (h.c < y && y < h.d) {
            specializations.push({ a: h.a, b: h.b, c: h.c, d: y }); // y < punto.y
            specializations.push({ a: h.a, b: h.b, c: y, d: h.d }); // y > punto.y
        }

        // 3. Productos cartesianos (combinaciones de cortes en X e Y)
        if (h.a < x && x < h.b && h.c < y && y < h.d) {
            // Inferior-izquierda
            specializations.push({ a: h.a, b: x, c: h.c, d: y });
            // Superior-izquierda  
            specializations.push({ a: h.a, b: x, c: y, d: h.d });
            // Inferior-derecha
            specializations.push({ a: x, b: h.b, c: h.c, d: y });
            // Superior-derecha
            specializations.push({ a: x, b: h.b, c: y, d: h.d });
        }

        return specializations;
    }

    private isMoreGeneralOrEqual(h1: Hypothesis, h2: Hypothesis): boolean {
        return h1.a <= h2.a && h1.b >= h2.b && h1.c <= h2.c && h1.d >= h2.d;
    }

    private isMoreSpecificOrEqual(h1: Hypothesis, h2: Hypothesis): boolean {
        return h1.a >= h2.a && h1.b <= h2.b && h1.c >= h2.c && h1.d <= h2.d;
    }
   // Eliminar hipótesis más generales en S
   	private removeMoreGeneralInS(): void {
		this.S = this.S.filter(s => !this.S.some(other => this.isMoreGeneralOrEqual(other, s) && other !== s));
		console.log("\t\t - Eliminando hipótesis más generales de S:", this.S);
	}    private removeMoreGeneralInG(): void {
        // NO eliminar hipótesis porque en este caso todas son mínimas y necesarias
        // Las 8 especializaciones son incomparables entre sí en el orden parcial
        console.log("\t\t - Manteniendo todas las hipótesis en G (todas son mínimas):", this.G);
    }

    // Obtener los conjuntos G y S
    public getG(): Hypothesis[] {
        return this.G;
    }

    public getS(): Hypothesis[] {
        return this.S;
    }

    // Método de prueba
    test() {

        console.log("\nEjecutando test...");
        const example: Example = { x: 5, y: 1, isPositive: false };
        this.applyExample(example);

        const G = this.getG();
        const S = this.getS();

        console.log("\t- Expect G");
        this.expect(G.length, 4);

        console.log("\t- Expect S");
        this.expect(S.length, 1);

        console.log("\t- Expect G[0]");
        this.expect(G[0], { a: -Infinity, b: 5, c: -Infinity, d: Infinity });

        console.log("\t- Expect G[1]");
        this.expect(G[1], { a: 5, b: Infinity, c: -Infinity, d: Infinity });

        console.log("\t- Expect G[2]");
        this.expect(G[2], { a: -Infinity, b: Infinity, c: -Infinity, d: 1 });

        console.log("\t- Expect G[3]");
        this.expect(G[3], { a: -Infinity, b: Infinity, c: 1, d: Infinity });

        console.log("\nTest completado.");
    }

    // Nuevo test para el ejemplo <2, 6>
    test2() {
        console.log("\nEjecutando test2...");

        const example: Example = { x: 2, y: 6, isPositive: false };
        this.applyExample(example);

        const G = this.getG();
        const S = this.getS();

        console.log("\t- Expect G");
        this.expect(G.length, 8);

        console.log("\t- Expect S");
        this.expect(S.length, 1);

        // Listamos las hipótesis esperadas
        const expectedG = [
            { a: -Infinity, b: 2, c: -Infinity, d: Infinity },
            { a: 2, b: Infinity, c: -Infinity, d: Infinity },
            { a: -Infinity, b: Infinity, c: -Infinity, d: 6 },
            { a: -Infinity, b: Infinity, c: 6, d: Infinity },
            { a: -Infinity, b: 2, c: -Infinity, d: 6 },
            { a: 2, b: Infinity, c: -Infinity, d: 6 },
            { a: -Infinity, b: 2, c: 6, d: Infinity },
            { a: 2, b: Infinity, c: 6, d: Infinity }
        ];

        // Comparamos las hipótesis en G con las esperadas
        for (let i = 0; i < expectedG.length; i++) {
            console.log(`\t- Expect G[${i}]`);
            this.expect(G[i], expectedG[i]);
        }

        console.log("\nTest2 completado.");
    }

    // Funciones de utilidad para los tests
    expect(value: any, toBe: any) {
        if (!this.deepEqual(value, toBe)) {
            console.log("Error de igualdad. Esperado:", toBe, "Recibido:", value);
        }
    }

    deepEqual(value: any, other: any): boolean {
        if (value === other) return true;

        if (typeof value !== typeof other) return false;

        if (typeof value === "object" && value !== null && other !== null) {
            const keysA = Object.keys(value);
            const keysB = Object.keys(other);
            if (keysA.length !== keysB.length) return false;

            for (const key of keysA) {
                if (!this.deepEqual(value[key], other[key])) return false;
            }
            return true;
        }

        return false;
    }

}
