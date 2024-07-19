import { GenesisBlock } from "../../genesis-block";
import { IAprendize } from "../../IAprendize";
import { IPercepto } from "../../IPercepto";
import { IAccion } from "../../IAccion";
import { iFIA } from "../../iFIA";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/IMundo";
import { agentMessage } from "../../agentMessage";
import { IAutomata, Automata } from "./automata";
import { IEstado } from "./IEstado";
import { TablaEstado } from "./tabla-estado";
import { IModelo } from "../../mundos/IModelo";
/**
 * Unidades de sensores/actuadores con tablas de asociación
 * o autómatas con máquinas de estado. 
 */
export interface IFIASituada extends iFIA {

    tabla: TablaEstado;
    automata: IAutomata;

	instanciarV(): Promise<IModelo>

}

export class FIASituada extends GenesisBlock implements IFIASituada {

	instanciarV(): Promise<IModelo> {
		throw new Error("Method not implemented.");
	}

	configurar?: () => void;

    runAsync = true;

    tabla = new TablaEstado();

    automata = new Automata();

    async instanciar(): Promise<string> {

        console.log(agentMessage(i18.FIA_SITUADA_LABEL, i18.SITUADA.SIMULATION_START));

        this.automata.configurar();

        const modelo = await this.automata.mundo.instanciar();
        console.log(
            agentMessage(i18.FIA_SITUADA_LABEL,
            `${i18.SITUADA.SIMULATION_BODY}:${modelo.imprimir()}`)
        );
        return `${i18.SITUADA.SIMULATION_END}`;
    }

    razona(m: IMundo, i: IEstado):  IAccion {

        const accion = this.tabla.procesarAferencia(i);

        if (accion) {
            m.modelo = accion.comoModelo();
        }

        return accion;
    }

    abstrae: (p: IPercepto) => IAprendize;

}