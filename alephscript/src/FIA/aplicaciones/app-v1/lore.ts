import { Juego, QueryParamsJuego } from "./appv1-estado";

export const tablero: Juego =  {
	turno: 1,
	jugador: 'Bot.Omega',
	orden: ['Bot.Temple', 'Bot.Omega', 'Bot.Alpha'],
	siguiente: 'Bot.Alpha',
	frase: 'En un lugar de la mancha de cuyo nombre no quiero acordarme',
	historial: []
}

export const sJuego = `
Definición de la INTERFAZ DE RESPUESTA: \n

interface Juego {
	turno: number;
	jugador: string;
	orden: string[];
	siguiente: string;
	frase: string;
	historial: string[];
}
	\n`;

export const q: QueryParamsJuego = {
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