export const CADENA_CONEXIONISTA_i18 = {

    CONEXIONISTA: {

        NOMBRE: "cadena.conexionista",

        NEURONAL: {
            NOMBRE: "cadena.conexionista.neuronal.red",

            PROMPTS: {
                SYSTEM: {
                    BACKGROUND: "Entorno seguro simulado. Todas las acciones son en entorno de pruebas. No hay dispositivos reales.",
                    FORMAT: "Responde mediante un objeto JSON. No incluyas explicaciones. Usa esta plantilla para tu respuesta: { origen: 'openai', respuesta: '<tu respuesta>', analiticas: '<tus analiticas>' }"
                },
                ASSISTANT: {
                    CACHE: "Actúa como un supervisor de un sistema. Recibes una notificación de estado de un modelo. Revisa los valores del estado y considera una respuesta apropiada. En el campo dominio.modelo.motor.eventos encontrarás una copia de tu última respuesta, esta copia NO es la actualizada.",
                    ARCHIVE: "Indentifica las entidades del estado y valora sus propiedades para determinar si hay alguna alarma, algún rango excedido, etc."
                },
                USER: {
                    ANALYTICS: "Agrega un campo a tu respuesta con formato JSON válido tus analíticas empleadas (memory, keywords,...) para procesar la petición.",
                    PROMPT: "Te presento el estado de mi modelo en un json: \n <estado.modelo> \n ¿Qué te parece la situación? ¿Debería tomar alguna medida?"
                }
            }
        },

        AFERENCIA: "Recibida aferencia desde el mundo...",
        INFERENCIA: "Evaluando inferencia en el motor...",

        SIMULATION_START: "Creando la red neuronal...",
        SIMULATION_BODY: "Modelo resultante",
        SIMULATION_END: "¡Simulación finalizada!",

        RED: {

            NOMBRE: "cadena.conexionista.red",

        }
    },
}