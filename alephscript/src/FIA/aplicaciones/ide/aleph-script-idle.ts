import { Assistant } from "openai/resources/beta/assistants";
import { ASOracleAs, Trainer_clave } from "../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { RTCache } from "../../engine/kernel/rt-cache";
import { agentMessage } from "../../agentMessage";
import { Observable, Subject } from "rxjs";
import { CKCACHE_Clave, EXTERNAL_CACHE } from "../../paradigmas/sbc/implementaciones/common-kads/common-kads";
import { IFase } from "../../paradigmas/sbc/implementaciones/common-kads/IFase";
import { CKFases } from "../../paradigmas/sbc/implementaciones/common-kads/CKFases";
import { IDiccionarioI18 } from "../../IDiccionarioI18";
import { AS_IDE_i18 } from "./aleph-script-idle-i18";
import { AsistenteApi } from '../../paradigmas/conexionista/modelos-lenguaje/oai/asisstant';

export const CONST_CORPUS_PATH = '/Users/morente/Desktop/THEIA_PATH/taller_tc/JE20/je20/fia/src/as-seed/guest/';

export interface AlephScriptIDE {

	i18: IDiccionarioI18;

	actionServer: Observable<IFase>;
	actionServerS: Subject<IFase>;

	nombre: string;

	arrancado: boolean;
	assistant: Assistant;
	projectName: string;

	motor: () => void;
	imprimir: () => void;
}

export class AlephScriptIDEImpl implements AlephScriptIDE {

	i18 = AS_IDE_i18;
	nombre = this.i18.IDE.NOMBRE;

	actionServer: Observable<IFase>;
	actionServerS: Subject<IFase>;

	projectName = "AlephScriptIDE_Proyecto_1";
	assistant: Assistant;
	trainer: AsistenteApi = new AsistenteApi();

	cache = new RTCache();

	arrancado: boolean;

	constructor() {

		const c = new RTCache();
		this.assistant = (c.leer(Trainer_clave) as Assistant[])
			.find(a => a.id === ASOracleAs.id);

		console.log(agentMessage(this.assistant.name, this.assistant.name ? "¡Listo!" :  "Error al inicializar IDE!"));
		this.actionServerS = new Subject<IFase>();
		this.actionServer = this.actionServerS.asObservable();

	}

	motor() {

		console.log(agentMessage(this.assistant.name, "¡Listo para recibir peticiones de ayuda!"));
		this.actionServer.subscribe(async f => {

			/**
			 * MAIN OPEN API CHANNEL DISABLE WHEN NOT INET AVAILABLE
			 */
			/* console.log(agentMessage(this.nombre, `${this.i18.IDE.ASISTENTE.CK.SOLICITUD}: ${f.fase}`))

			const mensaje = f.imprimir();

			if (!mensaje) {
				return
			}

			console.log(agentMessage(this.nombre, `${this.i18.IDE.ASISTENTE.CK.SOLICITUD}: Mensaje ${mensaje}`));
			const res = await this.trainer.crearHilo({ assistant_id: this.assistant.id, solicitud: mensaje });

			if (res.ok) {
				const data = res.data.data.map(m => m.content.map(mm => JSON.stringify(mm)));
				console.log(agentMessage(this.nombre, res.data));
				console.log(agentMessage(this.nombre, data));
				console.log(data)
			} else {
				console.log(agentMessage(this.nombre, res.data));
				console.log(res)
			}
			*/
		});

		this.actionServer.subscribe(async f => {

			if (!f.esperando) return;

			this.nombre = "MyServer"

			console.log(agentMessage(this.nombre, `${this.i18.IDE.ASISTENTE.DATA.SOLICITUD}: ${f.fase || ' -- '} `))

			if (!f.fase) {

				const rt = new RTCache();

				console.log(agentMessage(this.nombre, "Carga el dominio de la semilla"))

				const domain = rt.recuperRuta(CONST_CORPUS_PATH + 'corpus/domain.data.schema.json');
				const domainAuth = rt.recuperRuta(CONST_CORPUS_PATH + 'corpus/domain.data.schema.auth.json');

				const myDomain = {
					domain,
					domainAuth,
				}
				f.estado.modelo.dominio.base[EXTERNAL_CACHE] = myDomain;

			} else {

				// console.log(agentMessage(this.nombre, "Ejecutando TRANSICIÓN  de estado en el IDE", f.fase.toString() + "/" + f.bookmark?.toString() ))

				switch(f.fase) {
					case CKFases.NivelContextual: {

						console.log("NivelContextual--------------------------->>>>", f.fase, f.bookmark)
						// const domain = f.estado.modelo.dominio.base[EXTERNAL_CACHE].domain;
						// const domainAuth = f.estado.modelo.dominio.base[EXTERNAL_CACHE].domainAuth;

						break;
					}
					case CKFases.NivelConceptual: {

						console.log("NivelConceptual---------------------------")
						break;
					}
					case CKFases.NivelArtefactual: {

						console.log("NivelArtefactual---------------------------")
						break;
					}
					case CKFases.Monitorizacion: {

						console.log("Monitorizacion---------------------------")
						break;
					}
				}
			}

			f.esperando = false;

			console.log("Next al CycloFase", f.fase, f.bookmark)
			f.solicitar.next(f);
			return;

			const mensaje = f.imprimir();

			if (!mensaje) {
				return
			}

			console.log(agentMessage(this.nombre, `${this.i18.IDE.ASISTENTE.CK.SOLICITUD}: Mensaje ${mensaje}`));
			const res = await this.trainer.crearHilo({ assistant_id: this.assistant.id, solicitud: mensaje });

			if (res.ok) {
				const data = res.data.data.map(m => m.content.map(mm => JSON.stringify(mm)));
				console.log(agentMessage(this.nombre, res.data));
				console.log(agentMessage(this.nombre, data));
				console.log(data)
			} else {
				console.log(agentMessage(this.nombre, res.data));
				console.log(res)
			}
		});

	}

	imprimir() {

		return this.projectName;
	}
}


