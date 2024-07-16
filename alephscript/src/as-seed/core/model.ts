export type IType = any;
export type ITypeAcceso = 'Acceso';
export type ITypeUsuario = 'Usuario';
export type ITypeRol = 'Rol';

export interface IData extends IType {
}

export interface IRowData extends IRow {
}

export interface IRowFK extends IRow {
}

export interface IRowPK extends IRow {
}

export interface IRow {
    data?: IData;
    type?: IType;
    pk?: IType;
    fk?: IType;
}

export interface IModel {
    id: ID;

    rows: IRow[];
}

export class Model implements IModel {

    id: ID = "NotInitedModel";

    rows = [];
}

export type ID = any;