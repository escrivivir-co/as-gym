import { IArco, IArcos } from "../../formal/sistema/semantica/arco";
import { IMarcoClase } from "./marco-clase";

export enum RelacionEstandard {
    instancia,      // de marco-instancia a marco-clase
    subclase,       // entre marcos-clase
    representa,     // herencia
    superclase      // herencia
}

export enum RelacionNoEstandard {
    fraternal,  // perro y gato (subclase de mamífero)
    disjunto    // ave y mamífero
}

export enum RelacionAdHoc {
    relacion    // una relación libre: "vecino de"
}

export interface IRelaciones extends IArcos {
    estado: IRelacion[];
}

export interface IRelacion extends IArco {

    tipo: RelacionEstandard | RelacionNoEstandard | RelacionAdHoc;
    destino: IMarcoClase;       // Si tipo RelacionEstandard.instancia debe ser IMarcoInstancia

}