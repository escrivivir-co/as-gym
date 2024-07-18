import { IEstado } from "./IEstado";


export interface IEstadoT<T> extends IEstado {

	assistanceName?: string;
	assistanceId?: string;

	actual: T;

	transicion(e: IEstadoT<T>): void;
}
