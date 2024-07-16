import { IModelo } from "../../mundos/modelo";

export interface IEstado {

    modelo: IModelo;

    comoModelo: () => IModelo;
    deModelo: (m: IModelo) => void;

    transicion(e: IEstado): void;
}

export interface IEstadoT<T> extends IEstado {

    actual: T;

    transicion(e: IEstadoT<T>): void;
}

export class Estado implements IEstado {

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

    actual: T;

    transicion(e: IEstadoT<T>): void {

        switch(this.modelo) {
            default:
        }

        this.modelo = e.comoModelo();
    }

}



