import { IFuncionActivacion, IActivacionNeurona, FuncionLineal, SumaPonderada, Salida } from "./activacion";

export interface INeurona {

    estimulo(an: IActivacionNeurona): Salida;

    funcionActivacion: IFuncionActivacion;

    sumaPonderada(an: IActivacionNeurona): SumaPonderada;

}

export interface ISinapsis {

    destiono: INeurona;

}

export class Neurona implements INeurona {

    sinapsis: ISinapsis[];

    constructor(public funcionActivacion: IFuncionActivacion) {}

    estimulo(an: IActivacionNeurona): Salida {

        const activacion = this.sumaPonderada(an);
        const salida = this.funcionActivacion.g(activacion);

        return salida;

    }

    sumaPonderada(an: IActivacionNeurona): SumaPonderada {

        let suma: number;
        an.entradas
            .reduce(
                (suma: number, entrada: number, index: number) => {
                    suma += entrada * an.pesos[index] + an.sesgo;
                    return suma;
                }, suma);
        return suma;

    }

}
