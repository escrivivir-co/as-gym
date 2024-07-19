import { Intencion, Aferencia, Eferencia } from "./Intencion";
import { Bloque } from "./engine/kernel/cadena-bloques";
import { RTCache } from "./engine/kernel/rt-cache";
import { i18 } from "./i18/aleph-script-i18";
import { iFIA } from "./iFIA";
import { Mundo } from './mundos/mundo';
import { RunStateEnum } from "./mundos/RunStateEnum";
import { IMundo } from "./mundos/IMundo";
import { Subject } from "rxjs";
import { IDiccionarioI18 } from "./IDiccionarioI18";
import { IPercepto } from "./IPercepto";
import { IAprendize } from "./IAprendize";
import { IRTCache } from "./engine/kernel/IRTCache";

export type Objetivo = Intencion;

export class FIA implements iFIA {

    cache: IRTCache = new RTCache();

	runStateEvent = new Subject<RunStateEnum>();
	runState: RunStateEnum = RunStateEnum.STOP;

    nombre = "FIA";
    i18: IDiccionarioI18;

    runAsync = false;

    objetivos: Objetivo[];

    mundo: IMundo = new Mundo();

    imprimir(): string {
        return `${i18.LOOP.NOT_INIT_LABEL}`;
    }

	constructor() {

		// Bloque.estado = {};
		Bloque.id = this.nombre;

		this.runStateEvent.asObservable().subscribe(
			(event) => {
				this.runState = event
				this.mundo.runState = event
			}
		);
	}

    async instanciar(): Promise<string> {
        return await new Promise((resolve, reject) => {

           try {

                resolve(`${i18.LOOP.NOT_INIT_LABEL}`);

            } catch(ex) {

                return reject(ex.message);

            }
        });
    }

    razona(mundo: IMundo, i: Aferencia): Eferencia {

        const eferenciaVacia  = "";

        return eferenciaVacia;

    }

    abstrae: (p: IPercepto) => IAprendize;
}

export class GenesisBlock extends FIA {

    objetivos = [];

    abstrae: (p: IPercepto) => IAprendize;

    nombre = "FIA_Genesis";


}
