import { Assistant } from 'openai/resources/beta/assistants';
import { agentMessage } from '../../../agentMessage';
import { RTCache } from "../../../engine/kernel/rt-cache";
import { AsistenteApi } from '../../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant';
import { IDE_clave, Trainer_clave } from "../../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { EstadoT } from "../../../paradigmas/situada/estado";
import { IDEModelo } from "./ide-modelo";
import { AlephScriptIDEImpl } from './semilla/AlephScriptIDEv1';
import { IDEEstados } from './situada/IDEEstados';

export class IDEEstado<IDEEstados> extends EstadoT<IDEEstados> {

	nombre = "IDEEstado"
	estado: any = IDEEstados.PARADA;

	modelo: IDEModelo;

	ide: AlephScriptIDEImpl;
	assistanceId: string = "";
	assistanceName: string = "";

	private estadoA: any;

	async transicion(): Promise<void> {

		switch(this.estado) {

			case IDEEstados.PARADA:

				this.log()

				await this.inicializarCache()

				this.estado = IDEEstados.ARRANCAR;

				this.log(this.estado)
				break;

			case IDEEstados.ARRANCAR:

				this.log()

				console.log("=======================================")
				this.ide = new AlephScriptIDEImpl();
				this.modelo.dominio.base[IDE_clave] = this.ide;

				this.estado = IDEEstados.AVANZAR;

				this.log(this.estado, ":> Guardar en la clave IDE el ide: " + IDE_clave,
					this.ide.imprimir())
				break;

			case IDEEstados.AVANZAR:

				this.log()
				this.log(this.estado)

				break;
			case IDEEstados.PARAR:

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