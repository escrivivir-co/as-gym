import { agentMessage } from "../../agentMessage";
import { App } from "../../engine/apps/app";
import { Bloque } from "./semilla/chain";
import { IDEModelo } from "./ide-modelo";
import { IDEEstados } from './situada/IDEEstados';
import { IDEFIASituada } from "./situada/ide-fia-situada";
import { IDEMundo } from "./ide-mundo";

export class IdeAppV1 extends App {

    i18 = this.i18.IDEv1;

    runAsync: true;

    constructor() {
        super();
        this.nombre = "MyTestApp";
		this.mundo = new IDEMundo();
		this.mundo.nombre = this.i18.MUNDO.NOMBRE;
    }

    async instanciarD(
		onReady: () => void
	): Promise<string> {

		console.log(agentMessage(this.nombre, "OnIniting..."))
		this.inicializar();

		console.log(agentMessage(this.nombre, "onReady"))
		onReady();

		console.log(agentMessage(this.nombre, "OnLaunching"), this.alphaBot.automata.estado.nombre)
        const salidas = await Promise.allSettled(
            [
                this.mundo.ciclo(),						// MAIN APP PULSE
                this.alphaBot.instanciarV(),				// IDEFIA Situada, hemisferio derecho
				this.omegaBot.instanciarV(),				// IDEFIA Situada, hemisferio izquierdo
				this.templeBot.instanciarV(),				// IDEFIA Situada,  moderado
            ]
        );

		return salidas.map((f): string => {
            if (typeof f == 'object') {
                return `\t - ${(f as any).value.nombre} ${this.i18.SIMULATION_END} \n`;
            } else {
            }
        }).join("")
    }

	inicializar() {

		Bloque.estado = {};
		Bloque.id = this.nombre;

        console.log(agentMessage(this.nombre, this.i18.SIMULATION_START));

        /**
         * CREACIÓN DEL MUNDO RAÍZ
         */
        this.mundo.modelo = new IDEModelo();
        this.mundo.modelo.pulso = 1000;
        this.mundo.modelo.muerte = 25;
        this.mundo.modelo.estado = IDEEstados.PARADA;

        this.mundo.nombre = this.i18.MUNDO.NOMBRE;

		this.mundo.runStateEvent = this.runStateEvent.asObservable();

        this.alphaBot = new IDEFIASituada();
		this.alphaBot.runStateEvent = this.runStateEvent;
        this.alphaBot.mundo = this.mundo;
		this.alphaBot.nombre = "AlphaBot"

		this.omegaBot = new IDEFIASituada();
		this.omegaBot.runStateEvent = this.runStateEvent;
        this.omegaBot.mundo = this.mundo;
		this.omegaBot.nombre = "OmegaBot"
	}

	async instanciar(): Promise<string> {

		this.inicializar();

        const salidas = await Promise.allSettled(
            [
                this.mundo.ciclo(),						// MAIN APP PULSE
                this.alphaBot.instanciarV(),				// IDEFIA Situada, attaches a dummy automata
				this.omegaBot.instanciarV(),				// IDEFIA Situada, attaches a dummy automata
            ]
        );

		return salidas.map((f): string => {
            if (typeof f == 'object') {
                return `\t - ${(f as any).value.nombre} ${this.i18.SIMULATION_END} \n`;
            } else {
            }
        }).join("")
    }
}