import { IComponentes } from "../disenyo/componentes";
import { IComunicacion } from "./comunicacion";
import { IIntercambio } from "./intercambio";
import { IPlan } from "./plan";
import { ITransaccion } from "./transacciones";

export interface IModeloComunicaciones {

    comunicacion: IComunicacion,
    plan: IPlan,
    transacciones: ITransaccion[],
    intercambio: IIntercambio[]

    comoJSON: () => object;
}