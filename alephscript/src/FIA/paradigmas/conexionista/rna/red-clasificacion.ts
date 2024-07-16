import { IFuncionActivacion, SumaPonderada, Salida } from "./activacion";
import { ErrorDesviacion } from "./entrenar";
import { IEnunciado, IProblema } from "./red";

export interface ILaya {

    valor: number

}

export interface IRepresentacion extends IEnunciado {

}

export class FuncionSigmoidea implements IFuncionActivacion {

    g(activacion: SumaPonderada): Salida {

        return 1 / (1 + Math.exp(activacion * -1));

    }
}

export type ErrorEntropiaCruzada = (entrada: IRepresentacion) => ErrorDesviacion;

type reconocerPatron = (entrada: IRepresentacion) => ILaya[];

export interface IClasificador extends IProblema {

    inferir: reconocerPatron;

}