import { iFIA, GenesisBlock, IAccion, IPercepto, IAprendize } from "../../genesis-block";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/mundo";
import { agentMessage } from "../../agentMessage";
import { IAutomata, Automata } from "./automata";
import { IEstado } from "./estado";
import { TablaEstado } from "./tabla-estado";

/**
 * Unidades de sensores/actuadores con tablas de asociación
 * o autómatas con máquinas de estado. 
 */
export interface IFIASituada extends iFIA {

    tabla: TablaEstado;
    automata: IAutomata;

}

export class FIASituada extends GenesisBlock implements IFIASituada {

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