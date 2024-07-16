import { agentMessage } from "../agentMessage";
import { i18 } from "../i18/aleph-script-i18"
import { Observable, Subject, Subscription } from "rxjs"
import { IModelo, Modelo } from "./modelo";
import { AS_MUNDO_i18 } from "./mundos-i18";
import { IDiccionarioI18 } from "../genesis-block";

export enum RunStateEnum {
	PLAY = "PLAY",
	PLAY_STEP = "PLAY_STEP",
	PAUSE = "PAUSE",
	STOP = "STOP"
}

export interface IMundo {

    i18: IDiccionarioI18;

    nombre: string;
    modelo: IModelo;

    pulsoVital: NodeJS.Timeout;

    instanciar(): Promise<IModelo>;

    vivo(): boolean;

    pulso: () => void;

    ciclo: () => Promise<IModelo>;

    jornada(vivir: Function, morir: Function): void;

    eferencia: Subject<IMundo>;

    aferencias: Subscription[];

    agregarAferencia(o: Observable<IMundo>): void;

    alAcabar(nombre: string): Promise<IModelo>;

    destructor(): void;

    elMundoAcabara: Observable<IMundo>;

	runState: RunStateEnum;
	runStateEvent: Observable<RunStateEnum>;
}

export interface AlAcabarCallbackDatos {
    nombre: string;
    callback: ((value: IModelo | PromiseLike<IModelo>) => void)
}

export class Mundo implements IMundo {

    i18 = AS_MUNDO_i18;

    nombre = "mundo-1";

    modelo = new Modelo();

    pulsoVital: NodeJS.Timeout;

    eferencia: Subject<IMundo> = new Subject();
    aferencias: Subscription[] = [];

    alAcabarCallbacks: AlAcabarCallbackDatos[] = [];

    elMundoAcabaraS: Subject<IMundo> = new Subject();
    elMundoAcabara: Observable<IMundo> = this.elMundoAcabaraS.asObservable();
    callbacks: ((m: IMundo) => void)[] = [];

	runStateEvent: Observable<RunStateEnum>;
	runState: RunStateEnum;

    constructor() {}

    agregarAferencia(o: Observable<IMundo>) {

       const s = o.subscribe(m => {

            /* this.modelo = m.modelo;
                console.log(agentMessage(this.nombre,
                    i18.MUNDO.AFERENCIA.RECEPCION_LABEL), this.modelo.imprimir()); */

        });

        this.aferencias.push(s);

    }

    agregarCallback(f: (m: IMundo) => void) {

        this.callbacks.push(f);
    }

    async instanciar(): Promise<IModelo> {

        return await new Promise(async (resolve, reject) => {

            // Iniciar el contador de programa
            const modelo = await this.ciclo();

            resolve(modelo);

        })

    }

    async alAcabar(nombre: string = "unknown"): Promise<IModelo> {

        return await new Promise((resolve, reject) => {

            this.alAcabarCallbacks.push({
                nombre, callback: resolve
            });
            console.log(
                agentMessage(this.nombre, `${i18.MUNDO.NUEVO_SUSCRIPTOR_LABEL}, ${nombre}, suscriptores: ${this.alAcabarCallbacks.map(c => c.nombre).length}`));

        });
    }

    async ciclo(): Promise<IModelo> {

		console.log("MUNDO CLICLO")
		this.runStateEvent.subscribe((event) => this.runState = event);

        return await new Promise((resolve, reject) => {

            console.log(agentMessage(this.nombre, `${i18.MUNDO.INICIO_LABEL} Pulso: ${this.modelo.pulso}`));
            this.pulsoVital = setInterval(() => this.jornada(resolve, reject), this.modelo.pulso);

        });
    }

    jornada(vivir: Function, morir: Function) {

        if (this.vivo()) {

            try {

				if (this.runState == RunStateEnum.STOP) throw new Error("Abort");

				if (this.runState == RunStateEnum.PAUSE) return;

                this.pulso();

				if (this.runState == RunStateEnum.PLAY_STEP) {
					this.runState = RunStateEnum.PAUSE;
					this.eferencia.next(this)
				}

            } catch(ex) {

                console.log("Error en mundo", this.nombre, ex.message);

                this.deponer(this.pulsoVital);

                return morir({
                    estado: ex.message,
                    modelo: this.modelo
                });

            }

        } else {

            this.deponer(this.pulsoVital);
            vivir(this.modelo);

        }
    }

    deponer(intervalo: any) {

        this.elMundoAcabaraS.next(this);

        console.log(agentMessage(this.nombre, `${i18.MUNDO.FIN_LABEL}, deponer ${this.alAcabarCallbacks.map(c => c.nombre)}`));

        clearInterval(intervalo);

        this.alAcabarCallbacks.forEach(c => c.callback(this.modelo));

        this.destructor();

    }

    destructor() {

        this.aferencias.forEach(s => s.unsubscribe());
        console.log(agentMessage(this.nombre, `${i18.MUNDO.FIN_LABEL}, destruir `));
    }

    pulso(): void {

        this.modelo.dia++;
        console.log(agentMessage(this.nombre, `${i18.MUNDO.DIA_LABEL} ${this.modelo.dia}`));

		console.log(this.nombre, "AHORA------------------------------", this.runState)
        this.eferencia.next(this);
        this.callbacks.forEach(f => f(this));

    }

    vivo(): boolean {
        return this.modelo.dia < this.modelo.muerte;
    }

}