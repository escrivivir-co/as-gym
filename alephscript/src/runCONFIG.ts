/* 
********
Chain/Logs
********
*/

/*
Cada vez que se llame a "agentMessage"
se genera un bloque y se guarda en la cache.
*/
export const ACTIVAR_GUARDADO_LOGS = false;

/* 
********
Control de la app (consola vs remote socket)
********
*/

/*
La RT se salta el loop de enviar eventos al Socket.io
*/
export let MODO_CONSOLA_ACTIVADO = false;
export let BORRAR_ESTADO_A_CADA_PLAY_STEP = true

/* 
********
Socket.io
********
*/

/*
Activa los clientes Socket.io
*/
export const ACTIVAR_SOPORTE_SOCKETIO = true;

	/*
	Envía al socket.io los bloques de ACTIVAR_GUARDADO_LOGS.
	*/
	export const SET_EXECUTION_PROCESS = true;

