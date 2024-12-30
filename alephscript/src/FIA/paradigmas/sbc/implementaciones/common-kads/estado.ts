import { IModelo } from "../../../../mundos/IModelo";
import { IEstadoT } from "../../../situada/IEstadoT";
import { IEstado } from "./IEstado";


export class Estado implements IEstado {

    constructor(public modelo: IModelo) {}

    comoModelo(): IModelo {
        return this.modelo;
    };

    deModelo(e: IModelo): void {
        this.modelo = e as unknown as IModelo;
    }

    transicion(e: IEstado): void {
        this.modelo = e.comoModelo();
    }

}

export class EstadoT<T> extends Estado implements IEstadoT<T> {

	nombre: string;

    actual: T;

}