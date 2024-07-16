import { GenesisBlock, iFIA } from "../../genesis-block";
import { Intencion } from "../../Intencion";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/mundo";
import { IProblema, IRequisitos, ISolucion } from "./modelos/formal/inferencia/relacion/paradigma";
import { IModeloRepresentacional } from "./paradigma";

/**
 * Modelos de representación basados en redes semánticas,
 * marcos, etc.
 */
export interface IFIASimbolica extends iFIA {

    modelo: IModeloRepresentacional;

    analisis: (p: IProblema) => ISolucion[];
    sintesis: (r: IRequisitos) => ISolucion;
    modificacion: (s: ISolucion) => IMundo;
}

export class FIASimbolica extends GenesisBlock implements IFIASimbolica {

    modelo: IModeloRepresentacional;

    analisis: (p: IProblema) => ISolucion[];
    sintesis: (r: IRequisitos) => ISolucion;
    modificacion: (r: ISolucion) => IMundo;
}

export namespace FIASimbolica {

    export const fiaSimbolica = new FIASimbolica();

    fiaSimbolica.nombre = i18.FIA_SIMBOLICA_LABEL;
    fiaSimbolica.razona =
        (w: IMundo | string, i: Intencion) => {
            return "No";
        }

}