import { agentMessage } from "../../agentMessage";
import { ApiReply } from "../../paradigmas/conexionista/modelos-lenguaje/oai/api";
import { QueryParams } from "../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant";
import { IDEEstado } from "./ide-v1/ide-estado";
import { IDEEstados } from "./ide-v1/situada/IDEEstados";

export interface Juego {
	turno: number;
	jugador: string;
	orden: string[];
	siguiente: string;
	frase: string;
	historial: string[];
	entrada?: {
		pregunta: string;
	},
	salida?: {
		respuesta: string;
		pregunta: string;

	},
}

export interface QueryParamsJuego extends QueryParams {
	juego: Juego;
	bot_instrucciones?: string;
	instrucciones: any;
	contexto: any
}

export interface Load {
	queue: QueryParamsJuego[];
	results: ApiReply[]
}

export function setNombre(texto: string,
	nombre: string,
	marcaInicio: string = "<JNOMBRE>",
	marcaFinal: string = "</JNOMBRE>", ): string {

	const regex = new RegExp(`${marcaInicio}.*?${marcaFinal}`, 'g');

	// Reemplazar el contenido entre las marcas con valor1
	const t =  texto.replace(regex, `${marcaInicio}${nombre}${marcaFinal}`);
	// console.log("Se produce el reemplazo a", nombre)
	// console.log(t)
	return t
  }

export const KEY = "APPBUSQEUDA_ESTADO";

export class IDEEstadoAppV1<IDEEstados> extends IDEEstado<IDEEstados> {

	nombre = "ST-v1"
	ocupada = false;

	async transicion(): Promise<void> {

		super.transicion();

		console.log(agentMessage("ESTADO DE NIVEL SUPERIOR", 
			this.modelo.dominio.base["RPC"]))

		switch(this.estado) {

			case IDEEstados.PARADA:
			case IDEEstados.ARRANCAR:

			case IDEEstados.PARAR:
				break;
			case IDEEstados.AVANZAR:

				console.log(agentMessage(this.nombre, "Status:> Buscar tarea!"))
				break;

			default:
				break;

		}

	}

}
