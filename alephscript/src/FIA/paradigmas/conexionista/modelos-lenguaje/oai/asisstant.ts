import { Assistant, AssistantListParams } from "openai/resources/beta/assistants/assistants";
import { Api, ApiReply } from "./api";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { agentMessage } from "../../../../agentMessage";
import { RTCache } from "../../../../engine/kernel/rt-cache";

export class AsistenteApi extends Api {

	nombre = "oraculo-assistant-api";
	cache = new RTCache();
	usando = false;

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
			${a.file_ids.map(a => "\n\t\t --> " + a).join("")}
		`;
	}

	async crearHilo(params: {assistant_id: string, solicitud: string }): Promise<ApiReply> {

		return new Promise(async (resolve, reject) => {

			try {

				if (!this.usando) {
					this.usando = true;

					const p: ThreadCreateParams = {
						messages : [
							{
								"role": "user",
								"content": params.solicitud,
								"file_ids": []
							}
						]
					}

					console.log(agentMessage(this.nombre,
						"Crear thread con mensaje: " + JSON.stringify(p)
					));

					console.log(agentMessage(this.nombre,
						"Crear thread con mensaje: " + JSON.stringify(p)
					));
					const thread = await this.openai.beta.threads.create(p);

					console.log(agentMessage(this.nombre,
						"Crear run: " + thread.id + JSON.stringify({ assistant_id: params.assistant_id }),
					));
					const run = await this.openai.beta.threads.runs.create(
						thread.id,
						{ assistant_id: params.assistant_id }
					);

					console.log(agentMessage(this.nombre,
						"Comprobar estado run run: " + thread.id + "/" + run.id)
					);

					const s = setInterval(async () => {

						console.log(agentMessage(this.nombre,
							"Comprobar estado run run: " + thread.id + "/" + run.id)
						);
						const r = await this.openai.beta.threads.runs.retrieve(
							thread.id,
							run.id
						);

						if (r.status === "completed") {
							console.log(agentMessage("inner.assistant. thread-run-status", r.thread_id + "/" + r.id + ": " + r.status));

							const refreshThread = await this.openai.beta.threads.messages.list(thread.id);
							clearInterval(s);
							resolve({
								ok: true,
								data: refreshThread
							});
						} else {
							console.log(agentMessage("inner.assistant. thread-run-status", r.thread_id + "/" + r.id + ": " + r.status))
						}

					}, 20000)
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