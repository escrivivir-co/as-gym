import { agentMessage } from "../../../agentMessage";
import { App } from "../../../engine/apps/app";
import { q } from "../lore";
import { IDEModelo } from "./ide-modelo";
import { IDEEstados } from './situada/IDEEstados';
import { IDEFIASituada } from "./situada/ide-fia-situada";
import { IDEMundo } from "./ide-mundo";
import { Bloque } from "../../../engine/kernel/cadena-bloques";
import { IFIASituada } from "../../../paradigmas/situada/fia-situada";
import { Assistant } from "openai/resources/beta/assistants";
import { AlphaBot } from "../alpha-bot";
import { IDEEstadoAppV1, QueryParamsJuego } from "../appv1-estado";
import { AlephScriptIDEImpl } from "./semilla/AlephScriptIDEv1";
import { systemMessage } from "../../../systemMessage";
import { SocketAdapter } from "../../../engine/kernel/adapter";
import { ChatHelper } from "./conexionista/chat";

export class LogicIdeApp extends App {

    i18 = this.i18.IDEv1;

    runAsync: true;
	ide: AlephScriptIDEImpl;
	alphaEstado: IDEEstadoAppV1<IDEEstados>;

	receivedBots: number;
	expectedBots: number;
	bots = [];
	omegaEstado: IDEEstadoAppV1<IDEEstados>;

    constructor() {
        super();
        this.nombre = "MyTestApp";
		this.mundo = new IDEMundo();
		this.mundo.renderer = "iot-logic-engine";
		this.mundo.nombre = this.i18.MUNDO.NOMBRE;
    }

	inicializar() {

		// Bloque.estado = {};
		Bloque.id = this.nombre;

        console.log(agentMessage(this.nombre, this.i18.SIMULATION_START));

        /**
         * CREACIÓN DEL MUNDO RAÍZ
         */
        this.mundo.modelo = new IDEModelo();
        this.mundo.modelo.pulso = 1000;
        this.mundo.modelo.muerte = 365;

        this.mundo.modelo.estado = IDEEstados.PARADA;

        // this.mundo.nombre = this.i18.MUNDO.NOMBRE;
		this.mundo.nombre = this.getRoomName();

		this.mundo.runStateEvent = this.runStateEvent.asObservable();

        this.alphaBot = new IDEFIASituada();
		this.alphaBot.runStateEvent = this.runStateEvent;
        this.alphaBot.mundo = this.mundo;
		this.alphaBot.nombre = "AlphaBot";
		console.log("Set Alphabot ------------------------------------", this.onAssistantsReady, this.alphaBot.automata.estado.nombre)
		this.alphaBot.automata.onAssistantsReady = (a, b) => this.onAssistantsReady(a, b)

		this.bots = [
			{ nombre: this.alphaBot.nombre },
		]

		this.conectarEntorno();
	}

	async instanciar(): Promise<string> {

		this.inicializar();

		this.onReady();

        const salidas = await Promise.allSettled(
            [
                this.mundo.ciclo(),						// MAIN APP PULSE
                this.alphaBot.instanciarV(),				// IDEFIA Situada, attaches a dummy automata
            ]
        );

		return salidas.map((f): string => {
            if (typeof f == 'object') {
                return `\t - ${(f as any)?.value?.nombre} ${this.i18.SIMULATION_END} \n`;
            } else {
            }
        }).join("")
    }

	inited = false;
	onAssistantsReady(as: Assistant[], caller?: string) {

		this.receivedBots++;

		if (this.receivedBots < this.expectedBots) {
			// console.log(agentMessage(this.nombre, "onAssistantsReady, quit!")/*, as*/, this.receivedBots, 
			// this.expectedBots, caller)
			return
		}

		if (this.inited) return
		this.inited = true;

		this.omegaBot.assistantId = as.find(a => a.name == this.omegaBot.nombre)?.id;

		(this.omegaBot.automata.estado as IDEEstadoAppV1<IDEEstados>).assistanceId = this.omegaBot.assistantId;

		console.log(agentMessage(this.nombre, "onAssistantsReady")/*, as*/, this.receivedBots, this.expectedBots,
		"=================ooooooooooooooooooooooooO=======================")
		this.spider.io.on("SET_DOMAIN_LOGIC_DATA", (...args) => {

			const rData = args[0];
			console.log(systemMessage(this.nombre+ ">> SET_DOMAIN_LOGIC_DATA ENGINE... to: "), rData)
			const action = rData?.action;

			const engine = rData.engine;
			const fia = SocketAdapter.threads[engine];

			switch(action) {
				case "SET_DATA": {
					console.log(systemMessage(this.nombre+ ">> SET_DOMAIN_LOGIC_DATA ENGINE... to: default"), action)
					const aiMessage = rData.blob;

				if (aiMessage) {
					const qr: QueryParamsJuego = {
						bot_info: this.nombre,
						contexto: q.contexto,
						instrucciones: aiMessage,
						assistant_id: this.assistantId,
						juego: {
							turno: 1,
							jugador: this.nombre,
							orden: [],
							siguiente: this.nombre,
							frase: "",
							historial: [],
							entrada: {
								pregunta: ""
							},
							salida: {
								respuesta: "",
								pregunta: ""
							},
						},
						solicitud: ""
					}
					console.log("lllllllllllllll--------------llllllllllllllllll", qr)
					ChatHelper.addQuery(this.mundo.modelo, qr);
				}
					break;
				}
				default: {
					console.log(systemMessage(this.nombre+ ">> SET_DOMAIN_LOGIC_DATA ENGINE... to: default"), action)
				}

			}


		});

		this.receivedBots = -100000000
	}

	onReady() {

		console.log(agentMessage(this.nombre, "onChangeTheStateAutomata"))

		this.omegaBot = new AlphaBot();
		this.omegaEstado = new IDEEstadoAppV1<IDEEstados>(this.mundo.modelo);
		this.crearBot("Bot.Omega", this.omegaBot, this.omegaEstado);

		this.bots.push(
			{ nombre: this.omegaBot.nombre }
		)

		console.log("XXXXXXXXX", this.nombre)
		this.conectarEntorno()
	}

	crearBot(nombre: string, bot: IFIASituada, estado: IDEEstadoAppV1<IDEEstados>) {

		bot.runStateEvent = this.runStateEvent;
        bot.mundo = this.mundo;
		bot.nombre = nombre

		estado.assistanceId = bot.assistantId;
		estado.assistanceName = bot.nombre;
		estado.onAssistantsReady = (as: Assistant[]) => this.onAssistantsReady(as);
		estado.nombre = bot.nombre + "/" + estado.nombre;
		bot
			.automata
			.estado = estado;
		console.log("/CREATE///////////////////////////////")
		console.log(estado.assistanceId, estado.assistanceName, estado.nombre)
	}
}