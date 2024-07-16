import { agentMessage } from "../../../../agentMessage";

import { i18 } from "../../../../i18/aleph-script-i18";
import { FIASituada, IFIASituada } from "../../../../paradigmas/situada/fia-situada";
import { IDEAutomata } from "./ide-automata";
import { IDEEstados } from "./ide-estado";
import { IDE_SITUADA_i18 } from "./ide-situada-i18";

export class IDEFIASituada extends FIASituada implements IFIASituada {

        i18 = IDE_SITUADA_i18.SITUADA;

        nombre = this.i18.NOMBRE;

        runAsync = true;

        automata = new IDEAutomata<IDEEstados>();

        async instanciar(): Promise<string> {

            console.log(agentMessage(this.nombre, this.i18.SIMULATION_START));

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
