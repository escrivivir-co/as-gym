// Core interfaces (defined locally to avoid external dependencies)
interface IMundo {
  datos: any;
  actualizar(datos: any): void;
}

interface iFIA {
  nombre: string;
  test(): void;
}

// Base class (defined locally)
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
 * Base World implementation
 */
export class Mundo extends BaseFIA implements IMundo {
  public datos: any = {};

  constructor(nombre: string = "Mundo") {
    super(nombre);
  }

  actualizar(datos: any): void {
    this.datos = { ...this.datos, ...datos };
    this.log(`World updated with new data`);
  }

  obtenerDatos(): any {
    return this.datos;
  }

  test(): void {
    this.log("Testing world operations");
  }
}

/**
 * Tree structure for search algorithms
 */
export class Arbol extends BaseFIA {
  private nodes: any[] = [];

  constructor() {
    super("Arbol");
  }

  addNode(node: any): void {
    this.nodes.push(node);
  }

  getNodes(): any[] {
    return this.nodes;
  }

  test(): void {
    this.log("Testing tree structure");
  }
}

/**
 * Graph structure for advanced algorithms
 */
export class GrafoAGBG extends BaseFIA {
  private edges: Map<string, string[]> = new Map();

  constructor() {
    super("Grafo AGBG");
  }

  addEdge(from: string, to: string): void {
    if (!this.edges.has(from)) {
      this.edges.set(from, []);
    }
    this.edges.get(from)!.push(to);
  }

  getNeighbors(node: string): string[] {
    return this.edges.get(node) || [];
  }

  test(): void {
    this.log("Testing graph operations");
  }
}
