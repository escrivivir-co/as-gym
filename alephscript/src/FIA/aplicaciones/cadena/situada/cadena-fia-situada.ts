import { GenesisBlock } from "../../../genesis-block";
import { i18 } from "../../../i18/aleph-script-i18";
import { agentMessage } from "../../../agentMessage";
import { CadenaEstados } from "./cadena-estado";
import { CadenaAutomata } from "./cadena-automata";
import { FIASituada, IFIASituada } from "../../../paradigmas/situada/fia-situada";

// export namespace IASituada {

    export const TOPE_POSICION = 10;

    export class CadenaFIASituada extends FIASituada implements IFIASituada {

        nombre = i18.APPS.CADENA.SITUADA.NOMBRE;
        runAsync = true;

        automata = new CadenaAutomata<CadenaEstados>();

        async instanciar(): Promise<string> {

            console.log(agentMessage(this.nombre, i18.SITUADA.SIMULATION_START));

            /**
             * * Autómata que representa la cinta transportadora de la cadena de producción
             */
            this.automata.mundo = this.mundo;
            this.automata.configurar();
            await this.automata.inicializar();

            console.log(
                agentMessage(this.nombre,
                `${i18.SITUADA.SIMULATION_BODY}:${this.automata.mundo.modelo.imprimir()}`)
            );
            console.log(i18.SISTEMA.ENTER_PARA_SEGUIR);
            return `${i18.SITUADA.SIMULATION_END}`;
        }
    }

// }

export namespace IASituadaCadenaProduccion {

    export const fiaCadena = new CadenaFIASituada();

    fiaCadena.nombre = i18.SITUADA.CADENA.NOMBRE;

}