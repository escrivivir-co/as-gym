import { Intencion, Aferencia, Eferencia } from "./Intencion";
import { RTCache } from "./engine/kernel/rt-cache";
import { i18 } from "./i18/aleph-script-i18";
import { RunStateEnum, IMundo, Mundo } from './mundos/mundo';
import { Subject } from "rxjs";

export type Objetivo = Intencion;

export interface IAprendize {}

export interface IPercepto {}

export interface IAccion {}

export interface IDiccionarioI18 {}

export interface iFIA {

    i18: IDiccionarioI18;

    nombre: string;

    runAsync: boolean;

    objetivos: Aferencia[];

    mundo: IMundo;

    imprimir: () => string;

	configurar?: () => void;

    instanciar(): Promise<string>;

    razona: (mundo: IMundo, i: Aferencia) => Eferencia;

    abstrae: (p: IPercepto) => IAprendize;

    cache: RTCache;

	runState: RunStateEnum;
	runStateEvent: Subject<RunStateEnum>;

	assistantId?: string;

}

export class FIA implements iFIA {

    cache: RTCache = new RTCache();

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
