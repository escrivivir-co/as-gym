/**
 * Local interfaces to avoid circular dependencies
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

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  abstract test(): void;

  protected log(message: string): void {
    console.log(`[${this.nombre}] ${message}`);
  }
}

/**
 * Candidate Elimination Algorithm
 */
export class CandidateElimination extends BaseFIA implements ILearningAlgorithm {
  private hypotheses: any[] = [];

  constructor() {
    super("Candidate Elimination");
  }

  entrenar(datos: any[]): void {
    this.log("Training with candidate elimination");
    // Implementation would go here
  }

  predecir(entrada: any): any {
    this.log("Making prediction");
    return null;
  }

  test(): void {
    this.log("Running candidate elimination test");
  }

  test2(): void {
    this.log("Running candidate elimination test 2");
  }
}

export * from './supervised';
export * from './unsupervised';
