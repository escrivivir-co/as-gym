import { Gramatica, GramaticaLibreContexto } from "./gramatica";
import { Lexer, Parser } from "./lexico";

export class Automata {

  constructor(public gramatica: GramaticaLibreContexto) {}

  iniciar() {

    console.log("\t - Iniciar derivación ")
    this.gramatica.test();

    /* ANALIZAR Léxico/Sintácticamente */
    console.log("\t - Iniciar análisis ")
    // Prueba con una cadena válida
    this.procesarCadena("2 + 3 - 1");

    // Prueba con una cadena no válida
    this.procesarCadena("+ 2 * 3");

  }


  iniciar2() {

    console.log("\t - Iniciar derivación ")
    // this.gramatica.test();

    /* ANALIZAR Léxico/Sintácticamente */
    console.log("\t - Iniciar análisis ")
    // Prueba con una cadena válida
    this.procesarCadena(" - (5 - 8) * (4 + 3)");



  }

  public procesarCadena(cadena: string): void {
    // Validar la cadena con la gramática
    if (this.validarCadena(cadena)) {
      // Procesar la cadena (puedes agregar la lógica de procesamiento aquí)
      console.log(`- \t Cadena válida: ${cadena}`);
    } else {
      console.log(`- \t Cadena no válida: ${cadena}`);
    }
  }

  private validarCadena(cadena: string): boolean {

    const lexer = new Lexer(cadena, this.gramatica.terminales);
    const tokens = lexer.tokenize();
    console.log("\t\t - Tokens:", tokens);
    const parser = new Parser(tokens, this.gramatica.producciones);
    const isValid = parser.parse(this.gramatica.simboloInicial);
    return isValid;
  }

}
