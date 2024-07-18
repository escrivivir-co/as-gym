import { IModelo } from "../../mundos/IModelo";
import { IEstado } from "./IEstado";
import { IEstadoT } from "./IEstadoT";

export class Estado implements IEstado {

	nombre;

    constructor(public modelo: IModelo) {}

    comoModelo(): IModelo {
        return this.modelo;
    };

    deModelo(e: IModelo): void {
        this.modelo = e as unknown as IModelo;
    }

    transicion(e: IEstado): void {
        console.log("transicion base");
        this.modelo = e.comoModelo();
    }

}

export class EstadoT<T> extends Estado implements IEstadoT<T> {

	assistanceName?: string = "";
	assistanceId?: string = "";
    actual: T;

    transicion(e: IEstadoT<T>): void {

        switch(this.modelo) {
            default:
        }

        this.modelo = e.comoModelo();
    }

}
