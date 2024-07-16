import { RTCache } from "../../FIA/engine/kernel/rt-cache";
import { AsSeed } from "../as-seed";
import { IFilePath } from "../core/file-model";
import { ID, IModel } from "../core/model";
import { ISemanticNetworkModel, SemanticNetworkModel } from "../core/semantic-network-model";

export interface IDatabaseSnapshot extends IModel {
    id: ID;
}

export interface StructuredDataLoader {

    seed: AsSeed;
    network: ISemanticNetworkModel;

    model: IModel;

    import(file: IFilePath): void;
    export(): ISemanticNetworkModel;

}

export class StructuredDataLoader implements StructuredDataLoader {

    network: ISemanticNetworkModel;

    model: IModel;

    constructor(public seed: AsSeed) {

    }

    import(file: IFilePath) {

        const rt = new RTCache();

        const index: IModel = rt.recuperRuta(file)?.Model;
        // console.log(index)
        // console.log(index.rows.length)
        this.network = new SemanticNetworkModel();
        this.network.name = file.split("/").pop();
        this.network.index = (index?.rows || []);


        console.log("\t \t - Loader for file", file);
    }

    export(): ISemanticNetworkModel {
        return this.network;
    }

}