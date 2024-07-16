import { AS_MARCOS_i18 } from "./modelos/conceptual/marcos/as-marcos-i18";
import { AS_SEMANTICA_i18 } from "./modelos/formal/sistema/semantica/as-semantica-i18";

export const AS_SIMBOLICA_i18 = {

    FIA_SIMBOLICA_LABEL: "simbolica",

    SIMBOLICA: {
        ...AS_SEMANTICA_i18,
        ...AS_MARCOS_i18
    },

}