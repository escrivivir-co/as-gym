import { IEtiqueta, IEtiquetaDescriptiva, EtiquetaDescriptiva,
    IEtiquetaEstructural, EtiquetaEstructural } from "./etiqueta";
import { IGrafo } from "./grafo";

export interface IArco {

    etiqueta: IEtiqueta;
    destino: IGrafo;

}

export class Arco implements IArco {
    etiqueta: IEtiqueta;
    destino: IGrafo;
}

export interface IArcoDescriptivo extends IArco {

    etiqueta: IEtiquetaDescriptiva;

}

export class ArcoDescriptivo implements IArcoDescriptivo {

    destino: IGrafo;
    etiqueta = new EtiquetaDescriptiva();

}

export interface IArcoEstructural extends IArco {

    etiqueta: IEtiquetaEstructural;

}

export class ArcoEstructural extends Arco implements IArcoEstructural {

    etiqueta = new EtiquetaEstructural();

}

export interface IArcos {

    estado: IArco[];

}

export class Arcos implements IArcos {
    estado = [];
}