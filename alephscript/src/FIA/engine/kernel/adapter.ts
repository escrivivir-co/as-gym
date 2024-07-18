import { ACTIVAR_SOPORTE_SOCKETIO, BORRAR_ESTADO_A_CADA_PLAY_STEP } from "../../../runCONFIG";
import { agentMessage } from "../../agentMessage";
import { iFIA } from "../../genesis-block";
import { RunStateEnum } from "../../mundos/mundo";
import { IFase } from "../../paradigmas/sbc/implementaciones/common-kads/IFase";
import { systemMessage } from "../../systemMessage";
import { AlephScriptClient } from "../apps/socketio/client";
import { Bloque } from "./cadena-bloques";

export class SocketAdapter {

	static threads: iFIA[] = [];
	static client: AlephScriptClient = ACTIVAR_SOPORTE_SOCKETIO ?
		new AlephScriptClient("botSeed") :
		null;

	menuAnswer: (answer: string, mode: RunStateEnum) => void;
	spider: AlephScriptClient;

	getCurrentApps() {
		const data = SocketAdapter.threads
			.map((t: iFIA, index: number) => {
				return {
					index,
					name: t.nombre,
					state: SocketAdapter.threads[index]?.runState
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
		SocketAdapter.client?.roomP(senderData);

	}

	sendAppState(appName: string, f: IFase) {

		const app = SocketAdapter.threads.find(t => t.nombre === appName);

		SocketAdapter.client?.room("SET_APP_STATE", f, appName)

	}

	run() {

		console.log(systemMessage(`Socket.Connected`));

		SocketAdapter.client?.room("MAKE_MASTER", { features: []});
		SocketAdapter.client?.room("MAKE_MASTER", { features: []}, "IDE-app");

		SocketAdapter.client?.io.on("GET_LIST_OF_THREADS", (...args) => {

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

			this.sendFrameworkState(args);

		})

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

