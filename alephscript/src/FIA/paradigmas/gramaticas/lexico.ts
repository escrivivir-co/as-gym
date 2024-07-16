import { NoTerminal, ProduccionLibreContexto } from "./gramatica";

export type Token = string;

// Asumimos que esta enumeración y la interfaz Token están definidas globalmente
export enum TokenType {
  Terminal,
  NoTerminal
}

export interface AToken {
  type: TokenType;
  value: string;
}

export class Lexer {
  private readonly text: string;
  private index: number = 0;
  private readonly length: number;
  private readonly terminals: Set<string>;

  constructor(text: string, terminals: string[]) {
    this.text = text.replace(/\s+/g, '');
    this.length = this.text.length;
    this.terminals = new Set(terminals);
  }

  public tokenize(): AToken[] {
    const tokens: AToken[] = [];
    while (this.index < this.length) {
      const currentChar = this.text[this.index];
      // console.log("Inspeccionar terminal", currentChar, this.terminals.forEach(c => console.log(currentChar, c)))
      if (this.terminals.has(currentChar)) {
        tokens.push({ type: TokenType.Terminal, value: currentChar });
        this.index++;
      } else {
        throw new Error(`Caracter no reconocido: [${currentChar}] en Terminales`);
      }
    }
    return tokens;
  }
}

export class Parser {
  private readonly tokens: AToken[];
  private index: number = 0;
  private readonly producciones: ProduccionLibreContexto[];

  constructor(tokens: AToken[], producciones: ProduccionLibreContexto[]) {
    this.tokens = tokens;
    this.producciones = producciones;
  }

  public parse(simboloInicial: NoTerminal): boolean {
    return this
      .parseProduccion(simboloInicial) && this.index === this.tokens.length;
  }

  private parseProduccion(cabeza: string): boolean {

    console.log("ParseProduccion", cabeza, "token", this.currentToken());
    const produccion = this.producciones.find(p => p.cabeza == cabeza);
    if (!produccion) {
      console.log("\t\t\t - No encontrada produccion", cabeza);
      return false;
    };
    console.log("\t - La cabeza tiene ", produccion.reglas.length, "reglas");

    const regla = produccion.reglas.find(f => f.derivacion.find(ff => ff === this.currentToken().value))
    if (regla) {
      console.log("\t - Encontrada regla que aplica", regla)
    }
    for (let regla of produccion.reglas) {
      const savedIndex = this.index;
      let encontrada = null;
      if (regla.derivacion.every(simbolo => {
        const b = this.match(simbolo)
        if (b) encontrada = simbolo;
        return b;
       })) {

        console.log("\t\t Encontrada regla", encontrada)
        return true;
      }

      this.index = savedIndex; // Retrocede si la regla no coincide
    }
    return false;
  }

  private match(simbolo: string): boolean {
    const token = this.currentToken();
    if (token && token.value === simbolo) {
      this.index++;
      return true;
    }
    return false;
  }

  private currentToken(): AToken | null {
    return this.index < this.tokens.length ? this.tokens[this.index] : null;
  }
}