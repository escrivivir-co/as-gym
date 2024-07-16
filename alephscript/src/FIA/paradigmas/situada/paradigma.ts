import { Aferencia } from "../../Intencion";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/mundo";
import { FIASituada } from "./fia-situada"

export namespace IASituada {

    export const fiaSituada = new FIASituada();

    fiaSituada.nombre = i18.FIA_SITUADA_LABEL;
    fiaSituada.razona =
        (w: IMundo, i: Aferencia) => {
        return "Sí";
    }

}
