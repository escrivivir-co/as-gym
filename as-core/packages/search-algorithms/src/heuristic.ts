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
 * Best-First Search Algorithm
 */
export class PrimeroElMejor extends BaseFIA implements ISearchAlgorithm {
  constructor(grafo?: any) {
    super("Primero el Mejor");
  }

  buscar(inicio: any, objetivo: any): any[] {
    return [];
  }

  test(): void {
    this.log("Running best-first search test");
  }
}

/**
 * A* Search Algorithm
 */
export class AEstrella extends BaseFIA implements ISearchAlgorithm {
  constructor() {
    super("A*");
  }

  buscar(inicio: any, objetivo: any): any[] {
    return [];
  }

  test(): void {
    this.log("Running A* search test");
  }

  test2(): void {
    this.log("Running A* search test 2");
  }
}

/**
 * Hill Climbing Algorithm
 */
export class EscaladaMaximoGradiente extends BaseFIA {
  constructor() {
    super("Escalada Máximo Gradiente");
  }

  test(): void {
    this.log("Running hill climbing test");
  }

  test2(): void {
    this.log("Running hill climbing test 2");
  }

  test3(): void {
    this.log("Running hill climbing test 3");
  }

  test4(): void {
    this.log("Running hill climbing test 4");
  }

  test6(): void {
    this.log("Running hill climbing test 6");
  }
}
