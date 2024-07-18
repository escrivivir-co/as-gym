import { IEstado } from "./IEstado";


export interface IEstadoT<T> extends IEstado {

	assistanceName?: string;

	actual: T;

	transicion(e: IEstadoT<T>): void;
}
