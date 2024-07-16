import { Assistant } from "openai/resources/beta/assistants/assistants";
import { Observable, Subject } from "rxjs";
import { agentMessage } from "../../../../../../agentMessage";
import { AS_IDE_i18 } from "../../../../../../aplicaciones/ide/aleph-script-idle-i18";
import { RTCache } from "../../../../../../engine/kernel/rt-cache";
import { IDiccionarioI18 } from "../../../../../../genesis-block";
import { Trainer_clave, ASOracleAs } from "../../../../../conexionista/modelos-lenguaje/oai/Trainer_key";
import { AsistenteApi } from "../../../../../conexionista/modelos-lenguaje/oai/asisstant";
import { IFase } from "../../../../../sbc/implementaciones/common-kads/common-kads";

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

export class AlephIDE implements AlephScriptIDE {

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

		this.actionServerS = new Subject<IFase>();
		this.actionServer = this.actionServerS.asObservable();

        this.cache.recuperar();

	}

    async inicializar() {

        const as = this.cache.leerLista(Trainer_clave);
        console.log(">>>>", as)
        if (as.length > 0) {
            console.log(agentMessage(this.nombre, "Autómata listo." /* + new AsistenteApi().imprimir(as) */));
        } else {
            const s = new AsistenteApi();
            const r = await s.list([]);
            if (r.ok) {
                this.cache.guardar(Trainer_clave, r.data);
                this.cache.persistir();
            } else {
                console.log(agentMessage(this.nombre, `Error al recuperar lista de asistentes ${r.data}`));
            }
        }

		this.assistant = as.find(a => a.id === ASOracleAs.id);
		console.log(agentMessage(this.assistant.name, this.assistant.name ? "¡Listo!" :  "Error al inicializar IDE!"));

    }

	motor() {

		console.log(agentMessage(this.assistant.name, "¡Listo para recibir peticiones de ayuda!"));
		this.actionServer.subscribe(async f => {

			console.log(agentMessage(this.nombre, `${this.i18.IDE.ASISTENTE.CK.SOLICITUD}: ${f.fase}`))

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


