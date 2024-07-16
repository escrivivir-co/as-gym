import { agentMessage } from "../../../agentMessage";
import { App } from "../../../engine/apps/app";
import { RTCache } from "../../../engine/kernel/rt-cache";
import { Bloque } from "../cadena-bloques";

import { IDEModelo } from "./modelo/ide-modelo";
import { IDEMundo } from "./mundo/ide-mundo";
import { IDEEstados } from "./situada/ide-estado";
import { IDEFIASituada } from "./situada/ide-fia-situada";
import { IDE_SBC } from "./situada/ide-sbc";

export class IdeApp extends App {

    i18 = this.i18.IDE;

    runAsync: true;
    sbc: IDE_SBC;

    constructor() {
        super();
        this.nombre = this.i18.NOMBRE;
    }

    async instanciar(): Promise<string> {


		Bloque.estado = {};

        console.log(agentMessage(this.nombre, this.i18.SIMULATION_START));

        /**
         * CREACIÓN DEL MUNDO RAÍZ
         */
        this.mundo = new IDEMundo();

        this.mundo.modelo = new IDEModelo();
        this.mundo.modelo.pulso = 1000;
        this.mundo.modelo.muerte = 10;
        this.mundo.modelo.estado = IDEEstados.PARADA;

        this.mundo.nombre = this.i18.MUNDO.NOMBRE;

        this.situada = new IDEFIASituada();
        this.situada.mundo = this.mundo;

        this.sbc = new IDE_SBC();
        this.sbc.mundo = this.mundo;

        const salidas = await Promise.allSettled(
            [
                this.mundo.ciclo(),
                this.situada.instanciar(),
                this.sbc.instanciarC(),
            ]
        );

        return salidas.map(f => {
            if (typeof f == 'object') {
                return `${this.i18.SIMULATION_END}`;
            } else {
            }
        }).join(" - ")
    }
}