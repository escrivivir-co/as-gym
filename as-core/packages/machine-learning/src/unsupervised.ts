/**
 * Local interfaces  
 */
interface ILearningAlgorithm {
  entrenar(datos: any[]): void;
  predecir(entrada: any): any;
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
 * Unsupervised learning algorithms
 */

export class Clustering extends BaseFIA implements ILearningAlgorithm {
  constructor() {
    super("Clustering");
  }

  entrenar(datos: any[]): void {
    this.log("Training clustering algorithm");
  }

  predecir(entrada: any): any {
    return null;
  }

  test(): void {
    this.log("Testing clustering");
  }
}
