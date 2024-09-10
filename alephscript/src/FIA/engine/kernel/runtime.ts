
import { FIA, GenesisBlock } from "../../genesis-block";
import { iFIA } from "../../iFIA";
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
import { RunStateEnum } from "../../mundos/RunStateEnum";
import { AppV1 } from "../../aplicaciones/app-v1/app-v1";
import { MODO_CONSOLA_ACTIVADO } from "../../../runCONFIG";
// import { ExpectedBenchmark, HostMonitor } from "../host-info";
import { RTCache } from "./rt-cache";
import { BusquedasApp } from "../../aplicaciones/busquedas/busquedas-app";
import { AnSindicModelVF } from "../../aplicaciones/an-sindic-model-YV/user-app";

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

/*// Uso de la clase HostMonitor
(async () => {
    const expectedBenchmark: ExpectedBenchmark = { cpuScore: 50, ramScore: 50, gpuScore: 50, storageScore: 50, networkScore: 50 };
    const monitor = new HostMonitor();
    await monitor.generateReport(expectedBenchmark);
    console.log(monitor.Report);

	const rt = new RTCache();
	rt.guardar("Report", monitor.Report)
	rt.persistir();
})();
return */
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
		const busquedasApp = new BusquedasApp();
        Runtime.threads.push(busquedasApp);

        const cadenaApp = new CadenaApp();
        Runtime.threads.push(cadenaApp);

        const ideAppV1 = new AppV1();
        Runtime.threads.push(ideAppV1);

		const ideApp = new IdeApp();
        Runtime.threads.push(ideApp);

		const vfApp = new AnSindicModelVF();
        Runtime.threads.push(vfApp);

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
					console.log("^************99999999999999999999999999999999*************", fia.mundo.modelo.dia)
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

							console.log(
								agentMessage("APP_PROGRESS_3",
									'S:>' +
									'. W_INPUT' + ":>" + fia.nombre +
									". FIA:>" + fia.runState +
									". W:>" + fia.mundo.runState)
							);
							if (modeConsola) return;

							// APP TIMELINE FOR SOCKEITO
							if (f.runState == RunStateEnum.PAUSE) {
								fia.runStateEvent.next(f.runState)
								// console.log("APP TIMELINE FOR SOCKEITO --> sendFrameworkState", fia.mundo.modelo.dia)
								this.sendFrameworkState({})

								// console.log("*********** estado")
								// console.log(f.modelo.estado)
								// console.log("*********** dominio")
								// console.log(f.modelo.dominio.base["FASE"])

								this.sendAppState(fia.nombre, f.modelo.dominio.base["FASE"])
							} else {
								// console.log("Is not paused--------<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
							}

						})

						// APP MAIN
						fia.runStateEvent.next(mode || RunStateEnum.PLAY_STEP);

						if (mode || RunStateEnum.PLAY_STEP) {
							modeConsola = MODO_CONSOLA_ACTIVADO
							console.log(agentMessage(this.nombre, "'y' para activar el modo consola."))
						}

						console.log(
							agentMessage("APP_PROGRESS_3",
								'S:>' +
								'APP_LOOP' + ":>" + fia.nombre +
										":>" + fia.runState +
										":>" + fia.mundo.runState)
						);
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