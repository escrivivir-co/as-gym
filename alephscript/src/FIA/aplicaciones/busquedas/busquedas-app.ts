import { BusquedaIdeApp } from "./ide-v1/busqueda-ide-app";

export class BusquedasApp extends BusquedaIdeApp {

    constructor() {

        super();
        this.nombre = "BúsquedasApp";
    }

    async instanciar(): Promise<string> {

		console.log("Instanciar Búsqueda app")

		return await super.instanciar();

    }

}