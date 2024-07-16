import { i18 } from "../../i18/aleph-script-i18";
import { agentMessage } from "../../agentMessage";

import { App } from "../../engine/apps/app";
import { CadenaModelo } from "./modelo/cadena-modelo";
import { CadenaMundo } from "./mundo/cadena-mundo";
import { CadenaFIASituada } from "./situada/cadena-fia-situada";
import { CadenaFIARedSemantica } from "./simbolica/formal/cadena-fia-red-semantica";
import { CadenaFiaRedNeuronal } from "./conexionista/cadena-fia-red-neuronal";

export class CadenaApp extends App {

    i18 = this.i18.CADENA;

    runAsync: true;

    constructor() {
        super();
        this.nombre = i18.APPS.CADENA.NOMBRE;
    }

    async instanciar(): Promise<string> {

        console.log(agentMessage(this.nombre, i18.APPS.CADENA.SIMULATION_START));
        /**
         * CREACIÓN DEL MUNDO RAÍZ
         */
        this.mundo = new CadenaMundo();
        this.mundo.modelo = new CadenaModelo();
        this.mundo.nombre = i18.APPS.CADENA.MUNDO.NOMBRE;
        /**
         * APLICACIÓN PARA EL ESTUDIO DEL APRENDIZAJE INTELIGENTE
         * FUNDAMENTOS DE IA + TEORIA LENGUAJES PROGRAMACION
         */
        this.situada = new CadenaFIASituada();
        this.situada.mundo = this.mundo;

        this.simbolica = new CadenaFIARedSemantica();
        this.simbolica.mundo = this.mundo;

        this.conexionista = new CadenaFiaRedNeuronal();
        this.conexionista.mundo =  this.mundo;

        const salidas = await Promise.all(
            [
                this.mundo.ciclo(),
                //this.situada.instanciar(),
                this.simbolica.instanciar(),
                //this.conexionista.instanciar()
            ]
        );

        if (typeof salidas == 'object') {
            return `${i18.APPS.CADENA.SIMULATION_END}`;
        } else {

        }

    }
}