import { AppModelBundle } from "./app.model.bundle/app.model.bundle";
import { IDatabaseSnapshot, StructuredDataLoader } from "./as-importers/loader";
import { API_ERROR_ID, LogsSnapshot, Log } from "./core/compiler";
import { AppDirectory, IFilePath } from './core/file-model';
import { ISemanticNetworkModel } from './core/semantic-network-model';
import { DataLoader } from "./as-importers/data-loader";

import fs from 'fs';
import path from 'path';
import { ID } from './core/model';

export const RELEASE_DATE = "0001";

export const DEFAULT_CONFIG: AppDirectory = {
	"id": "BoilerPlateApp",
	"baseFolder": "AlephScriptApps",
	"configFolder": "in/config",
	"chensFolder": "in/chen/domain.data.relational.scada.json",
	"collectionsFolder": "in/chen/domain.relational.scada.auth.json",
	"dataFolder": "in/data/data.json",
    "treeFolder": "in/tree/compressed-tree.json",

	"appFolder": "out/bundle",
	"navigationFolder": "out/navigation"
}

export type IBuildID = {
        timestamp: Date,
        app: ID,
        model?: ID
    }

export interface AsSeed {

    runIniter(app: AppDirectory): void;

    runLoadConfig(app?: AppDirectory): void;

    runLoader(
        loader: StructuredDataLoader,
        file: IFilePath
    ): ISemanticNetworkModel;

    runStore(
        app: AppDirectory,
        networks: ISemanticNetworkModel[]
    ): LogsSnapshot

    runTrainer(
        loader: DataLoader,
        networks: ISemanticNetworkModel[],
        snapshot: IDatabaseSnapshot,
    ): AppModelBundle;

    runCompiler(
        app: AppDirectory,
        model: AppModelBundle,
    ): LogsSnapshot;

}

export class AsSeed implements AsSeed {

    constructor(public app: AppDirectory) {

    }

    runIniter(app: AppDirectory) {

        if ( !fs.existsSync(app.baseFolder)) {
            fs.mkdirSync(
                path.join(app.baseFolder),
                { recursive: true});
        }

        if ( !fs.existsSync(app.configFolder)) {
            const target = path.join(
                app.baseFolder,
                app.configFolder);
            fs.mkdirSync(target, { recursive: true});

            const defaultConfig = path.join(target, 'config.aleph');
            fs.writeFileSync(defaultConfig, JSON.stringify(DEFAULT_CONFIG, null, "\t"));
        }
    }

    runLoadConfig(app: AppDirectory): AppDirectory {

        const target = path.join(
            app.baseFolder,
            app.configFolder
        );

        console.log("\t - Read config folder", target);
        const configFiles = fs.readdirSync(target, "utf-8");
        configFiles.forEach((file, index) => {

            if (file.indexOf(".aleph") == -1) return;

            console.log("\t - Read file", file);
            const configFile = fs.readFileSync(path.join(target, file), "utf-8");

            const appDirectory: AppDirectory = JSON.parse(configFile);
            console.log("\t - Applying config file", index, file, appDirectory)

            app = {
                ...app,
                ...appDirectory
            }

            /*if ( !fs.existsSync(app.chensFolder)) {
                fs.mkdirSync(
                    path.join(
                        app.baseFolder,
                        app.chensFolder),
                    { recursive: true });
            }

            if ( !fs.existsSync(app.collectionsFolder)) {
                fs.mkdirSync(
                    path.join(
                        app.baseFolder,
                        app.collectionsFolder),
                    { recursive: true });
            }

            if ( !fs.existsSync(app.dataFolder)) {
                fs.mkdirSync(
                    path.join(
                        app.baseFolder,
                        app.dataFolder),
                    { recursive: true });
            }

            if ( !fs.existsSync(app.appFolder)) {
                fs.mkdirSync(
                    path.join(
                        app.baseFolder,
                        app.appFolder),
                    { recursive: true});
            } */

            this.app = app;

        })

        return app;

    }

    runLoader(
        loader: StructuredDataLoader,
        file: IFilePath
    ): ISemanticNetworkModel {

        // console.log("--------------vvvvvvvvvv-----------------")
        // console.log("-------------------------------")
        // console.log("-------------------------------")

        // console.log(this.app)
        // console.log(">>" + this.app.baseFolder)
        // console.log(">>" + file)
        const p = path.join(this.app.baseFolder, file);
        console.log(">> runLoader de as-seed" + p);


        // console.log("-------------------------------")
        // console.log("-------------------------------")
        // console.log("--------------vvvvvvvv-----------------")

        loader.import(p);

        return loader.network;
    }

    runStore(
        app: AppDirectory,
        networks: ISemanticNetworkModel[]
    ): LogsSnapshot {

        const buildID: IBuildID = {
            timestamp: new Date(),
            app: app.id
        }

        let log: Log = {
            build: buildID,
            state: API_ERROR_ID.NEW,
            error: "Not launched!"
        }

        if (!networks) {
            log.state = API_ERROR_ID.REJECTED

        } else {

            const target = path.join(
                app.baseFolder,
                app.appFolder,
                `Domain_${RELEASE_DATE}.aleph`
            );
            const content = [networks || []
                ]/* .map((n, index) => `Network ${index} --> ${n}`)*/;

            try {

                console.log("\t - Write " + target);
                fs.writeFileSync(target, JSON.stringify({
                    domain: content }, null, "\t"));

                log.state = API_ERROR_ID.OK;
                log.error = "Stored"

                const data = fs.readFileSync(target, 'utf8');
                console.log("Readed file", JSON.parse(data));

            } catch(ex) {

                log.build.model = target;
                log.state = API_ERROR_ID.INVALID
                log.error = ex.message;
            }

        }

        return {
            logs: [log],
            build: buildID
        }
    }

    runTrainer(
        loader: DataLoader,
        networks: ISemanticNetworkModel[],
        snapshot: IDatabaseSnapshot,
    ): AppModelBundle {

        const model = (loader || new DataLoader(this)).train(networks, snapshot);

        return {
            id: snapshot.id,
            domain: networks,
            commonKADSforms: model
        }
    }

    runCompiler(
        app: AppDirectory,
        model: AppModelBundle,
    ): LogsSnapshot {

        const buildID: IBuildID = {
            timestamp: new Date(),
            app: app.id,
            model: model.id
        }

        let log: Log = {
            build: buildID,
            state: API_ERROR_ID.NEW,
            error: "Not launched!"
        }

        if (!model) {

            log.state = API_ERROR_ID.REJECTED
            log.error = "Invalid data";

        } else {
            const target = path.join(
                app.baseFolder,
                app.appFolder,
                `Build_${RELEASE_DATE}.aleph`
            );
            const content = model as any;

            try {

                console.log("Writing target", target)
                fs.writeFileSync(target, JSON.stringify(content, null, "\t"));

                log.state = API_ERROR_ID.OK;
                log.error = "Compiled";

                const data = fs.readFileSync(target, 'utf8');
                console.log("Readed file", JSON.parse(data));

            } catch(ex) {
                log.state = API_ERROR_ID.INVALID
                log.error = ex.message;
                log.build.model = target;
            }
        }

        return {
            logs: [log],
            build: buildID
        }
    }

}