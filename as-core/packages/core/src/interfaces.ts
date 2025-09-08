/**
 * Additional interfaces for the FIA framework
 */

/**
 * Interface for world components
 */
export interface IMundo {
  datos: any;
  actualizar(datos: any): void;
}

/**
 * Interface for runtime components
 */
export interface IRuntime {
  start(): void;
  stop(): void;
  demo?(): Promise<void>;
}

/**
 * Interface for search algorithms
 */
export interface ISearchAlgorithm {
  buscar(inicio: any, objetivo: any): any[];
  test(): void;
}

/**
 * Interface for learning algorithms
 */
export interface ILearningAlgorithm {
  entrenar(datos: any[]): void;
  predecir(entrada: any): any;
}
