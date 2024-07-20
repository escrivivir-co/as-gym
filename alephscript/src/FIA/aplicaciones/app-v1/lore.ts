import { Juego, QueryParamsJuego } from "./appv1-estado";

export const tablero: Juego =  {
	turno: 1,
	jugador: 'Bot.Temple',
	orden: ['Bot.Omega', 'Bot.Temple', 'Bot.Alpha'],
	siguiente: 'Bot.Alpha',
	frase: "Preguntas encadenadas sobre P vs NP",
	entrada: {
		pregunta: "¿Cuál es la solución al problema P vs NP?",
	},
	salida: {
		respuesta: "<Aquí tu respuesta>",
		pregunta: "<Aquí tu nueva pregunta>"
	},
	historial: []
}

export const tablero1: Juego =  {
	turno: 1,
	jugador: 'Bot.Omega',
	orden: ['Bot.Temple', 'Bot.Omega', 'Bot.Alpha'],
	siguiente: 'Bot.Alpha',
	frase: 'En un lugar de la mancha de cuyo nombre no quiero acordarme',
	historial: []
}

export const sJuego = `
Definición de la INTERFAZ DE RESPUESTA:
\n
interface Entrada {
{
	pregunta: string;	// La pregunta que debes responder
}

interface Salida {
{
	respuesta: string;	// Tu respuesta a la pregunta de 'Entrada'
	pregunta: string;	// La pregunta para el siguiente jugador

}
\n
interface Historial {
	turno: number;	// Turno en el que la respuesta fue dada
	autor: string,
	pareja: Datos	// Entrada.pregunta + Salida.respuesta
}
\n
interface Juego {
	turno: number;
	jugador: string;
	orden: string[];
	siguiente: string;
	frase: string;
	entrada: Partial<Datos>;
	salida: Datos;
	historial: Historial[];
}
\n`;

export const sJuego1 = `
Definición de la INTERFAZ DE RESPUESTA:

\n
interface Historial {
	autor: string,
	frase: string
}
\n
interface Juego {
	turno: number;
	jugador: string;
	orden: string[];
	siguiente: string;
	frase: string;
	historial: Historial[];
}
\n`;

export const q: QueryParamsJuego = {
	id: "K1",
	assistant_id: "",
	instrucciones: "Hola, te llamas <JNOMBRE>Bot.Alpha</JNOMBRE>. " +
		"\n Sois varios jugadores particpando por turnos. El juego es 'preguntas/respuestas encadenadas'." +
		"\n Regla: 'Cada turno un participante recibe 'entrada' y deberá rellanar 'salida', repondiendo a la pregunta de 'entrada' y, sobre el tema, según la configuración de cada asistente, proponiendo la siguiente pregunta que ayude a esclarecer el tema en 'salida'. DEBES GENERAR TANTO UNA NUEVA PREGUNTA COMO UNA RESPUESTA A LA ANTERIOR. El campo 'frase' contiene el título del juego y debe manterse. " +
		"\n IMPORTANTE: AÑADE AL ARRAY DEL CAMPO HISTORIAL TU RESPUESTA. DEBES SUMAR 1 UNIDAD AL CAMPO TURNO." +
		"\n Si el campo 'siguiente' corresponde con tu nombre debes agregar un nuevo mensaje a la secuencia y aumentar el número de turno. " +
		"\n Cada respuesta debe actualizar el campo 'historial' agregando el mensaje recibido del jugador anterior como un json de tipo Historial ." +
		"\n Además, debes actualizar los campos 'jugador' con tu nombre y escoger un valor de 'orden' para establecerlo en el campo 'siguiente'. " +
		"\n Es importante que la conversación avance y no se repita lo anterior sino que lo extienda y complemente. " +
		"\n Usa la descripción como asistente que tienes configurada para escoger tus pregunta/respuesta. " +
		"\n ¿Listo? Activa modo json. Respeta exactamente los campos de la INTERFAZ DE RESPUESTA." + sJuego + JSON.stringify(tablero),
	juego: undefined,
	contexto: undefined,
	solicitud: ""
}


export const q1: QueryParamsJuego = {
	id: "K1",
	assistant_id: "",
	instrucciones: "Hola, te llamas <JNOMBRE>Bot.Alpha</JNOMBRE>. " +
		"\n Sois varios jugadores. El juego es 'frases encadendas'." +
		"\n Regla: 'Cada turno un participante agregar una frase a la historia a partir de lo anterior'. " +
		"\n En general, el mensaje recibido se añade a 'historial' y rellenas tú los campos con la siguiente frase y actualizas la respuesta con las instrucciones dadas. " +
		"\n Si el campo 'siguiente' corresponde con tu nombre debes agregar un nuevo mensaje a la secuencia y aumentar el número de turno. " +
		"\n Cada respuesta debe actualizar el campo 'historial' agregando el mensaje recibido del jugador anterior como un json { autor: string, frase: string }." +
		"\n Además, debes actualizar los campos 'jugador' con tu nombre y escoger un valor de 'orden' para establcer lo en 'siguiente'. " +
		"\n Es importante que la nueva frase no repita lo anterior sino que lo extienda y complemente. " +
		"\n Usa la descripción como asistente que tienes configurada para escoger tu frase. " +
		"\n ¿Listo? Activa modo json. Respeta exactamente los campos de la INTERFAZ DE RESPUESTA." + sJuego + JSON.stringify(tablero),
	juego: undefined,
	contexto: undefined,
	solicitud: ""
}

export const INSTRUCCIONES_DE_CORRECION = "Tu última ([1] Respuesta) no ha estado bien, no trae solo json o no respeta la interfaz pactada." +
	" \n ¿Puedes volver a generarla? Por favor localiza la INTERFAZ DE RESPUESTA y devuelve un JSON correcto que la implemente. " +
	" \n Error: " + "<ERROR>" +
	" \n ([1] Respuesta): " + "<RESPUESTA>" +
	" \n Datos para regenerar la respuesta: " + "<PARAMS>"