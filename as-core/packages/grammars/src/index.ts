// Local type definitions
type GrammarRule = {
  left: string;
  right: string[];
};

type DictionaryEntry = {
  key: string;
  value: any;
  metadata?: Record<string, any>;
};

interface iFIA {
  nombre: string;
  test(): void;
}

// Base class implementation
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
 * Arithmetic Automaton
 */
export class AutomataAritmetico extends BaseFIA {
  private rules: GrammarRule[] = [];

  constructor() {
    super("Automata Aritmetico");
  }

  iniciar(): void {
    this.log("Starting arithmetic automaton");
  }

  iniciar2(): void {
    this.log("Starting arithmetic automaton v2");
  }

  test(): void {
    this.log("Testing arithmetic automaton");
  }
}

/**
 * Extended Arithmetic Automaton
 */
export class AutomataAritmeticoX extends AutomataAritmetico {
  constructor() {
    super();
    this.nombre = "Automata Aritmetico X";
  }
}

/**
 * Base Dictionary
 */
export class BaseDic extends BaseFIA {
  private entries: DictionaryEntry[] = [];

  constructor() {
    super("Base Dictionary");
  }

  testDictContents(): void {
    this.log("Testing dictionary contents");
  }

  async run(): Promise<void> {
    this.log("Running dictionary operations");
  }

  test(): void {
    this.log("Testing base dictionary");
  }
}

// Create instances for export
export const automataAritmetico = new AutomataAritmetico();
export const automataAritmeticoX = new AutomataAritmeticoX();

export * from './parsers';
export * from './dictionaries';
