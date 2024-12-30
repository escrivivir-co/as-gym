import { FunctionDefinition } from "openai/resources";
import { Assistant,  } from "openai/resources/beta/assistants";
import { functionDefinitions } from "./tools";
import { AsistenteApi } from "../../FIA/paradigmas/conexionista/modelos-lenguaje/oai/asisstant";
import { agentMessage } from "../../FIA/agentMessage";
import { QueryParamsJuego, IDEEstadoAppV1 } from "../../FIA/aplicaciones/app-v1/appv1-estado";
import { INSTRUCCIONES_DE_CORRECION } from "../../FIA/aplicaciones/app-v1/lore";

export type FunctionTool = any;
export class OpenAIAssistantManager {

	openai: AsistenteApi;
	assistant: Assistant;

	constructor(public assistantId?: string) {

		this.openai = new AsistenteApi();
	}

	async init() {

		this.assistantId = "asst_oveLZP1UzK4Fks0nOb2EMNz7";
		this.assistant = (await this.openai.asistente({ id: this.assistantId}))?.data;


		/*if (!this.assistantId ) {
			this.assistantId = await this.getAssistants()[0];
		}

		console.log("OpenAIAssistantManager", this.assistantId)
		if (!this.assistantId) {
			throw Error("Se necesita al menos un asistente en Platform OpenAI Assistant")
		}*/


	}


	async getAssistants(asId?: string, nameFilter?: string): Promise<Assistant[]> {

		try {
			console.log("OpenAIAssistantManager. Get list of assistans", this.assistantId)
			const response = await this.openai.list(asId);
			console.log("getAssistant", response)
			if (response.ok) {

				const as: Assistant| Assistant[] = response.data.assistants;
				if (Array.isArray(as) && nameFilter) {
					this.assistant = as
						.find(assistant => assistant.name.includes(nameFilter))[0];
				} else {
					if (Array.isArray(as) && as.length > 0) {
						this.assistant = as[0];
					} else {
						this.assistant = as as Assistant;
					}
				}
				this.assistantId = this.assistant.id;
			}

		} catch (error) {
			console.error(`Error retrieving assistants: ${error.message}`);
			return [];
		}
	}


	// Función para obtener las tools actuales del asistente
	private async getExistingTools(): Promise<FunctionTool[]> {
		try {
			return this.assistant?.tools.filter(f => f.type == "function").map(f => f as FunctionTool);

		  } catch (error) {
			throw new Error(`Error retrieving existing tools: ${error.message}`);
		  }
	}

	// Función para agregar tools nuevas
	private async addTools(newTools: FunctionDefinition[]): Promise<void> {
		try {
			// Llamar a la API de OpenAI para agregar las herramientas
			const response = await this.openai.update(
				this.assistantId,
				{
					tools: newTools.map(n => { return { type: "function", function: n } })
				});

			if (response.ok) {
				console.log('Tools added successfully.');
				this.assistant = (await this.openai.list(this.assistantId))?.data ;
			} else {
				console.error(`Failed to add tools: ${response.data}`);
			}
		} catch (error) {
			console.error(`Error adding tools: ${error.message}`);
		}
	}

	// Función para comprobar si las tools ya existen y, si no, agregarlas
	public async ensureToolsExist(requiredTools: FunctionDefinition[]): Promise<void> {
		try {
			const existingTools = await this.getExistingTools();

			// Filtra las tools que no están ya registradas
			const toolsToAdd = requiredTools.filter(tool =>
				!existingTools.some(existingTool => existingTool.function.name === tool.name)
			);

			if (toolsToAdd.length > 0) {
				console.log(`Adding ${toolsToAdd.length} tools...`);
				await this.addTools(toolsToAdd);
			} else {
				console.log('All tools already exist.');
			}
		} catch (error) {
			console.error(`Error ensuring tools exist: ${error.message}`);
		}
	}
  // Ejemplo de uso de la clase
	async setupAssistant() {
		console.log("Ensuring")

		// Asegura que las tools estén configuradas en el asistente
		await this.ensureToolsExist(functionDefinitions);
	}

	async requestSample() {
		const r = await this.runQuery({
			juego: null,
			bot_instrucciones: '',
			instrucciones: '',
			contexto: '',
			assistant_id: "",
			solicitud: "Usando las 'Functions' que tienes definidas, genera una lista de los ficheros contenidos en el directorio: '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/alephscript'. Activa el modo json en la respuesta."
		})

		if (r?.ok) {
			if (r.requires_action) {
				console.log("Rsults action 1", r.data.type);
				console.log("Rsults action 2", r.data.submit_tool_outputs);
				console.log("Rsults action 2", r.data.submit_tool_outputs.tool_calls);

				const calls = r.data.submit_tool_outputs.tool_calls;
				if ( calls && Array.isArray(calls)) {
					calls.forEach(s => {
						console.log("Doing the call", s)
					})
				}
			} else {
				console.log("Rsults runQuery", r);
			}
		} else {
			console.log("Error runquery", r);
		}
	}

	async runQuery(param: QueryParamsJuego) {

		/*console.log(agentMessage('OAIManager',
			"Carga de datos EXPANDIDA que se envían:[>", ""), );
				console.log(param)
			// ZONA DE LOGS
		console.log(agentMessage('OAIManager', "<]", ""));*/

		let mensaje: any;
		let texto: any;
		let value: any;
		let m: any;

		try {

			param.assistant_id = param.assistant_id || this.assistantId /* || this.ide.assistant.id*/;
			if (!param.assistant_id) {
				console.log(this.assistantId, this.assistant.name, 'OAIManager')
				return
			}
			param.bot_info = this.assistant.name.replace("Asist.", "")
			/* console.log(agentMessage('OAIManager',
				`runQuery: Mensaje ${ param.solicitud?.substring(0, 15) + "..." }`)); */
			console.log(agentMessage("APP_PROGRESS_4",
				":>" + param.assistant_id + ":>" + this.assistant.name + ":>" + param.bot_info + ":>" + 'OAIManager'))

			const res = await this.openai.crearHilo(param);

			if (res.ok) {
				console.log(res.data)
				const data = res.data.data.map(m => m.content.map(mm => JSON.stringify(mm)));

				const mensajes: any[] = data[0];
				if (mensajes.length < 1) {
					console.log(agentMessage('OAIManager', "No hay mesajes", ""));

				} else {
					mensaje = JSON.parse(mensajes[mensajes.length - 1])
					texto = mensaje?.text
					value = texto?.value

					value = value.replace("```json", "").replace("```", "")
					m = JSON.parse(value)

					console.log(agentMessage('OAIManager',
						"El hilo tiene mensajes: " + mensajes.length +
						". Respuesta [>", ""), );

						// ZONA DE LOGS

					console.log(agentMessage('OAIManager', "<]", ""));

					console.log(agentMessage("APP_PROGRESS_5", mensajes[mensajes.length - 1]))

				}

				return res;
			} else {
				console.log(agentMessage('OAIManager', res.data));
				console.log(res)
				return null
			}
		} catch(ex) {

			console.log(ex.message)

		}
	}

}