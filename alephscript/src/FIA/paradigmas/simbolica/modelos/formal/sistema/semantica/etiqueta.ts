import { IEstado, IConcepto, IEntidad } from "./grafo";

export interface IRelacionEstructural extends IEstado {
    valor: "subclase" | "instancia" | "parte" | string;
}

export class RelacionEstructural implements IRelacionEstructural {
    nombre: string = "";
    valor = "";
}

export interface IRelacionDescriptiva extends IEstado {
    valor: "";
}

export class RelacionDescriptiva implements IRelacionDescriptiva {
    valor: "";
    nombre: string;
}

export interface IEtiqueta {
    estado: IEstado;
}

export interface IEtiquetaEstructural extends IEtiqueta {
    estado: IRelacionEstructural;
}

export class EtiquetaEstructural implements IEtiquetaEstructural {
    estado: IRelacionEstructural = new RelacionEstructural();
}

export interface IEtiquetaDescriptiva extends IEtiqueta {
    estado: IConcepto | IEntidad;
}

export class EtiquetaDescriptiva implements IEtiquetaDescriptiva {
    estado: IRelacionDescriptiva = new RelacionDescriptiva();
}