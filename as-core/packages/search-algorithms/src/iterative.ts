/**
 * Local interfaces
 */
interface ISearchAlgorithm {
  buscar(inicio: any, objetivo: any): any[];
  test(): void;
}

interface iFIA {
  nombre: string;
  test(): void;
}

abstract class BaseFIA implements iFIA {
  public nombre: string;
  constructor(nombre: string) { this.nombre = nombre; }
  abstract test(): void;
  protected log(message: string): void { console.log(`[${this.nombre}] ${message}`); }
}

/**
 * Iterative Breadth-First Search
 */
export class PrimeroEnAnchuraIterativa extends BaseFIA implements ISearchAlgorithm {
  derecha_a_izquierda = false;

  constructor(nombre: string, sucesoresFn?: (nodo: any) => any[]) {
    super(nombre);
  }

  buscar(inicio: any, objetivo: any): any[] {
    return [];
  }

  test(): void {
    this.log("Running iterative breadth-first search test");
  }
}

/**
 * Iterative Depth-First Search
 */
export class PrimeroEnProfundidadIterativa extends BaseFIA implements ISearchAlgorithm {
  izquierda_a_derecha = false;

  constructor(arbol?: any) {
    super("Primero en Profundidad Iterativa");
  }

  buscar(inicio: any, objetivo: any): any[] {
    return [];
  }

  test(): void {
    this.log("Running iterative depth-first search test");
  }
}
