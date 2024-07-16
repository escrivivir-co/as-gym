import { IDE_MUNDO_i18 } from "./mundo/ide-mundo-i18";

export const AS_APP_IDE_i18 = {

    IDE: {

        NOMBRE: "IDE-app",

        SIMULATION_START: "¡Arrancando simulación!",
        SIMULATION_BODY: "Simulando...",
        SIMULATION_END: "¡La simulación ha concluído y se cierra!",

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

        ...IDE_MUNDO_i18,

    }

}