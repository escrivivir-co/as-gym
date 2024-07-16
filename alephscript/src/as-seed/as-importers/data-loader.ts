import { AppCommonKADS } from "../app.model.bundle/app.model.bundle";
import { DataModel, IDataModel } from "../core/data-model";
import { ICommonKADSLibrary, IFilePath } from "../core/file-model";
import { ISemanticNetworkModel, SemanticNetworkModel } from "../core/semantic-network-model";
import { IDatabaseSnapshot, StructuredDataLoader } from "./loader";

export class DataLoader extends StructuredDataLoader {

    model = new DataModel();

    import(Data_file: IFilePath) {
        super.import(Data_file);
    }

    export(): ISemanticNetworkModel {
        return super.export();
    }

    train(
        networks: ISemanticNetworkModel[],
        snapshot: IDatabaseSnapshot): ICommonKADSLibrary {
        return new AppCommonKADS();
    }

}