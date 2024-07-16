import { IFuncion } from "../unificador/dTF";
import { ITerminal, S, UnificadorGeneral } from "../unificador/unificacion-general";
import { Nodo } from "./arbol";
import { Linea } from "./parser";

export class Resolver {

    ciertos: S[][][] = []
    unificador = new UnificadorGeneral();
    nodo: Nodo;

    constructor(public objetivo: IFuncion) {
        this.nodo = new Nodo(0, [], [])
    }

    resolver(nivel: string, objetivos: IFuncion[], lineas: Linea[], nodo: Nodo) {

        // console.log(nivel + "- Resolver: Inicia resolucion")

        if (objetivos.length == 0) {
            console.log("Acabado!!!")
            return;
        }

        const objetivo = objetivos[0];
        console.log(nivel + "\t - Resolver: objetivo", objetivo.imprimir())

        console.log(nivel + "\t - Resolver: buscar regla o cláusual")

        let una = false;
        for(const linea of lineas) {

            let unificador = this.unificador.unificar(objetivo, linea.cabeza)
            if (!unificador.unificable) {
                if (linea.cuerpo.length == 1) {
                    unificador = this.unificador.unificar(objetivo, linea.cuerpo[0])
                }
            }

            if (unificador.unificable) {

                una = true;
                console.log(nivel + "\t\t - Resolver: regla", linea.cabeza.imprimir(), unificador.umg.map(u => "<" + u.V.imprimir() + ", " + u.c.imprimir() + ">"))
                const iteraObtivos = [...objetivos]
                iteraObtivos.splice(0, 1)
                linea.cuerpo.forEach(l => iteraObtivos.push(l))
                console.log(nivel + "\t\t - Resolver: objetivos", iteraObtivos.map(o => o.imprimir()))
                const hijos = iteraObtivos.map(cc => cc.sustituir(unificador.umg))
                console.log(nivel + "\t\t - Resolver: aplicada lista", hijos.map(h => h.imprimir()))

                const n = new Nodo(1, unificador.umg, hijos)
                nodo.agregarHijo(n);

                if (iteraObtivos.length == 0) {
                    console.log(nivel + "\t\t\t - Resultado: ", "Cierto")
                    n.exito = true;
                    this.ciertos.push(this.agregarCierto(n))
                } else {
                    this.resolver(nivel + "\t", hijos, lineas, n)
                }
            }
        }

    }

    agregarCierto(nodo: Nodo) {

        const lista = [];
        while(nodo.padre) {
            lista.push(nodo.umg)
            nodo = nodo.padre
        }
        return lista;
    }

    imprimir() {
        console.log("\t - Soluciones", this.ciertos.length)
        this.ciertos.forEach(c => {
            const soluciones = []
            c.forEach(cc => {
                cc.forEach(ccc => {
                    if (this.objetivo.parametros.find(p => p.v == ccc.V.v))
                    {
                        soluciones.push(ccc)
                    }
                })
            })
            console.log("\t\t - Solucion", soluciones.map(s => `<${s.V.v}, ${s.c.v}>`))
        })
        console.log("\n")
    }
}