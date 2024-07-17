import { IEstado } from "./IEstado";


export interface IEstadoT<T> extends IEstado {

	actual: T;

	transicion(e: IEstadoT<T>): void;
}
