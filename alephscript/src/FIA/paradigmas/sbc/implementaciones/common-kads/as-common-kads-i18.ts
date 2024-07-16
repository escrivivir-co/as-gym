export const AS_COMMON_KADS_I18 = {

    COMMON_KADS: {

        NOMBRE: "fia.sbc.common.kads",

        CABECERA: "Hola, voy a generar un app siguiendo la metodología Common KADS. 3..., 2..., 1..., ¡lanzando!",

        PIE: "¡Finalizado!",

        CK : {
            NOMBRE: "common.kads",
            CABECERA: "Ejecutaré 3 fases de construcción. Y, a continuación, monitorizaré la aplicación derivada. ¡Vamos!",
            CONSTRUCCION: "Período de construcción. Acabada fase: ",

            FASES: {
                CONTEXTUAL: {
                    NOMBRE: "Nivel Contextual",
                    VIABILIDAD: " NCx.01 Realizado estudio de viabilidad",
                    IMPACTO: " NCx.02 Realizado estudio de impacto y mejoras",
                },
                CONCEPTUAL: {
                    NOMBRE: "Nivel Conceptual",
                    CONOCIMIENTO: " NC.01 Realizado modelo de conocimiento",
                    COMUNICACIONES: "NC.02 Realizado modelo de comunicaciones",
                    ESPECIFICACION: "NC.03 ¡Especificación realizada!",
                    UML: "UML",
                    CML: "CML"
                },
                DISENYO: {
                    NOMBRE: "Nivel Artefactual",
                    SISTEMA: "Se ha creado el sistema."
                }
            },

            EJECUCION: {
                NOMBRE: "Monitorización",
                CABECERA: "¡Sistema resultante! Ejecutándolo...",
                CUERPO: "Ciclo de ejecución:",
                PIE: "Deposición del sistema:",
            },

        },

        SISTEMA: {

            NOMBRE: "common.kads.sistema",

            CABECERA: "¡Arranque!",
            CUERPO: "¡Ciclo!",
            PIE: "¡Deposición!",

            APLICACION: {

                NOMBRE: "common.kads.sistema.app",

                CABECERA: "¡App arranca!",
                CUERPO: "¡App ciclo!",
                PIE: "¡App deposición!",
            }
        },

    }

}