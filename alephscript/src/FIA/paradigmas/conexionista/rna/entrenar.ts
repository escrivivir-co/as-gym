import { IActivacionNeurona } from "./activacion";
import { IEnunciado, ISolucion } from "./red";
import { ErrorEntropiaCruzada } from "./red-clasificacion";
import { ErrorCuadraticoMedio } from "./red-regresion";

export type ErrorDesviacion = number;

export interface IConjuntoEntrenamiento {
    entrada: IEnunciado;
}

export interface IAprendizaje {

    entrenamiento: (ce: IConjuntoEntrenamiento) => IActivacionNeurona;

}

export class Aprendizaje implements IAprendizaje {

    entrenamiento(ce: IConjuntoEntrenamiento): IActivacionNeurona {

        const sesgo: number = 0;
        const pesos: number[] = [];

        return {
            sesgo,
            pesos
        }
    }


}

type FuncionError = ErrorCuadraticoMedio | ErrorEntropiaCruzada;

export interface IConjuntoEntrenamientoSupervisado extends IConjuntoEntrenamiento {
    etiqueta: ISolucion;
}

export interface IAprendizajeSupervisado extends IAprendizaje {

    funcionError: (ce: IConjuntoEntrenamiento) => ErrorDesviacion;
}

export class AprendizajeSupervisado extends Aprendizaje implements IAprendizajeSupervisado {

    entrenar(ce: IConjuntoEntrenamientoSupervisado): IActivacionNeurona {

        const sesgo: number = 0;
        const pesos: number[] = [];
        const entradas: number[] = [];

        return {
            sesgo,
            pesos
        }
    }

    funcionError(ce: IConjuntoEntrenamientoSupervisado): ErrorDesviacion {
        return 0;
    }
}

export interface IAprendizajeNoSupervisado extends IAprendizaje {}
