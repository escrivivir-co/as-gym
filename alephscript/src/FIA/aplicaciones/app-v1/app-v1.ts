import { IdeAppV1 } from "../ide-v1/ide-v1-app";
import { IDEEstadoAppV1 } from "./appv1-estado";
import { agentMessage } from "../../agentMessage";
import { AlphaBot } from "./alpha-bot";
import { Assistant } from "openai/resources/beta/assistants";
import { q } from "./lore";
import { IDEEstados } from "../ide-v1/situada/IDEEstados";
import { IFIASituada } from "../../paradigmas/situada/fia-situada";

export class AppV1 extends IdeAppV1 {

	alphaEstado: IDEEstadoAppV1<IDEEstados>;
	omegaEstado: IDEEstadoAppV1<IDEEstados>;
	templeEstado: IDEEstadoAppV1<IDEEstados>;

	receivedBots: number;
	expectedBots: number;

    constructor() {

        super();
        this.nombre = "AIBridgeApp";
    }

    async instanciar(): Promise<string> {

		this.expectedBots = 3
		this.receivedBots = 0;

		return await super.instanciarD(() => this.onReady());

    }

	inited = false;
	onAssistantsReady(as: Assistant[], caller?: string) {

		this.receivedBots++;

		if (this.receivedBots < this.expectedBots) {
			// console.log(agentMessage(this.nombre, "onAssistantsReady, quit!")/*, as*/, this.receivedBots, 
			// this.expectedBots, caller)
			return
		}

		console.log(agentMessage(this.nombre, "onAssistantsReady")/*, as*/, this.receivedBots, this.expectedBots,
		"=================ooooooooooooooooooooooooO=======================")

		if (this.inited) return
		this.inited = true;

		this.alphaBot.assistantId = as[0].id;
		this.omegaBot.assistantId = as[1].id;
		this.templeBot.assistantId = as[2].id;

		console.log(agentMessage(this.nombre, "onReady-Set"))

		q.contexto = q.instrucciones
		q.assistant_id = this.alphaBot.assistantId,
		IDEEstadoAppV1.addQuery(this.mundo.modelo, q);

		this.receivedBots = -100000000
	}

	onReady() {

		console.log(agentMessage(this.nombre, "onChangeTheStateAutomata"))

		this.alphaBot = new AlphaBot();
		this.alphaEstado = new IDEEstadoAppV1<IDEEstados>(this.mundo.modelo);
		this.crearBot("Bot.Alpha", this.alphaBot, this.alphaEstado);

		this.omegaBot = new AlphaBot();
		this.omegaEstado = new IDEEstadoAppV1<IDEEstados>(this.mundo.modelo);
		this.crearBot("Bot.Omega", this.omegaBot, this.omegaEstado);

		this.templeBot = new AlphaBot();
		this.templeEstado = new IDEEstadoAppV1<IDEEstados>(this.mundo.modelo);
		this.crearBot("Bot.Temple", this.templeBot, this.templeEstado);
	}

	crearBot(nombre: string, bot: IFIASituada, estado: IDEEstadoAppV1<IDEEstados>) {

		bot.runStateEvent = this.runStateEvent;
        bot.mundo = this.mundo;
		bot.nombre = nombre

		estado.assistanceName = "Asist." + bot.nombre;
		estado.onAssistantsReady = (as: Assistant[]) => this.onAssistantsReady(as);
		estado.nombre = bot.nombre + "/" + estado.nombre;
		bot
			.automata
			.estado = estado;

	}
}