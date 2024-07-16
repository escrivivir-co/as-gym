import { ITerminal, S } from "../unificador/unificacion-general";

export class Nodo {

    padre: Nodo;
    exito: boolean = false;
    hijos: Nodo[] = [];

    constructor(public nivel: number, public umg: S[], public etiqueta: ITerminal[]) {

    }

    agregarHijo(nodo: Nodo) {
      nodo.padre = this;
      this.hijos.push(nodo);
    }

    // Método para imprimir el árbol de manera bonita (opcional)
    imprimir(nivel: number = 0, linea: { nivel: number, simbolo: ITerminal } [] = []): void {

      console.log("\t\t\t - Imprimir nodo", 
        nivel, 
        this.exito ? "[exito]" : "",
        "L: " + this.nivel,
        " { " + this.umg.map(u => "<" + u.V.imprimir() + ", " + u.c.imprimir() + ">") + " } ",
        this.etiqueta.map(e => e.imprimir()).join(", ")
      )

      this.hijos.forEach(hijo => hijo.imprimir(nivel + 1, linea));

    }
}