import { InetIDEApp } from "./ide-v1/ide-app";

export class InetApp extends InetIDEApp {

    constructor() {

        super();
        this.nombre = "InetApp";
    }

    async instanciar(): Promise<string> {

		console.log("Instanciar InetApp app")

		return await super.instanciar();

    }

}