/**
 * Resolver - Motor de resolución SLD para Prolog
 * 
 * Ejecuta el algoritmo de resolución construyendo un árbol
 * de búsqueda con unificación en cada paso.
 * 
 * @migrado-desde alephscript/src/FIA/paradigmas/logica/resolucion/resolver.ts
 */

import { IFuncion, Sustitucion, Linea, ResultadoResolucion } from '../types';
import { UnificadorGeneral } from '../unificador/UnificadorGeneral';
import { Nodo } from './Nodo';

export class Resolver {
    /** Soluciones encontradas */
    ciertos: Sustitucion[][][] = [];
    
    /** Instancia del unificador */
    unificador = new UnificadorGeneral();
    
    /** Nodo raíz del árbol */
    nodo: Nodo;

    constructor(public objetivo: IFuncion) {
        this.nodo = new Nodo(0, [], []);
    }

    /**
     * Ejecuta la resolución SLD
     * @param nivel Nivel de profundidad (para logging)
     * @param objetivos Lista de objetivos a resolver
     * @param lineas Programa Prolog
     * @param nodo Nodo actual del árbol
     */
    resolver(
        nivel: string,
        objetivos: IFuncion[],
        lineas: Linea[],
        nodo: Nodo
    ): void {
        // Caso base: todos los objetivos resueltos
        if (objetivos.length === 0) {
            return;
        }

        const objetivo = objetivos[0];

        // Buscar regla o cláusula que unifique
        for (const linea of lineas) {
            let unificador = this.unificador.unificar(objetivo, linea.cabeza);

            // Intentar con el cuerpo si la cabeza no unifica
            if (!unificador.unificable && linea.cuerpo.length === 1) {
                unificador = this.unificador.unificar(
                    objetivo,
                    linea.cuerpo[0]
                );
            }

            if (unificador.unificable) {
                // Construir nuevos objetivos
                const nuevosObjetivos = [...objetivos];
                nuevosObjetivos.splice(0, 1);
                linea.cuerpo.forEach((l) => nuevosObjetivos.push(l));

                // Aplicar sustitución
                const hijos = nuevosObjetivos.map((cc) =>
                    cc.sustituir(unificador.umg)
                );

                // Crear nodo hijo
                const n = new Nodo(1, unificador.umg, hijos);
                nodo.agregarHijo(n);

                if (nuevosObjetivos.length === 0) {
                    // ¡Éxito!
                    n.exito = true;
                    this.ciertos.push(this.agregarCierto(n));
                } else {
                    // Recursión
                    this.resolver(nivel + '\t', hijos, lineas, n);
                }
            }
        }
    }

    /**
     * Recoge las sustituciones del camino exitoso
     */
    private agregarCierto(nodo: Nodo): Sustitucion[][] {
        const lista: Sustitucion[][] = [];
        let current: Nodo | undefined = nodo;
        while (current?.padre) {
            lista.push(current.umg);
            current = current.padre;
        }
        return lista;
    }

    /**
     * Imprime las soluciones encontradas
     */
    imprimir(): void {
        console.log('\t - Soluciones', this.ciertos.length);
        this.ciertos.forEach((c) => {
            const soluciones: Sustitucion[] = [];
            c.forEach((cc) => {
                cc.forEach((ccc) => {
                    if (
                        this.objetivo.parametros.find((p) => p.v === ccc.V.v)
                    ) {
                        soluciones.push(ccc);
                    }
                });
            });
            console.log(
                '\t\t - Solucion',
                soluciones.map((s) => `<${s.V.v}, ${s.c.v}>`)
            );
        });
        console.log('\n');
    }

    /**
     * Obtiene el resultado como objeto estructurado
     */
    getResultado(): ResultadoResolucion {
        return {
            exito: this.ciertos.length > 0,
            soluciones: this.ciertos,
            arbol: this.nodo.toJSON(),
        };
    }
}
