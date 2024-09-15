import { LogicIdeApp } from "./ide-v1/ide-app";

export class IoTLogicEngine extends LogicIdeApp {

    constructor() {

        super();
        this.nombre = "IoTLogicEngine";
    }

    async instanciar(): Promise<string> {

		return await super.instanciar();

    }

}