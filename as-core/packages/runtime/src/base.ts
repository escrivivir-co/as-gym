/**
 * Base interface for FIA components (duplicated to avoid circular deps)
 */
interface iFIA {
  nombre: string;
  test(): void;
}

/**
 * Base class for FIA components
 */
export abstract class BaseFIA implements iFIA {
  public nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  abstract test(): void;

  protected log(message: string): void {
    console.log(`[${this.nombre}] ${message}`);
  }
}
