import { agentMessage } from "../../../../agentMessage";
import { RTCache } from "../../../../engine/kernel/rt-cache";
import { AsistenteApi } from '../../../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant';
import { IDE_clave, Trainer_clave } from "../../../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { EstadoT } from "../../../../paradigmas/situada/estado";
import { AlephScriptIDEImpl } from "../../aleph-script-idle";
import { IDEModelo } from "../modelo/ide-modelo";

export enum IDEEstados {
	PARADA = "PARADA",
	ARRANCAR = "ARRANCAR",
	AVANZAR = "AVANZAR",
	PARAR = "PARAR",
	FUERA_SERVICIO = "FUERA_SERVICIO"
}

export class IDEEstado<IDEEstados> extends EstadoT<IDEEstados> {

	tag = "esetadoid"

	modelo: IDEModelo;

	async transicion(): Promise<void> {

		switch(this.modelo.estado) {

			case IDEEstados.PARADA:

				const c = new RTCache();
				c.recuperar();

				const as = c.leerLista(Trainer_clave);

				if (as.length > 0) {
					console.log(agentMessage(this.modelo.nombre, "Autómata listo ide-estado transicion." /*+ new AsistenteApi().imprimir(as)*/));
				} else {
					const s = new AsistenteApi();
					const r = await s.list([]);
					if (r.ok) {
						c.guardar(Trainer_clave, r.data);
						c.persistir();
					}
				}
				this.modelo.estado = IDEEstados.ARRANCAR;
				break;
			case IDEEstados.ARRANCAR:

				const ide = new AlephScriptIDEImpl();

				console.log("Guardar en la clave IDE el ide", IDE_clave, ide.imprimir())
				this.modelo.dominio.base[IDE_clave] = ide;

				this.modelo.estado = IDEEstados.AVANZAR;
				break;

			case IDEEstados.AVANZAR:
				break;
			default:
				console.log(agentMessage(this.modelo.nombre, "Paso 0: " + this.modelo.estado));
				this.modelo.estado = IDEEstados.FUERA_SERVICIO;
		}
	}
}