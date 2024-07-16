import { iFIA, GenesisBlock, IAccion, IPercepto, IAprendize } from "../../genesis-block";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/mundo";
import { agentMessage } from "../../agentMessage";
import { IFIAConexionista } from "../conexionista/fia-conexionista";
import { IFIASimbolica } from "../simbolica/fia-simbolica";
import { IEstado } from "../situada/estado";
import { IFIASituada } from "../situada/fia-situada";

/**
 * Paradigma de IA de nivel superior, mediante la aglutinación
 * de otras IAs.
 */
export interface IFIAHibrida extends iFIA {

    fias: iFIA[];

    situada: IFIASituada;
    simbolica: IFIASimbolica;
    conexionista: IFIAConexionista;

}

export class FIAHibrida extends GenesisBlock implements IFIAHibrida {

    runAsync = true;

    fias: iFIA[] = [];

    situada: IFIASituada;
    simbolica: IFIASimbolica;
    conexionista: IFIAConexionista;

    async instanciar(): Promise<string> {

        console.log(agentMessage(i18.FIA_HIBRIDA_LABEL, i18.HIBRIDA.SIMULATION_START));

        console.log(
            agentMessage(i18.FIA_HIBRIDA_LABEL,
            `${i18.HIBRIDA.SIMULATION_BODY}:${this.fias.length}`)
        );
        return `${i18.HIBRIDA.SIMULATION_END}`;
    }

    razona(m: IMundo, i: IEstado):  IAccion {

        return null;
    }

    abstrae: (p: IPercepto) => IAprendize;

}