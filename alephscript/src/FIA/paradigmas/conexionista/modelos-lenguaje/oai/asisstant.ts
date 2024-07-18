import { Api, ApiReply } from "./api";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { agentMessage } from "../../../../agentMessage";
import { RTCache } from "../../../../engine/kernel/rt-cache";
import { Assistant, AssistantListParams } from "openai/resources/beta/assistants";

// When launch API Assistant query, you need to polling to get the answer
const runRetryTime = 5000

let LAST_THREAD = "";

const rt = new RTCache()

export interface QueryParams {
	id?: string;
	assistant_id: string;
	solicitud: string;
	bot_info?: string;
}


export class AsistenteApi extends Api {

	nombre = "oraculo-assistant-api";
	cache = new RTCache();
	usando = false;

	constructor() {
		super()
	}

	async asistente(ASOracleAs: Partial<Assistant>): Promise<ApiReply> {

		try {

			const response = await this.openai.beta.assistants.retrieve(ASOracleAs.id);
			const data = response;

			return {
				ok: true,
				data
			};

		} catch(error) {

			// Consider adjusting the error handling logic for your use case
			if (error.response) {
				console.error(error.response.status, error.response.data);
				return { ok: false, data: error.response.data.error.message }
			} else {
				console.error(`Error with OpenAI API request: ${error.message}`);
				return { ok: false, data: 'An error occurred during your request.' }
			}

		}

	}

    async list (messages: any[]): Promise<ApiReply> {
		try {

			const query: AssistantListParams = {
            };

			const response = await this.openai.beta.assistants.list(query);
			const data = response.data;

			return {
				ok: true,
				data
			};

		} catch(error) {

			// Consider adjusting the error handling logic for your use case
			if (error.response) {
				console.error(error.response.status, error.response.data);
				return { ok: false, data: error.response.data.error.message }
			} else {
				console.error(`Error with OpenAI API request: ${error.message}`);
				return { ok: false, data: 'An error occurred during your request.' }
			}

		}
	}

	imprimir(lista: Assistant[]) {
		return `Asistentes: ${lista.length}
			${lista.map(a => "\n\t --> " + this.imprimirAsistente(a)).join("")}
		`;
	}

	imprimirAsistente(a: Assistant) {
		return `Asistente: ${a.name}, ${a.model}, \n ${a.instructions}
			${a.tools.map(a => "\n\t\t --> " + a.type).join("")}
		`;
	}

	async crearHilo(params: QueryParams): Promise<ApiReply> {

		return new Promise(async (resolve, reject) => {

			try {

				if (!this.usando) {
					this.usando = true;

					const p: ThreadCreateParams = {
						messages : [
							{
								"role": "user",
								"content": params.solicitud
							}
						]
					}

					console.log(agentMessage(this.nombre + "/" + params.bot_info,
						"Carga de datos que se envían:[>", ""), );
							console.log(params.solicitud)
						// ZONA DE LOGS
					console.log(agentMessage(this.nombre + "/" + params.bot_info, "<]", ""));

					console.log(agentMessage(this.nombre + "/" + params.bot_info, "Resolución de ThreadID", ""), LAST_THREAD);

					if (LAST_THREAD) {

						console.log(agentMessage(this.nombre + "/" + params.bot_info, "Reciclando ThreadID", ""), LAST_THREAD);

					} else {
						LAST_THREAD = (rt.leer("API_ASSISTANTE_THREAD_IDS") || { thread: "" }).thread;
					}

					if (LAST_THREAD) {

						console.log(agentMessage(this.nombre + "/" + params.bot_info, "Reciclando ThreadID", ""), LAST_THREAD);

					} else {

						console.log(agentMessage(this.nombre + "/" + params.bot_info,
							"Creando API Thread", /* con payload: " + JSON.stringify(p)*/
						));
						const thread = await this.openai.beta.threads.create(p);
						LAST_THREAD = thread.id;
						console.log(agentMessage(this.nombre + "/" + params.bot_info,
							"Guardando API Thread en cache: " + LAST_THREAD,
						));
						rt.guardar("API_ASSISTANTE_THREAD_IDS", { thread: LAST_THREAD });
						rt.persistir()

					}

					console.log(agentMessage(this.nombre + "/" + params.bot_info,
						"Crear run: " + LAST_THREAD + JSON.stringify({ assistant_id: params.assistant_id }),
					));

					const run = await this.openai.beta.threads.runs.create(
						LAST_THREAD,
						{ assistant_id: params.assistant_id }
					);

					console.log(agentMessage(this.nombre + "/" + params.bot_info,
						"Run lanzado, se espera respuesta. Cada " + runRetryTime / 1000 + " secs: " + LAST_THREAD + "/" + run.id)
					);

					let intervalRetries = 0;
					const s = setInterval(async () => {

						intervalRetries++;

						console.log(agentMessage(this.nombre + "/" + params.bot_info,
							"Intento: [" + intervalRetries + "] Comprobar estado run run: " + LAST_THREAD + "/" + run.id)
						);
						const r = await this.openai.beta.threads.runs.retrieve(
							LAST_THREAD,
							run.id
						);

						if (r.status === "completed") {
							console.log(agentMessage("inner.assistant. thread-run-status", r.thread_id + "/" + r.id + ": " + r.status));

							const refreshThread = await this.openai.beta.threads.messages.list(LAST_THREAD);
							clearInterval(s);
							this.usando = false;
							resolve({
								ok: true,
								data: refreshThread
							});
						} else {
							console.log(agentMessage("inner.assistant. thread-run-status", r.thread_id + "/" + r.id + ": " + r.status))
						}

					}, runRetryTime)
				} else {
					console.log(agentMessage(this.nombre + "/" + params.bot_info, "El agente se ha colgado!! :-(", ""), LAST_THREAD);
				}

			} catch(error) {

				// Consider adjusting the error handling logic for your use case
				if (error.response) {
					console.error(error.response.status, error.response.data);
					reject({ ok: false, data: error.response.data.error.message });
				} else {
					console.error(`Error with OpenAI API request: ${error.message}`);
					reject ( { ok: false, data: 'An error occurred during your request.' })
				}

			}
		})
	}
}