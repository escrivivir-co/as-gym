import { IModelo } from "../../../../mundos/modelo";

export interface IEstado {

    modelo: IModelo;

    comoModelo: () => IModelo;
    deModelo: (m: IModelo) => void;

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
        this.modelo = e.comoModelo();
    }

}

export interface IEstadoT<T> extends IEstado {

    actual: T;

    transicion(e: IEstadoT<T>): void;
}

export class EstadoT<T> extends Estado implements IEstadoT<T> {

    actual: T;

}