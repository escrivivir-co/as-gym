import { IChenModel, ITable } from "../core/chen-model";
import { IFilePath } from "../core/file-model";
import { IRow, Model } from "../core/model";
import { ISemanticNetworkModel } from "../core/semantic-network-model";
import { StructuredDataLoader } from "./loader";

export class ChenModel extends Model implements IChenModel  {

    tables: ITable[];
    rows: IRow[];

}

export class ChenLoader extends StructuredDataLoader {

    model = new ChenModel();

    import(chen_file: IFilePath) {
        super.import(chen_file);
    }

    export(): ISemanticNetworkModel {
        return super.export();
    }

}