import { iFIA } from "../../genesis-block";
import { RunStateEnum } from "../../mundos/mundo";
import { IFase } from "../../paradigmas/sbc/implementaciones/common-kads/IFase";
import { systemMessage } from "../../systemMessage";
import { AlephScriptClient } from "../apps/socketio/client";

export class SocketAdapter {

	static threads: iFIA[] = [];
	static client: AlephScriptClient = new AlephScriptClient("CRT-AS-01") ;

	menuAnswer: (answer: string, mode: RunStateEnum) => void;
	spider: AlephScriptClient;

	getCurrentApps() {
		const data = SocketAdapter.threads.map((t: iFIA, index: number) => {
			return {
				index,
				name: t.nombre,
				state: SocketAdapter.threads[index]?.runState
			}
		});
		return data;
	}

	sendFrameworkState(args) {

		const rData = args[0];
		console.log(systemMessage(SocketAdapter.client.name + ">> Sending list of threads... to: " + rData?.requesterName))

		const senderData = {
			...rData,
			room: "ENGINE_THREADS",
			event: "SET_LIST_OF_THREADS",
			data: this.getCurrentApps()
		}
		SocketAdapter.client.roomP(senderData);

	}

	sendAppState(appName: string, f: IFase) {

		const app = SocketAdapter.threads.find(t => t.nombre === appName);

		SocketAdapter.client.room("SET_APP_STATE", f, appName)

	}

	run() {

		console.log(systemMessage(`Socket.Connected`));

			SocketAdapter.client.room("MAKE_MASTER", { features: []});
			SocketAdapter.client.room("MAKE_MASTER", { features: []}, "IDE-app");

			SocketAdapter.client.io.on("GET_LIST_OF_THREADS", (...args) => {

				this.sendFrameworkState(args);

			})

			SocketAdapter.client.io.on("GET_ENGINE", (...args) => {

				const rData = args[0];
				console.log(systemMessage(SocketAdapter.client.name + ">> DO ENGINE... to: " + rData))

				// START/STOP
				const action = rData?.data?.action;

				const engine = rData?.data?.engine;
				const fia = SocketAdapter.threads[engine];

				switch(action as RunStateEnum) {
					case RunStateEnum.PLAY:
					case RunStateEnum.PLAY_STEP:
						if (fia.runState == RunStateEnum.PAUSE) {
							fia?.runStateEvent.next(action)
						} else {
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

				this.spider = new AlephScriptClient("WEB-AS-01") ;
				this.spider.initTriggersDefinition.push(() => {

					this.spider.io.on("SET_LIST_OF_THREADS", (...args) => {
						console.log(
							systemMessage(this.spider.name + ">> Receiving list of threads...")
						)
					})
					this.spider.room("GET_LIST_OF_THREADS", {});

					this.spider.io.on("SET_SERVER_STATE", (...args) => {
						console.log(
							systemMessage(this.spider.name + ">> Receiving server state..."),
						)
					})

					this.spider.room("GET_SERVER_STATE");

				})

			}
	}
}