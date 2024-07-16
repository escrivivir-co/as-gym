import { Ignoto } from "../../../../../Intencion";

export type Tipo = Ignoto;
export type Valor = Ignoto;

export interface IFaceta {
}

export interface IFacetas {
    estado: IFacetas[];
}

export interface IFacetaRanura extends IFaceta {
    tipo: Tipo;
}

export interface IFacetaCardinalidad extends IFaceta {
    maximo: number;
    minimo: number;
}

export interface IFacetaMultivaluada extends IFaceta {
    valores: Valor[];
}

export interface IFacetaOmision extends IFaceta {
    valor: Valor;
}


export interface IProcedimiento {
    ejecutar: (...args: Ignoto) => Ignoto;
}

export interface IFacetaProcedimiento extends IFaceta {
    procedimiento: IProcedimiento;
}

export interface IFacetaSiLeo extends IFacetaProcedimiento {
}

export interface IFacetaSiAgrego extends IFacetaProcedimiento {
}

export interface IFacetaSiEdito extends IFacetaProcedimiento {
}

export interface IFacetaSiBorro extends IFacetaProcedimiento {
}

