import { IConjuntoEntrenamiento } from "./entrenar"
import { INeurona } from "./neurona";

export interface IEnunciado {

}

export interface ISolucion {

}

export interface IProblema {

    inferir(e: IEnunciado): ISolucion

}

export interface IRNA {

    red: INeurona[][];

    entrenar: (c: IConjuntoEntrenamiento) => IRNA;

    inferir: (e: IEnunciado) => ISolucion;

}

export class RNA implements IRNA {

    red: INeurona[][] = [];

    entrenar(c: IConjuntoEntrenamiento): IRNA {

        return this;
    }

    inferir(e: IEnunciado): ISolucion {
        return e;
    }

}