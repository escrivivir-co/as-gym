import { agentMessage } from "../../../agentMessage";
import { RTCache } from "../../../engine/kernel/rt-cache";
import { AsistenteApi } from "../../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant";
import { Trainer_clave } from "../../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { q } from "../lore";
import { EstadoT } from "../../../paradigmas/situada/estado";
import { SimuladorDAO, IOT_LOGIC_ENGINE_mundo } from "../base_conocimiento/dao";
import { ChatHelper } from "./conexionista/chat";
import { IDEModelo } from "./ide-modelo";
import { AlephScriptIDEImpl } from "./semilla/AlephScriptIDEv1";
import { IDEEstados } from "./situada/IDEEstados";
import { QueryParamsJuego } from "../appv1-estado";

const IOT_LOGIC_ENGINE = "IOT_LOGIC_ENGINE";

export const KEY = "APP1_ESTADO";

export class IDEEstado<IDEEstados> extends EstadoT<IDEEstados> {

	nombre = "IDEEstado"
	estado: any = IDEEstados.PARADA;

	modelo: IDEModelo;

	ide: AlephScriptIDEImpl;
	assistanceId: string = "";
	assistanceName: string = "";

	emitResponse: (data: any) => void = () => { return };

	private estadoA: any;

	engine: SimuladorDAO;
	interval: NodeJS.Timeout;
	chat: ChatHelper;

	async transicion(): Promise<void> {

		console.log(agentMessage("ESTADO DE NIVEL INFERIOR" + ": " + this.nombre,
			JSON.stringify(this.modelo.dominio.base["RPC"]?.al)))

		const rpcData = this.modelo.dominio.base["RPC"];
		this.modelo.dominio.base["RPC"] = this.modelo.dominio.base["RPC"] || {};

		switch(this.estado) {

			case IDEEstados.PARADA:

				this.log()

				await this.inicializarCache()
				this.engine = new SimuladorDAO();
				this.estado = IDEEstados.ARRANCAR;

				this.log(this.estado)
				break;

			case IDEEstados.ARRANCAR:

				this.log()
				this.ide = new AlephScriptIDEImpl();

				// console.log("=======================================")
				this.modelo.dominio.base[IOT_LOGIC_ENGINE] = IOT_LOGIC_ENGINE_mundo;
				this.estado = IDEEstados.AVANZAR;

				if (this.onAssistantsReady) {
					this.onAssistantsReady(this.ide.listaAsistentes(), this.assistanceName);
				}

				this.chat = new ChatHelper(this.ide);
				this.chat.modelo = this.modelo;
				this.chat.assistanceId = this.assistanceId;
				this.chat.assistanceName = this.assistanceName;
				this.chat.emitResponse = ( res ) =>	 { console.log("yes", res); this.emitResponse(res) };

				console.log(agentMessage("ASSISTANT_IA_API", "onReady-Set"))

				/*
				q.bot_info = this.nombre
				q.contexto = q.instrucciones
				q.assistant_id = this.assistanceId
				ChatHelper.addQuery(this.modelo, q);
				*/

				clearInterval(this.interval);
				this.interval = setInterval(async () => {

					if (this.chat.ocupada) {
						// console.log(agentMessage("ASSISTANT_IA_API", "Status:> Buscando..."))
					} else {
						await this.chat.trigger();
					}

				}, 500)

				break;

			case IDEEstados.AVANZAR:

				this.engine.simularDia();

				const timeline = [...this.engine.log]
				this.engine.getDAOsLogs().forEach(d => timeline.push(d));
				this.modelo.dominio.base["IOT_LOGIC_ENGINE"] = {
					...IOT_LOGIC_ENGINE_mundo,
					timeline
				};
				// console.log("Update step",  timeline)

				this.engine.avanzarDia();

				this.log()
				this.log(this.estado)

				break;
			case IDEEstados.PARAR:
				this.modelo.dominio.base[IOT_LOGIC_ENGINE] = "AVANZARPARAR";
				this.log()
				this.estado = IDEEstados.PARADA
				this.log(this.estado)
				clearInterval(this.interval);

				break;
			default:

				this.log()
				this.estado = IDEEstados.FUERA_SERVICIO;
				this.log(this.estado)
		}
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

	log(estado?: any, mensaje?: string, data?: any) {

		if (!estado) {
			this.estadoA = this.estado;
		} else {
			console.log(agentMessage("APP_PROGRESS_2", this.nombre + ":>" +
				this.estadoA + ":>" + estado
			), )
		}

	}

}