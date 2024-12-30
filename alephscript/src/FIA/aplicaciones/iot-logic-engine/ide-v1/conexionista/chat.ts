import { agentMessage } from "../../../../agentMessage";
import { RTCache } from "../../../../engine/kernel/rt-cache";
import { IModelo } from "../../../../mundos/IModelo";
import { ApiReply } from "../../../../paradigmas/conexionista/modelos-lenguaje/oai/api";
import { AsistenteApi } from "../../../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant";
import { Trainer_clave } from "../../../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { Control } from "../../../../paradigmas/sistemas/busquedas/control";
import { WebScraper } from "../../../../paradigmas/sistemas/scraper/webscraper";
import { QueryParamsJuego } from "../../appv1-estado";
import { SimuladorDAO } from "../../base_conocimiento/dao";
import { INSTRUCCIONES_DE_CORRECION } from "../../lore";
import { IDEModelo } from "../ide-modelo";
import { AlephScriptIDEImpl } from "../semilla/AlephScriptIDEv1";


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

export class ChatHelper {

	nombre = "ChatHelper"

	modelo: IDEModelo;

	assistanceId: string = "";
	assistanceName: string = "";

	private estadoA: any;
	al: Control;
	scrapper: WebScraper;
	engine: SimuladorDAO;
	interval: NodeJS.Timeout;
	ocupada: boolean;

	emitResponse: (data: any) => void = () => { return };

	constructor(public ide: AlephScriptIDEImpl) {}

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

	async inicializarCache() {

		const c = new RTCache();
		c.recuperar();

		const as = c.leerLista(Trainer_clave);

		if (as.length > 0) {

		} else {
			const s = new AsistenteApi();
			const r = await s.list();
			if (r.ok) {
				c.guardar(Trainer_clave, r.data);
				c.persistir();
			}
		}
	}

	async trigger() {

		const api = this.getApi();
		if (api.queue.length == 0) return;

		console.log(agentMessage("ASSISTANT_IA_API", this.nombre + "/" + this.assistanceName + ". Registro de carga:", ""), api.queue.length)

		const jugadorName = this.assistanceName.replace("Asist.", "");
		let request: QueryParamsJuego;
		request = api.queue[0];
		api.queue.splice(0, 1);

		if (request) {

			request.solicitud = request.contexto + request.instrucciones + JSON.stringify(request.juego)

			request.solicitud = setNombre(request.solicitud + "", jugadorName)
			request.contexto = setNombre(request.contexto + "", jugadorName)
			request.instrucciones = setNombre(request.instrucciones + "", jugadorName)

			// console.log(agentMessage("ASSISTANT_IA_API", request.solicitud))
			console.log(agentMessage(this.nombre + "/" + this.assistanceName, "TAREA ENCONTRADA:", ""), api.queue.length)

			this.ocupada = true;
			const r = await this.runQuery(request)

			console.log(agentMessage(this.nombre + "/" + this.assistanceName, "TAREA ENCONTRADA: BACK FROM API", ""), api.queue.length)
			this.emitResponse(r?.data)

			this.ocupada = false;

			//api.results.push(r);
		} else {
			console.log(agentMessage("ASSISTANT_IA_API", "NO SE HA ENCONTRADO UNA TAREA!"))
		}
	}

	getApi(): Load {
		return this.modelo.dominio.base[KEY] || {
			queue: [], /* QueryParams[] = */
			results: [] /* ApiReply[] = */
		}
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
				console.log("Error procesing api", this.assistanceId, this.assistanceName, this.nombre)
				return
			}
			param.bot_info = this.assistanceName.replace("Asist.", "")
			const asName = this.ide
				.listaAsistentes().find(a => a.id == param.assistant_id)?.name || param.assistant_id
			console.log(agentMessage("ASSISTANT_IA_API",
				`runQuery: Mensaje ${ param.solicitud?.substring(0, 15) + "..." }`));
			console.log(agentMessage("ASSISTANT_IA_API",
				"IA: " + asName + ":>" + param.assistant_id + ":>" + this.assistanceName + ":>" + param.bot_info + ":>" + this.nombre))

			console.log("Crear hilo")
			const res = await this.ide.trainer.crearHilo(param);
			console.log("Crear hilo FIM")

			if (res.ok) {
				const data = res.data.data.map(m => m.content.map(mm => JSON.stringify(mm)));

				const mensajes: any[] = data[0];
				if (mensajes.length == 0) {
					console.log(agentMessage("ASSISTANT_IA_API", "No hay mesajes", ""));

				} else {
					mensaje = JSON.parse(mensajes[mensajes.length - 1])
					texto = mensaje?.text
					value = texto?.value

					value = value.replace("```json", "").replace("```", "")
					m = JSON.parse(value)

					console.log(agentMessage("ASSISTANT_IA_API",
						"El hilo tiene mensajes: " + mensajes.length +
						". Respuesta [>", ""), );

						// ZONA DE LOGS

					console.log(agentMessage("ASSISTANT_IA_API", "<]", ""));

					console.log(agentMessage("ASSISTANT_IA_API", mensajes[mensajes.length - 1]))

/*					// Encolar siguiente peticion
					ChatHelper.addQuery(
						this.modelo,
						{
							juego: m,
							assistant_id: "",
							solicitud: "",
							instrucciones: "",
							contexto: param.contexto
						}
					);
*/
					const printJuego = (juego) => {
						const ret = {
							...juego,
							historial: juego.historial.map(f => JSON.stringify(f))
						}
						return ret;
					}
					console.log(agentMessage("ASSISTANT_IA_API",
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
				console.log("Crear hilo OK!")
				return {
					data: mensaje
				};
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
			/*ChatHelper.addQuery(
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
			)*/
		}
		console.log("Crear hilo Queried!")
		return null
	}
}