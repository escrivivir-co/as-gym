export interface IModeloMimetico<T> {

    base: T;

    etiqueta(entrada: number): IEtiqueta;

}

export interface IEtiqueta {

}

export class ModeloMimetico<T> implements IModeloMimetico<T> {

    constructor(public base: T) {
        
    };

    etiqueta(entrada: number): IEtiqueta {
        return this.base[entrada];
    }

}