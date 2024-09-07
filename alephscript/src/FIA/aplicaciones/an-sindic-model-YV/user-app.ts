import { AnSindicModelVFIdeApp } from "./ide-v1/ide-app";

export class AnSindicModelVF extends AnSindicModelVFIdeApp {

    constructor() {

        super();
        this.nombre = "AnSindicModelVF-App";
    }

    async instanciar(): Promise<string> {

		console.log("Instanciar AnSindicModelVF app")

		return await super.instanciar();

    }

}