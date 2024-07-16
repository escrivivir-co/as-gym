import { RTCache } from "../../FIA/engine/kernel/rt-cache";
import { NavigatorBIM } from "../../as-sdks/bim/navigator/navigator";
import { AppModelBundle } from "../app.model.bundle/app.model.bundle";
import { ChenLoader } from "../as-importers/chen-loader";
import { CollectionLoader } from '../as-importers/collection-loader';
import { DataLoader } from '../as-importers/data-loader';
import { IDatabaseSnapshot } from "../as-importers/loader";
import { TreeLoader } from "../as-importers/tree-loader";
import { AsSeed } from "../as-seed";
import { Log } from "../core/compiler";
import { AppDirectory, IFilePath } from "../core/file-model";
import { Model } from "../core/model";
import { ISemanticNetworkModel } from "../core/semantic-network-model";
import path from 'path';

export class AlephScriptBoilerplate {

    seed: AsSeed;

    app: AppDirectory = {
        "id": "BoilerPlateApp",
        "baseFolder": "AlephScriptApps",
        "configFolder": "in/config",
    };

    private dataLoader: DataLoader;
    private networks: ISemanticNetworkModel[] = [];
    private snapshot: IDatabaseSnapshot = new Model();
    private appBundle: AppModelBundle;

    constructor() {
        this.seed = new AsSeed(this.app);
    }

    /**
     * Execute once in App lifecyce: create the seed
     */
    init() {

        console.log("AS_SEED: main sequence.Init");

        console.log("Creating app folder", this.app);
        this.seed.runIniter(this.app);

        console.log("Consuming config files");
        this.app = this.seed.runLoadConfig(this.app);

        console.log("Opened seed!");

    }

    /**
     * Execute on demand to process Chen or Collection
     * schemas. Import also mock data for those schemas.
     */
    runImportAction() {

        console.log("AS_SEED: main sequence. Loading source files");

        console.log("\t - Loading source tree. Found chen tree: 2");

        const treeLoader: TreeLoader = new TreeLoader(this.seed);
        const treeFile: IFilePath = this.app.treeFolder;

        console.log("\t - Loading source files. Found chen files: 2");

        const chenLoader: ChenLoader = new ChenLoader(this.seed);
        const chenFile: IFilePath = this.app.chensFolder;

        console.log("\t - Loading source files. Found collection file: 1");

        const collectionLoader = new CollectionLoader(this.seed);
        const collectionFile: IFilePath = this.app.collectionsFolder;

        console.log("\t - Loading source files. Found data file: 1");

        const dataLoader = new DataLoader(this.seed);
        const dataFile: IFilePath = this.app.dataFolder;

        console.log("Executing loaders:");

        console.log("\t - Executing loaders. Loaded tree domains: 2,", treeFile);
        const treeNet = this.seed.runLoader(treeLoader, treeFile);

        console.log("\t - Executing loaders. Loaded chen domains: 2");
        const chenNet = this.seed.runLoader(chenLoader, chenFile);

        console.log("\t - Executing loaders. Loaded collection domains: 1");
        const collectionNet = this.seed.runLoader(collectionLoader, collectionFile);

        console.log("\t - Executing loaders. Loaded chen domains: 2");
        const dataNet = this.seed.runLoader(dataLoader, dataFile);

        const logs = this.seed.runStore(this.app, [treeNet, chenNet, collectionNet, dataNet]);

        logs.logs.forEach(
            (l: Log, index: number) => console.log("\t - STORE logs", index, l));

    }

    /**
     * Execute once after import-actions already finished.
     *
     * Use the dataLoader to train network over mock data
     */
    runCompileAction() {

        console.log("AS_SEED: main sequence. Training...");
        this.appBundle = this.seed.runTrainer(this.dataLoader, this.networks, this.snapshot);

        console.log("\t - trained!", this.appBundle);

        console.log("AS_SEED: main sequence. Compiling...");
        const compilerLogs = this.seed.runCompiler(this.app, this.appBundle);

        compilerLogs.logs.forEach(
            (l: Log, index: number) => console.log("\t - Compilation logs", index, l));

    }

    main() {

        console.log("AS_SEED: main sequence");

        this.init();

        console.log("AS_SEED: main sequence. STATE", this.app);

        this.runImportAction();

        console.log("AS_SEED: main sequence. STATE", this.app);

        this.runCompileAction();

    }

    navigator() {

        this.init();

        const rt = new RTCache();

        const p = path.join(this.app.baseFolder, this.app.appFolder, "Domain_0001.aleph");
        const source = rt.recuperRuta(p);
        console.log(source)
        const d = source.domain[0].find(d => d.name == "compressed-tree.json");
        // console.log("The network for ", d)
        const n = new NavigatorBIM();
        n.index = d.index;
        n.bosque = d.bosque;

        console.log("The navigate to \n", "Lámpara", " \n test")
        const r = n.navegarYSintetizar("Lámpara", 2);

        console.log("The navigation result", r.caminosIndex.map(c => c));
        console.log("The navigation result", r.caminos[0].map(c => c));

        console.log("Sintesis", r.sintesis);

        const c = path.join(this.app.baseFolder, this.app.navigationFolder, "search" + new Date().getTime() + ".aleph");

        rt.dominio.base = {
            ...r
        }
        rt.archivo = c;
        rt.persistirRuta();
        console.log("Persists", c)

    }
}