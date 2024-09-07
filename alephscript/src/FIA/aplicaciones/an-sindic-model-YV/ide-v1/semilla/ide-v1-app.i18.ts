export const IDE_MUNDO_i18 = {

    MUNDO: {

        NOMBRE: "mundo-v1",
        MODELO: "modelo-v1",
        INICIO_LABEL: "¡Mundo iniciado!",
        FIN_LABEL: "¡Mundo acabado!",

        DIA_LABEL: "Hoy es el día:",

        EJEMPLOS_CADENA_LABEL: "IDE",

        AFERENCIA: {
            RECEPCION_LABEL: "El mundo ha recibido una eferencia. Actualizando modelo.",
            AFERENCIA_RECOMENDACIONES_LABEL: "Evaluación MLL:"

        }
    }
}

export const IDE_SITUADA_i18 = {

    SITUADA: {
        NOMBRE: "ide.v1.situada",

        SIMULATION_START: "Hola soy un autómata situado.",
        SIMULATION_BODY: "Modelo resultante",
        SIMULATION_END: "¡Simulación finalizada!",
        AUTOMATA: {

            NOMBRE: "ide.situada.automata",

            RECEPCION_AFERENCIA_LABEL: "El mundo envía una aferencia. Voy a realizar la transición de estado.",
            ENVIO_EFERENCIA_LABEL: "¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.",
        }
    }

}

export const AS_APP_IDE_i18 = {

    IDE: {

        NOMBRE: "IDE-v1-app",

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

export const ide_v1_app_i18 = {

	IDEv1: {

        NOMBRE: "IDEAppv1",

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