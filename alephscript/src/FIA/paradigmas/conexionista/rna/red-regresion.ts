import { ErrorDesviacion } from "./entrenar";
import { ISolucion, IEnunciado, IProblema } from "./red";

export interface IEvaluacion extends ISolucion {

}

export interface IAtributos extends IEnunciado {

}

export interface IRegresionador {

    funcionContinua(entrada: IAtributos): IEvaluacion;

}

type funcionContinua = (entrada: IAtributos) => IEvaluacion;

export type ErrorCuadraticoMedio = (entrada: IAtributos) => ErrorDesviacion;

export interface IClasificador extends IProblema {

    inferir: funcionContinua;

}