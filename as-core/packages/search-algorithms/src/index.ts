/**
 * Local interfaces to avoid circular dependencies
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

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  abstract test(): void;

  protected log(message: string): void {
    console.log(`[${this.nombre}] ${message}`);
  }
}

/**
 * Breadth-First Search Algorithm
 */
export class PrimeroEnAnchura extends BaseFIA implements ISearchAlgorithm {
  derecha_a_izquierda = false;

  constructor(nombre: string = "Primero en Anchura") {
    super(nombre);
  }

  buscar(inicio: any, objetivo: any): any[] {
    // Implementation would go here
    return [];
  }

  test(): void {
    this.log("Running breadth-first search test");
    // Test implementation
  }

  static sucesores(nodo: any): any[] {
    // Static method for successors
    return [];
  }
}

/**
 * Depth-First Search Algorithm
 */
export class PrimeroEnProfundidad extends BaseFIA implements ISearchAlgorithm {
  izquierda_a_derecha = false;

  constructor(arbol?: any) {
    super("Primero en Profundidad");
  }

  buscar(inicio: any, objetivo: any): any[] {
    return [];
  }

  test(): void {
    this.log("Running depth-first search test");
  }
}

/**
 * Uniform Cost Search Algorithm
 */
export class CosteUniforme extends BaseFIA implements ISearchAlgorithm {
  constructor(nombre: string = "Coste Uniforme") {
    super(nombre);
  }

  buscar(inicio: any, objetivo: any): any[] {
    return [];
  }

  test(): void {
    this.log("Running uniform cost search test");
  }

  static sucesores(nodo: any): any[] {
    return [];
  }
}

export * from './iterative';
export * from './heuristic';
