import { agentMessage } from "../../agentMessage";
import { i18 } from "../../i18/aleph-script-i18";
import { IModelo } from "../../mundos/IModelo";
import { FIASituada, IFIASituada } from "../../paradigmas/situada/fia-situada";
import { IDE_SITUADA_i18 } from "./ide-v1/semilla/ide-v1-app.i18";
import { IDEAutomata } from "./ide-v1/situada/ide-automata";
import { IDEEstados } from "./ide-v1/situada/IDEEstados";

export class AlphaBot extends FIASituada implements IFIASituada {

	i18 = IDE_SITUADA_i18.SITUADA;

	nombre = this.i18.NOMBRE;

	runAsync = true;

	automata = new IDEAutomata<IDEEstados>();

	async instanciarV(): Promise<IModelo> {

		console.log(agentMessage(this.nombre, this.i18.SIMULATION_START));

		/**
		 * * Autómata que representa la cinta transportadora de la cadena de producción
		 */
		this.automata.nombre = this.nombre + "/" + this.automata.nombre;
		this.automata.mundo = this.mundo;

		await this.automata.inicializar();

		console.log(
			agentMessage(this.nombre,
			`${i18.SITUADA.SIMULATION_BODY}: \n[[\n${this.automata.mundo.modelo.imprimir()}\n]]\n`)
		);
		// console.log(i18.SISTEMA.ENTER_PARA_SEGUIR);
		const mModelo = {...this.automata.mundo.modelo}
		mModelo.nombre = this.nombre + "/" + mModelo.nombre;
		return mModelo;
	}
}
