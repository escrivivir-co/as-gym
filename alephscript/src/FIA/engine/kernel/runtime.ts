
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

export const EXIT_PROMPT_INDEX = 99;

export function menuOption(message: string) {
    return `\t - ${message}`;
}

/**
 * Motor de FIAs
 */
export class Runtime extends SocketAdapter {

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

        const ideApp = new IdeApp();
        Runtime.threads.push(ideApp);

    }

    async demo(): Promise<void> {

		SocketAdapter.client.initTriggersDefinition.push(
			() => this.run()
		);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

		this.menuAnswer = async (answer, mode: RunStateEnum) => {

			const index = parseInt(answer);
			if (isNaN(index)) {
				console.log("No FIA index given!", answer);
			} else {

				// try {
					const fia = Runtime.threads[index];

					waitForUserInput();

					console.clear();
					console.log(systemMessage(`${i18.LOOP.LAUNCH_FIA_LABEL}: ${fia.nombre}`));

					if (fia.runAsync) {

						fia.mundo.eferencia.asObservable().subscribe(f => {

							if (f.runState == RunStateEnum.PAUSE) {
								fia.runStateEvent.next(f.runState)
								this.sendAppsList({})
							}

						})

						fia.runStateEvent.next(mode || RunStateEnum.PLAY);
						const instancia = await fia.instanciar();

						fia.runStateEvent.next(RunStateEnum.STOP);
						console.log(agentMessage(fia.nombre, instancia));

						this.sendAppsList({});

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
				waitForUserInput();
			}
		};

        let app;
        let cpu: number = 0;
        const waitForUserInput = async (): Promise<void> => {

            Runtime.threads.forEach((t: iFIA, index: number) => {
                console.log(menuOption(`[${index}]: Modelo: ${t.nombre}`));
				t.runState = RunStateEnum.STOP;
            });
            console.log(menuOption(`[${EXIT_PROMPT_INDEX}]: ${i18.EXIT_PROMT_LABEL}`));

            rl.question(`${i18.MENU_PROMPT_DATA_LABEL}`, (answer) => this.menuAnswer(answer, RunStateEnum.PLAY));
        }

        console.log(systemMessage(`${i18.LOOP.LOAD_FIA_LABEL}`));
        return await waitForUserInput();

    }

}