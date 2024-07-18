
import { iFIA, FIA, GenesisBlock } from "../../genesis-block";
import { IACientifica } from "../../paradigmas/cientifica/paradigma";
import { i18 } from "../../i18/aleph-script-i18";
import { systemMessage } from "../../systemMessage";
import { agentMessage } from "../../agentMessage";
import * as readline from 'readline';
import { CadenaApp } from "../../aplicaciones/cadena/cadena-app";
import { IASituada } from "../../paradigmas/situada/paradigma";
import { FIAConexionista } from "../../paradigmas/conexionista/fia-conexionista";
import { FIASimbolica } from "../../paradigmas/simbolica/fia-simbolica";
import { FIA_SBC } from "../../paradigmas/sbc/fia-sbc";
import { IdeApp } from "../../aplicaciones/ide/semilla/semilla-app";
import { SocketAdapter } from "./adapter";
import { RunStateEnum } from "../../mundos/mundo";
import { IdeAppV1 } from "../../aplicaciones/ide-v1/ide-v1-app";
import { AppV1 } from "../../aplicaciones/app-v1/app-v1";

export const EXIT_PROMPT_INDEX = 99;

export function menuOption(message: string) {
    return `\t - ${message}`;
}

/**
 * Motor de FIAs
 */
export class Runtime extends SocketAdapter {

	nombre = "RT"
    start() {

        const fia = new FIA();
        Runtime.threads.push(fia);

        const gb = new GenesisBlock();
        Runtime.threads.push(gb);

        /**
         * BASE
         */
        Runtime.threads.push(IACientifica.fiaDebil);
        Runtime.threads.push(IACientifica.fiaFuerte);

        Runtime.threads.push(FIASimbolica.fiaSimbolica);
        Runtime.threads.push(IASituada.fiaSituada);
        Runtime.threads.push(FIAConexionista.fiaConexionista);

        Runtime.threads.push(new FIA_SBC());

        /**
         * APPS
         */
        const cadenaApp = new CadenaApp();
        Runtime.threads.push(cadenaApp);

        const ideAppV1 = new AppV1();
        Runtime.threads.push(ideAppV1);

		const ideApp = new IdeApp();
        Runtime.threads.push(ideApp);

    }

	index = 0;
    async demo(): Promise<void> {

		SocketAdapter.client?.initTriggersDefinition.push(
			() => this.run()
		);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

		let modeConsola = false;
		this.menuAnswer = async (answer, mode: RunStateEnum) => {

			if (answer == "n") {
				console.log(agentMessage(this.nombre,
					"Se ha desactivado el modo consola. Se responderá al canal externo. 'y' para activar."))
				modeConsola = false;
				return await waitForUserInput(false);
			}

			if (answer == "y") {

				if (!modeConsola) {
					console.log(agentMessage(this.nombre,
						"Se ha activado el modo consola. No se responderá al canal externo. 'n' para desactivar."))
					modeConsola = true;
				}

				const fia = Runtime.threads[this.index];

				// APP TIMELINE FOR KEYBOARD
				if (fia.mundo.runState == RunStateEnum.PAUSE) {

					console.log(agentMessage(this.nombre, "Avanzar estado"), fia.mundo.nombre)

					// Notificar al mundo
					fia.mundo.runState = RunStateEnum.PLAY_STEP
					fia.runStateEvent.next(fia.mundo.runState)

					// Notificar clientes externos
					this.sendFrameworkState({})
					this.sendAppState(fia.nombre, fia.mundo.modelo.dominio.base["FASE"])
				}

				return await waitForUserInput(false);
			}

			const index = parseInt(answer);
			if (isNaN(index)) {
				console.log("No FIA index given!", answer);
			} else {

				// try {
					const fia = Runtime.threads[index];
					this.index = index;

					waitForUserInput(true);

					console.clear();
					console.log(systemMessage(`${i18.LOOP.LAUNCH_FIA_LABEL}: ${fia.nombre}`));

					if (fia.runAsync) {

						fia.mundo.eferencia.asObservable().subscribe(f => {

							if (modeConsola) return;

							// APP TIMELINE
							if (f.runState == RunStateEnum.PAUSE) {
								fia.runStateEvent.next(f.runState)
								this.sendFrameworkState({})

								console.log("*********** estado")
								console.log(f.modelo.estado)
								console.log("*********** dominio")
								console.log(f.modelo.dominio.base["FASE"])

								this.sendAppState(fia.nombre, f.modelo.dominio.base["FASE"])
							}

						})

						// APP MAIN
						fia.runStateEvent.next(mode || RunStateEnum.PLAY_STEP);

						if (mode || RunStateEnum.PLAY_STEP) {
							modeConsola = true
							console.log(agentMessage(this.nombre, "'y' para activar el modo consola."), fia.mundo.nombre)
						}
						const instancia = await fia.instanciar();
						fia.runStateEvent.next(RunStateEnum.STOP);
						console.log(agentMessage(fia.nombre, instancia));

						// INITIAL STATE
						this.sendFrameworkState({});

					} else {
						console.log(agentMessage(fia.nombre, fia.imprimir()));
					}


				/* } catch(Ex) {
					console.log("Error running FIA", Ex.message);
				} */
			}
			if (index == EXIT_PROMPT_INDEX){
				console.log(systemMessage(`"System closed by user! Bye!"`));
				rl.close();
			} else {
				waitForUserInput(true);
			}
		};

        let app;
        let cpu: number = 0;
        const waitForUserInput = async (menu: boolean): Promise<void> => {

			if (menu) {
				Runtime.threads.forEach((t: iFIA, index: number) => {
					console.log(menuOption(`[${index}]: Modelo: ${t.nombre}`));
					t.runState = RunStateEnum.STOP;
				});
				console.log(menuOption(`[${EXIT_PROMPT_INDEX}]: ${i18.EXIT_PROMT_LABEL}`));

			}
			const m = menu ? i18.MENU_PROMPT_DATA_LABEL : "'y' para continuar... \n"
			rl.question(`${m}`,
				(answer) => this.menuAnswer(answer, RunStateEnum.PLAY_STEP));

        }

        console.log(systemMessage(`${i18.LOOP.LOAD_FIA_LABEL}`));
        return await waitForUserInput(true);

    }

}