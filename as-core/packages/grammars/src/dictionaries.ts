// Local type definitions
type DictionaryEntry = {
  key: string;
  value: any;
  metadata?: Record<string, any>;
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
 * Dictionary management system
 */

export class Dictionary extends BaseFIA {
  private entries: Map<string, DictionaryEntry> = new Map();

  constructor(name: string = "Dictionary") {
    super(name);
  }

  addEntry(entry: DictionaryEntry): void {
    this.entries.set(entry.key, entry);
  }

  getEntry(key: string): DictionaryEntry | undefined {
    return this.entries.get(key);
  }

  getAllEntries(): DictionaryEntry[] {
    return Array.from(this.entries.values());
  }

  test(): void {
    this.log("Testing dictionary operations");
  }
}
