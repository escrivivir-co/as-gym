import { Automata } from "../../../../paradigmas/situada/automata";
import { IDE_SITUADA_i18 } from "../semilla/ide-v1-app.i18";
import { IDEEstado } from "../ide-estado";
import { EstadoT } from "../../../../paradigmas/situada/estado";
import { IDEEstados } from "./IDEEstados";
import { agentMessage } from "../../../../agentMessage";
import { RunStateEnum } from "../../../../mundos/RunStateEnum";

export class IDEAutomata<IDEEstados> extends Automata<IDEEstados> {

    nombre = IDE_SITUADA_i18.SITUADA.NOMBRE;
	s: any;

    configurar(): void {

        super.configurar();

        this.estado = new IDEEstado<IDEEstados>(this.mundo.modelo);

		this.estado.nombre = this.nombre + "/" + this.estado.nombre;
    }

    async inicializar() {

		console.log(agentMessage(this.nombre, "OnInicializar > " + this.estado.nombre));
		if (this.s) this.s.unsubscribe();

		this.estado.onAssistantsReady = this.onAssistantsReady;
		console.log("Set ------------------------------------", this.onAssistantsReady, this.estado.nombre)
		if (this.estado.onAssistantsReady) this.estado.onAssistantsReady = this.onAssistantsReady;

        this.s = this.mundo.eferencia.subscribe(async (m) => {

            console.log(agentMessage(this.nombre, "M: " + m.nombre + ":>" + "(F) + (e: " +  m.runState + ")"));

			if (m.runState == RunStateEnum.PAUSE) return

            /**
            * Procesar aferencia: Modelo (m)
            * */

            const aferencia = new EstadoT<IDEEstados>(m.modelo);

			if (m.modelo.dia == (m.modelo.muerte)) {
				this.estado.modelo.estado = IDEEstados.PARAR;
			}

            /**
            * Ejecución de las transiciones de ciclo
            * */
			console.log(agentMessage(this.nombre, "OnEferencia - Estado>"), this.estado.nombre);

            await this.estado.transicion(aferencia);

            this.mundo.modelo = this.estado.comoModelo();

            /**
            * Lanzar eferencia de regreso al mundo
            * */
            console.log(agentMessage(this.nombre, "OnEferencia - End"));

            // this.eferencia.next(this.mundo);

        });

        // Invocación génesis...
        await this.mundo.alAcabar(this.nombre);
        console.log(agentMessage(this.nombre, "Acabé mis tareas. Adiós muy buenas!"))
    }

}