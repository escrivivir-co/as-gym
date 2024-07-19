import { agentMessage } from "../../agentMessage";
import { IModelo } from "../../mundos/IModelo";
import { QueryParams } from "../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant";
import { IDEEstado } from "./ide-v1/ide-estado";
import { IDEEstados } from "./ide-v1/situada/IDEEstados";
import { ApiReply } from "../../paradigmas/conexionista/modelos-lenguaje/oai/api";
import { Assistant } from "openai/resources/beta/assistants";
import { INSTRUCCIONES_DE_CORRECION } from "./lore";

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

export const KEY = "APP1_ESTADO";

export class IDEEstadoAppV1<IDEEstados> extends IDEEstado<IDEEstados> {

	nombre = "ST-v1"

	ocupada = false;
	onAssistantsReady: (as: Assistant[], caller?: string) => void;

	async transicion(): Promise<void> {

		super.transicion();

		console.log(agentMessage("APP_PROGRESS_2", this.nombre + "OnT!"))

		switch(this.estado) {

			case IDEEstados.PARADA:
			case IDEEstados.ARRANCAR:
			case IDEEstados.PARAR:
				break;
			case IDEEstados.AVANZAR:

				console.log(agentMessage(this.nombre, "Status:> Buscar tarea!"))

				this.onAssistantsReady(this.ide.listaAsistentes(), this.assistanceName);

					const interval = setInterval(() => {

						if (this.ocupada) {
							console.log(agentMessage(this.nombre, "Status:> Buscando..."))
						} else {
							clearInterval(interval);
							this.trigger()
						}

					}, 500)

			default:

		}

	}

	async trigger() {

		const api = this.getApi();

		if (api.queue.length > 2) {
			console.log("Alerta queue", api.queue)
		}

		console.log(agentMessage(this.nombre + "/" + this.assistanceName, "Registro de carga:", ""), api.queue.length)

		let request: QueryParamsJuego;

		// INTENTA CORRER UNA SOLICITUD FUERA DEL JUEGO -- RACE CONDITION ENTRE TODOS LOS BOTS
		let i = api.queue.findIndex(s => s.instrucciones && (!s.bot_instrucciones || s.bot_instrucciones == this.assistanceName.replace("Asist.", "")));
		if (i > -1) {
			console.log(agentMessage(this.nombre + "/" + this.assistanceName, "TAREA DE INSTRUCCIONES:", ""), api.queue.length)
			request = api.queue[i];
			api.queue.splice(i, 1);
			request.solicitud = request.instrucciones
		}

		const jugadorName = this.assistanceName.replace("Asist.", "");
		// INTENTA CORRER UNA SOLICITUD DEL JUEGO ASOCIADA AL BOT
		if (!request) {
			// console.log(agentMessage(this.nombre + "/" + this.assistanceName, "TAREA DE JUEGO:", ""), 
			// this.assistanceName, api.queue.map(s => s?.juego.siguiente))
			i = api.queue.findIndex(s => s.juego?.siguiente == jugadorName)
			request = i > -1 ? api.queue[i] : null
			if (request) {
				console.log(agentMessage(this.nombre + "/" + this.assistanceName, "TAREA DE JUEGO:", ""), api.queue.length)
				api.queue.splice(i, 1);
				request.solicitud = JSON.stringify({
					contexto: request.contexto,
					turno: request.juego
				})
			}
		}

		if (request) {

			console.log(agentMessage("APP_PROGRESS_2", "Bot: " + this.nombre))

			request.solicitud = setNombre(request.solicitud, jugadorName)
			request.contexto = setNombre(request.contexto, jugadorName)
			request.instrucciones = setNombre(request.instrucciones, jugadorName)

			console.log(agentMessage("APP_PROGRESS_3", request.solicitud))
			console.log(agentMessage(this.nombre + "/" + this.assistanceName, "TAREA ENCONTRADA:", ""), api.queue.length)

			this.ocupada = true;
			const r = await this.runQuery(request)
			this.ocupada = false;

			api.results.push(r);
		} else {
			 console.log(agentMessage(this.nombre + "/" + this.assistanceName, "NO SE HA ENCONTRADO UNA TAREA!"))
		}
	}

	getApi(): Load {
		return this.modelo.dominio.base[KEY] || {
			queue: [], /* QueryParams[] = */
			results: [] /* ApiReply[] = */
		}
	}

	static addQuery(modelo: IModelo, param: QueryParamsJuego) {

		const api = modelo.dominio.base[KEY] || {
			queue: /* QueryParams[] = */ [],
			results: /* ApiReply[] = */ []
		}
		api.queue.push(param)
		modelo.dominio.base[KEY] = api

		console.log(agentMessage("APP_PROGRESS_1",
			(param.instrucciones ? "> M" : "> A ") +
			"(" + api.queue.length + ")"), modelo.nombre)
	}

	async runQuery(param: QueryParamsJuego) {

		/*console.log(agentMessage(this.nombre,
			"Carga de datos EXPANDIDA que se envían:[>", ""), );
				console.log(param)
			// ZONA DE LOGS
		console.log(agentMessage(this.nombre, "<]", ""));*/

		let mensaje: any;
		let texto: any;
		let value: any;
		let m: any;

		try {

			param.assistant_id = param.assistant_id || this.assistanceId /* || this.ide.assistant.id*/;
			if (!param.assistant_id) {
				console.log(this.assistanceId, this.assistanceName, this.nombre)
				return
			}
			param.bot_info = this.assistanceName.replace("Asist.", "")
			const asName = this.ide
				.listaAsistentes().find(a => a.id == param.assistant_id)?.name || param.assistant_id
			/* console.log(agentMessage(this.nombre,
				`runQuery: Mensaje ${ param.solicitud?.substring(0, 15) + "..." }`)); */
			console.log(agentMessage("APP_PROGRESS_4",
				"IA: " + asName + ":>" + param.assistant_id + ":>" + this.assistanceName + ":>" + param.bot_info + ":>" + this.nombre))

			const res = await this.ide.trainer.crearHilo(param);

			if (res.ok) {
				const data = res.data.data.map(m => m.content.map(mm => JSON.stringify(mm)));

				const mensajes: any[] = data[0];
				if (mensajes.length < 1) {
					console.log(agentMessage(this.nombre, "No hay mesajes", ""));

				} else {
					mensaje = JSON.parse(mensajes[mensajes.length - 1])
					texto = mensaje?.text
					value = texto?.value

					value = value.replace("```json", "").replace("```", "")
					m = JSON.parse(value)

					console.log(agentMessage(this.nombre,
						"El hilo tiene mensajes: " + mensajes.length +
						". Respuesta [>", ""), );

						// ZONA DE LOGS

					console.log(agentMessage(this.nombre, "<]", ""));

					console.log(agentMessage("APP_PROGRESS_5", mensajes[mensajes.length - 1]))

					// Encolar siguiente peticion
					IDEEstadoAppV1.addQuery(
						this.modelo,
						{
							juego: m,
							assistant_id: "",
							solicitud: "",
							instrucciones: "",
							contexto: param.contexto
						}
					);

					const printJuego = (juego) => {
						const ret = {
							...juego,
							historial: juego.historial.map(f => JSON.stringify(f))
						}
						return ret;
					}
					console.log(agentMessage(this.nombre,
						"La cola tiene mensajes: " + this.getApi().queue.length +
						". Mensajes [>", ""), );

					console.log(
						agentMessage(
							"ASCREEN",
							JSON.stringify(
								this.getApi().queue
									.map(q => printJuego(q.juego) || q)
							)
						),
						"<]"
					);

				}

				return res;
			} else {
				console.log(agentMessage(this.nombre, res.data));
				console.log(res)
				return null
			}
		} catch(ex) {

			console.log(ex.message)

			console.log(agentMessage(this.nombre,
				"Contexto del error: [>", ""), this.assistanceName);
				console.log(mensaje)
				console.log(texto)
				console.log(value)
				console.log(m)
			console.log(agentMessage(this.nombre, "<]", ""));

			console.log(agentMessage("APP_PROGRESS_4",
				"IA Error. Repetir! " + this.ide.listaAsistentes().find(a => a.id == param.assistant_id)?.name))

			// ENVIAR ERROR AL GENERAL
			IDEEstadoAppV1.addQuery(
				this.modelo,
				{
					juego: m,
					assistant_id: "",
					solicitud: "",
					bot_instrucciones: this.assistanceName.replace("Asist.", ""),
					instrucciones: INSTRUCCIONES_DE_CORRECION
						.replace("<ERROR>", ex)
						.replace("<RESPUESTA>", JSON.stringify(mensaje))
						.replace("<PARAMS>", param.solicitud),
					contexto: param.contexto
				}
			)
			return null

		}
	}
}
