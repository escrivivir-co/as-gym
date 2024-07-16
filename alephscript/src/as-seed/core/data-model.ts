import { IModel, IRow, Model } from "./model";

export interface IData extends IModel {
    rows: IRow[];
}

export interface IDataModel extends IModel{
    sentences: IData[];
}

export class DataModel extends Model implements IDataModel  {
    sentences = [];
}