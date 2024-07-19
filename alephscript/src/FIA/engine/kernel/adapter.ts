import { ACTIVAR_SOPORTE_SOCKETIO, BORRAR_ESTADO_A_CADA_PLAY_STEP } from "../../../runCONFIG";
import { agentMessage } from "../../agentMessage";
import { iFIA } from "../../iFIA";
import { RunStateEnum } from '../../mundos/RunStateEnum';
import { IFase } from "../../paradigmas/sbc/implementaciones/common-kads/IFase";
import { systemMessage } from "../../systemMessage";
import { AlephScriptClient } from "../apps/socketio/client";
import { Bloque } from "./cadena-bloques";
import { IMenuState } from "./IMenuState";


export class SocketAdapter {

	name: "SocketAdapter";

	static threads: iFIA[] = [];
	static client: AlephScriptClient = ACTIVAR_SOPORTE_SOCKETIO ?
		new AlephScriptClient("botSeed") :
		null;

	menuAnswer: (answer: string, mode: RunStateEnum) => void;
	spider: AlephScriptClient;

	getCurrentApps(): IMenuState[] {
		const data = SocketAdapter.threads
			.filter(t => t?.nombre)
			.map((t: iFIA, index: number) => {
				return {
					index,
					name: t.nombre,
					state: SocketAdapter.threads[index]?.runState,
					mundo: {
						nombre: t.mundo.nombre,
						runState: t.mundo.runState,
						modelo: {
							nombre: t.mundo.modelo.nombre,
							dia: t.mundo.modelo.dia,
							muerte: t.mundo.modelo.muerte,
							pulso: t.mundo.modelo.pulso
						}
					},
					bots: t.bots || []
				}
		});
		return data;
	}

	sendFrameworkState(args) {

		if (!SocketAdapter.client) return;

		const rData = args[0];
		// console.log(systemMessage(SocketAdapter.client?.name + ">> Sending list of threads... to: " + rData?.requesterName))

		const senderData = {
			...rData,
			room: "ENGINE_THREADS",
			event: "SET_LIST_OF_THREADS",
			data: this.getCurrentApps()
		}
		console.log(agentMessage(SocketAdapter.name,
			"Solving (SET_LIST_OF_THREADS) for: " + senderData.requesterName))
		SocketAdapter.client?.roomP(senderData);

	}

	sendAppState(appName: string, f: IFase) {

		const app = SocketAdapter.threads.find(t => t.nombre === appName);

		//console.log("This sent SET_APP_STATE------------------", f?.imprimir(), appName)
		// SocketAdapter.client?.room("SET_APP_STATE", f?.imprimir(), appName)

	}

	sus = ["GET_LIST_OF_THREADS", "GET_ENGINE"]
	run() {

		console.log(systemMessage(`Socket.Connected`));

		SocketAdapter.client?.room("MAKE_MASTER", { features: [] });
		SocketAdapter.client?.room("MAKE_MASTER", { features: ["GET_LIST_OF_THREADS", "GET_ENGINE"]}, "IDE-app");

		this.sus.forEach(k => SocketAdapter.client?.io.off(k))
		SocketAdapter.client?.io.on("GET_LIST_OF_THREADS", (...args) => {

			console.log(agentMessage(SocketAdapter.name, "Received (GET_LIST_OF_THREADS) from: " + args[0].requesterName))
			this.sendFrameworkState(args);

		})

		SocketAdapter.client?.io.on("GET_ENGINE", (...args) => {

			const rData = args[0];
			console.log(systemMessage(SocketAdapter.client?.name + ">> DO ENGINE... to: "), rData)


			// START/STOP
			const action = rData?.data?.action;

			const engine = rData?.data?.engine;
			const fia = SocketAdapter.threads[engine];

			// console.log("BloqueDebuguer", Bloque.estado)
			if (BORRAR_ESTADO_A_CADA_PLAY_STEP) {
				Object.keys(Bloque.estado).forEach(k => {
					Bloque.estado[k] = []
				})
			}
			console.log(
				agentMessage("APP_PROGRESS_3",
					'S:>' +
					action + ":>" + fia.nombre +
							":>" + fia.runState +
							":>" + fia.mundo.runState)
			);

			switch(action as RunStateEnum) {
				case RunStateEnum.PLAY:
				case RunStateEnum.PLAY_STEP:
					if (fia.runState == RunStateEnum.PAUSE) {

						console.log(
							agentMessage("APP_PROGRESS_3",
								'S:>' +
								'RESUMING' + ":>" + fia.nombre +
										":>" + fia.runState +
										":>" + fia.mundo.runState)
						);

						fia.mundo.runState = action;
						fia?.runStateEvent.next(action)

					} else {
						console.log(
							agentMessage("APP_PROGRESS_3",
								'S:>' +
								'BOOTING' + ":>" + fia.nombre +
										":>" + fia.runState +
										":>" + fia.mundo.runState)
						);

						this.menuAnswer(engine, action);
					}
					break;
				case RunStateEnum.STOP:
					fia?.runStateEvent.next(RunStateEnum.STOP)
					break;
				case RunStateEnum.PAUSE:
					fia.runStateEvent.next(RunStateEnum.PAUSE)
					break;
				default:
					console.log("---------- DESCONOCIDA ACTION", action, action as RunStateEnum)
			}
			console.log("^***********7777777777777777777777777777777**************", fia.mundo.modelo.dia)
			this.sendFrameworkState(args);

		})

	}

	crearSpider() {

		if (!this.spider) {

			this.spider = new AlephScriptClient("botSpider") ;
			this.spider.initTriggersDefinition.push(() => {

				this.spider.io.on("SET_LIST_OF_THREADS", (...args) => {
					/*
					console.log(
						systemMessage(this.spider.name + ">> Receiving list of threads...")
					)
						*/
				})

				console.log(
					agentMessage(this.spider.name,"Send GET_LIST_OF_THREADS")
				)
				this.spider.room("GET_LIST_OF_THREADS", {});

				this.spider.io.on("SET_SERVER_STATE", (...args) => {
					/*
					console.log(
						systemMessage(this.spider.name + ">> Receiving server state..."),
					)
					*/
				})

				this.spider.room("GET_SERVER_STATE");

			})

		}
	}

}

