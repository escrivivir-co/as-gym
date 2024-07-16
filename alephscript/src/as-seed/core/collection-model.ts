import { IModel, IRow, Model } from "./model";

export interface ICollection extends IModel {
    rows: IRow[];
}

export interface ICollectionModel extends IModel{
    collections: ICollection[];
}

export class CollectionModel extends Model implements ICollectionModel  {
    collections = [];
}