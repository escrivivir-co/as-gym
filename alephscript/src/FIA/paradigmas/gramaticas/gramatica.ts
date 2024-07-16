import { Grafo } from "../simbolica/modelos/formal/sistema/semantica/grafo";
import { Token } from "./lexico";

export type Terminal = Token;
export type NoTerminal = string;

interface Regla {
  derivacion: (Terminal | NoTerminal)[];
}

export interface Produccion {
  reglas: Regla[];
}

export interface ProduccionLibreContexto extends Produccion {
  cabeza: NoTerminal;
}


export interface Gramatica {

    terminales: string[];
    noTerminales: string[];

    producciones: Produccion[];

    simboloInicial: string;

    derivar: (simbolo?: NoTerminal | Terminal, nivel?: number) => Nodo;

    test: () => void;
}

class Nodo {
  simbolo: Terminal | NoTerminal;
  hijos: Nodo[];

  constructor(simbolo: Terminal | NoTerminal, public isTerminal: boolean = false, public nivel: number = 0) {
    this.simbolo = simbolo;
    this.hijos = [];
  }

  agregarHijo(nodo: Nodo) {
    this.hijos.push(nodo);
  }

  // Método para imprimir el árbol de manera bonita (opcional)
  imprimir(nivel: number = 0, linea: { nivel: number, simbolo: Terminal } [] = []): void {

    if (this.isTerminal) {
      // console.log(nivel, this.simbolo, this.hijos.map(n => n.simbolo));
      linea.push({ nivel, simbolo: this.simbolo});
    } else {
      console.log(nivel, this.simbolo, this.hijos.map(n => n.simbolo));
      linea.push({ nivel, simbolo: this.simbolo});
    }

    this.hijos.forEach(hijo => hijo.imprimir(nivel + 1, linea));
  }
}

export class GramaticaLibreContexto implements Gramatica {

  terminales: Terminal[];
  noTerminales: NoTerminal[];
  producciones: ProduccionLibreContexto[];
  simboloInicial: NoTerminal;
  arbolSintactico: Grafo = new Grafo();

  derivar(simbolo: NoTerminal | Terminal = this.simboloInicial, nivel: number = 0): Nodo {

    const nodo = new Nodo(simbolo, false, nivel);

    /* TEST only 10 first */
    if (nivel > 3) return new Nodo(this.terminales[0], false, nivel);

    console.log("\t\t - Paso derivación:", simbolo, "Historial: ", nivel);

    if (this.terminales.includes(simbolo as any)) {
      // Si es un terminal, simplemente devolvemos el nodo sin hijos.
      nodo.isTerminal = true;
      return nodo;
    } else {
      const produccion = this.producciones.find(p => p.cabeza === simbolo);
      if (!produccion) {
        throw new Error(`No se encontró la producción para el símbolo: ${simbolo}`);
      }
      const regla = produccion.reglas[Math.floor(Math.random() * produccion.reglas.length)]; // Seleccionamos una regla al azar.
      regla.derivacion.forEach(s => {
        const hijo = this.derivar(s, nivel++);
        nodo.agregarHijo(hijo);
      });
      return nodo;
    }
  }

  test() {
    const arbol = this.derivar();
    console.log("Árbol sintáctico generado:", arbol);
    const linea  = [];
    arbol.imprimir(
      0, 
      linea
    );
    linea.sort((a, b) => a.nivel < b.nivel ? -1 : 1);
    console.log("Resultado: ", linea);
  }
}

// Ejemplo de la gramática para expresiones aritméticas básicas
export class GramaticaAritmetica extends GramaticaLibreContexto {

  terminales = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/"];

  noTerminales = ["<expresion>", "<numero>"];

  producciones = [
    {
      cabeza: "<expresion>",
      reglas: [
        { derivacion: ["<numero>"] },
        { derivacion: ["<expresion>", "+", "<expresion>"] },
        { derivacion: ["<expresion>", "-", "<expresion>"] },
        { derivacion: ["<expresion>", "*", "<expresion>"] },
        { derivacion: ["<expresion>", "/", "<expresion>"] },
      ],
    },
    {
      cabeza: "<numero>",
      reglas: [
        { derivacion: ["0"] },
        { derivacion: ["1"] },
        { derivacion: ["2"] },
        { derivacion: ["3"] },
        { derivacion: ["4"] },
        { derivacion: ["5"] },
        { derivacion: ["6"] },
        { derivacion: ["7"] },
        { derivacion: ["8"] },
        { derivacion: ["9"] },
      ],
    }
  ]
  simboloInicial =  "<expresion>"
};

export class GramaticaAritmeticaX extends GramaticaLibreContexto {

  terminales = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "(", ")"];

  noTerminales = ["<exp>", "<termino>", "<factor>", "<num>", "<digito>"];

  producciones = [
    {
      cabeza: "<exp>",
      reglas: [
        { derivacion: ["<termino>"] },
        { derivacion: ["<exp>", "+", "<termino>"] },
        { derivacion: ["<exp>", "-", "<termino>"] }
      ],
    },
    {
      cabeza: "<termino>",
      reglas: [
        { derivacion: ["<factor>"] },
        { derivacion: ["<termino>", "+", "<factor>"] },
        { derivacion: ["<termino>", "/", "<factor>"] },
      ],
    },
    {
      cabeza: "<factor>",
      reglas: [
        { derivacion: ["(", "<exp>", ")"] },
        { derivacion: ["-", "(", "<exp>", ")"] },
        { derivacion: ["<num>"] },
      ],
    },
    {
      cabeza: "<num>",
      reglas: [
        { derivacion: ["<digito>"] }
      ],
    },
    {
      cabeza: "<digito>",
      reglas: [
        { derivacion: ["0"] },
        { derivacion: ["1"] },
        { derivacion: ["2"] },
        { derivacion: ["3"] },
        { derivacion: ["4"] },
        { derivacion: ["5"] },
        { derivacion: ["6"] },
        { derivacion: ["7"] },
        { derivacion: ["8"] },
        { derivacion: ["9"] },
      ],
    }
  ]
  simboloInicial =  "<exp>"
};