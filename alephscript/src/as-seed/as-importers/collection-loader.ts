import { AsSeed } from "../as-seed";
import { CollectionModel } from "../core/collection-model";
import { IFilePath } from "../core/file-model";
import { ISemanticNetworkModel } from "../core/semantic-network-model";
import { StructuredDataLoader } from "./loader";

export class CollectionLoader extends StructuredDataLoader {

    model = new CollectionModel();

    import(Collection_file: IFilePath) {
        super.import(Collection_file);
    }

    export(): ISemanticNetworkModel {
        return super.export();
    }

}