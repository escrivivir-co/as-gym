import { agentMessage } from '../../../agentMessage';
import { RTCache } from "../../../engine/kernel/rt-cache";
import { AsistenteApi } from '../../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant';
import { Trainer_clave } from "../../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { Control } from '../../../paradigmas/sistemas/busquedas/control';
import { WebScraper } from '../../../paradigmas/sistemas/scraper/webscraper';
import { EstadoT } from "../../../paradigmas/situada/estado";
import { AN_SINDIC_YV_mundo, SimuladorDAO } from '../base_conocimiento/dao';
import { IDEModelo } from "./ide-modelo";
import { AlephScriptIDEImpl } from './semilla/AlephScriptIDEv1';
import { IDEEstados } from './situada/IDEEstados';

const AN_SINDIC_MODDEL_VF = "AN_SINDIC_MODDEL_VF";

export class IDEEstado<IDEEstados> extends EstadoT<IDEEstados> {

	nombre = "IDEEstado"
	estado: any = IDEEstados.PARADA;

	modelo: IDEModelo;

	ide: AlephScriptIDEImpl;
	assistanceId: string = "";
	assistanceName: string = "";

	private estadoA: any;
	al: Control;
	scrapper: WebScraper;
	engine: SimuladorDAO;

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

				// console.log("=======================================")
				this.modelo.dominio.base[AN_SINDIC_MODDEL_VF] = AN_SINDIC_YV_mundo;
				this.estado = IDEEstados.AVANZAR;

				break;

			case IDEEstados.AVANZAR:

				this.engine.simularDia();

				this.modelo.dominio.base["AN_SINDIC_MODDEL_VF"] = AN_SINDIC_YV_mundo;

				this.engine.avanzarDia();

				this.log()
				this.log(this.estado)

				break;
			case IDEEstados.PARAR:
				this.modelo.dominio.base[AN_SINDIC_MODDEL_VF] = "AVANZARPARAR";
				this.log()
				this.estado = IDEEstados.PARADA
				this.log(this.estado)

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
			const r = await s.list([]);
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