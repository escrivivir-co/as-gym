import { FuncionEscalon, IActivacionNeurona, Salida } from "../activacion";
import { IAprendizajeSupervisado, IConjuntoEntrenamiento, IConjuntoEntrenamientoSupervisado } from "../entrenar";
import { INeurona, Neurona } from "../neurona";
import { IEnunciado, IRNA, ISolucion, RNA } from "../red";
import { ILaya } from "../red-clasificacion";
import { IClasificador } from "../red-regresion";

export function CriterioDelPerceptron(
    a: IActivacionNeurona,
    c: IConjuntoEntrenamientoSupervisado
): Salida {

    const salida = 0;



    return salida;
}

export interface IPerceptron extends IRNA {

    dimension: number;

}

export class Perceptron extends RNA implements
    IPerceptron,
    IClasificador,
    IAprendizajeSupervisado {

    dimension = 5;

    constructor() {

        super();

        const f = new FuncionEscalon();

        const capa1 = new Array<INeurona>(this.dimension).map(s => new Neurona(f));
        const capa2 = new Array<INeurona>(1).map(s => new Neurona(f));
        this.red = [capa1, capa2];

    }

    entrenar(c: IConjuntoEntrenamiento): IPerceptron {

        this.entrenamiento(c);
        return this;

    }

    inferir(e: IEnunciado): ISolucion {

        return e;
    }

    funcionError: (ce: IConjuntoEntrenamiento) => number;

    entrenamiento: (ce: IConjuntoEntrenamiento) => IActivacionNeurona;

}



