// Local type definitions
type GrammarRule = {
  left: string;
  right: string[];
};

interface iFIA {
  nombre: string;
  test(): void;
}

abstract class BaseFIA implements iFIA {
  public nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  abstract test(): void;

  protected log(message: string): void {
    console.log(`[${this.nombre}] ${message}`);
  }
}

/**
 * Grammar parsers and processors
 */

export class GrammarParser extends BaseFIA {
  private rules: GrammarRule[] = [];

  constructor() {
    super("Grammar Parser");
  }

  addRule(rule: GrammarRule): void {
    this.rules.push(rule);
  }

  parse(input: string): any {
    this.log(`Parsing input: ${input}`);
    return null;
  }

  test(): void {
    this.log("Testing grammar parser");
  }
}
