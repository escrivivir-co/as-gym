import { IModel, Model, IRow } from "./model";

export interface ITable extends IModel {
    rows: IRow[];
}

export interface IChenModel extends IModel {
    tables: ITable[];
}

export interface IChenModel extends IModel {
    tables: ITable[];
}

export class ChenModel extends Model implements IChenModel  {
    tables: ITable[];
}