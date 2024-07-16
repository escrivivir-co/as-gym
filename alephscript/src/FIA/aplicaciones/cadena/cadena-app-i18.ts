import { CADENA_MUNDO_i18 } from "./mundo/cadena-mundo-i18";
import { CADENA_SITUADA_i18 } from "./situada/cadena-situada-i18";
import { CADENA_SIMBOLICA_i18 } from "./simbolica/cadena-simbolica-i18";
import { CADENA_CONEXIONISTA_i18 } from "./conexionista/cadena-conexionista-i18";

export const APP_CADENA_i18 = {

    CADENA: {

        NOMBRE: "cadena-app",

        SIMULATION_START: "Modelización cadena de producción. ¡Arrancando simulación!",
        SIMULATION_BODY: "Modelo resultante",
        SIMULATION_END: "¡La aplicación ha concluído y se cierra!",

        TEST: {
            PROBAR_START_LABEL: "¡Arrancando secuencia de pruebas!",
            PROBAR_END_LABEL: "¡La secuencia de pruebas ha concluído!",

            CASO: {
                START_LABEL: "\n\t - Lanzando caso: ",
                BODY_LABEL: "\n\t - Evaluando caso: ",
                END_LABEL: "\n\t - Resultado caso: ",

                BUCLE: {
                    CREAR_REGLA_LABEL: "Creada regla:"
                }
            }

        },

        ...CADENA_MUNDO_i18,

        ...CADENA_SITUADA_i18,
        ...CADENA_SIMBOLICA_i18,
        ...CADENA_CONEXIONISTA_i18

    }

}