import { Juego, QueryParamsJuego } from "./appv1-estado";

export const BASIC_PROMPT_DEV_HELP = "Crea un programa básico, 'app.pl', que defina un par de sensores y otro par de actuadores. El módulo exportará todos los métodos necesarios para: a) Monitorizar el estado de los sensores, b) Activar un valor en algún actuador.";

export const tablero: Juego =  {
	ram: { data: "", index: [] },
	request: "",
	response: undefined,
	analytics: { report: undefined, metrics: [] }
}

export enum AN_VF_States {
	"0_" = "Propiedad de los medios",
	"1_" = "Distribución de recursos",
	"2_" = "Roles y toma de decisiones",
	"3_" = "Mercado",
	"4_" = "Transparencia y control",
	"5_" = "Descentralización del poder",
	"6_" = "Mecanismo de asignación",
	"7_" = "Intercambio de bienes",
	"8_" = "Tecnología"
}
export const sJuego = `
Definición Typescript, de la INTERFAZ DE RESPUESTA:


\n
interface Completion
{
	ram: object;				// A RAM like memory storage object to keep tracked most relevant keys from conversation context. Calculated by you. Store here any relevant information to trace this conversation. Include things like history, tasks, goals,...
	request: string;			// The original question from this prompt. Can be croped if needed.
	response: string;			// Your answer as plain when you need to add further explanations in natural language.
	code: string | string[];	// If the prompt requires code generation this fields holds the code raw ready to compile. If more than one file is edit, fill array one per each code file given. For example, if it is a prolog file it must be headed with module definition.
	analytics: object			// A JSON representing the current thread analytics report. Calculated by you and append after each request. You can fill any field on this object.
}
\n`;

export const q: QueryParamsJuego = {
	id: "K1",
	assistant_id: "",
	instrucciones: "Hola, te llamas <JNOMBRE>Bot.Alpha</JNOMBRE>. " +
		"\n ¿Listo? Activa modo json. Respeta exactamente los campos de la INTERFAZ DE RESPUESTA," +
		sJuego +
		"\n solo puedes responder con objetos 'Completation' como los definidos." +
		"\n Eres un experto en Prolog que ayudas en un entorno DevOps de lógica para IoT." +
		"\n Formas parte de un conjunto de agentes que configuran, fletan y monitorizan redes " +
		"\n IoT operadas con lógica de reglas. La ayuda que se te pide puede ser para desarrollo de " +
		"\n  " +
		"\n código prolog como para la operativa. A continuación se indica el propósito concreto: ",
	juego: undefined,
	contexto: undefined,
	solicitud: ""
}

export const INSTRUCCIONES_DE_CORRECION = "Tu última ([1] Respuesta) no ha estado bien, no trae solo json o no respeta la interfaz pactada." +
	" \n ¿Puedes volver a generarla? Por favor localiza la INTERFAZ DE RESPUESTA y devuelve un JSON correcto que la implemente. " +
	" \n Error: " + "<ERROR>" +
	" \n ([1] Respuesta): " + "<RESPUESTA>" +
	" \n Datos para regenerar la respuesta: " + "<PARAMS>"