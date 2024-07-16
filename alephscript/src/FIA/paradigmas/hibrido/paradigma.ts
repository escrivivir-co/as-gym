import { Aferencia } from "../../Intencion";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/mundo";
import { FIAHibrida } from "./fia-hibrida";

export namespace IAHibrida {

    export const fiaHibrida = new FIAHibrida();

    fiaHibrida.nombre = i18.FIA_SITUADA_LABEL;
    fiaHibrida.razona =
        (w: IMundo, i: Aferencia) => {
        return "Sí";
    }

}
