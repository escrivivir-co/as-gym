import { Subject } from "rxjs";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo, Mundo, RunStateEnum } from "../../mundos/mundo";
import { Modelo } from "../../mundos/modelo";
import { agentMessage } from "../../agentMessage";
import { EstadoT } from "./estado";
import { IEstadoT } from "./IEstadoT";
import { IEstado } from "./IEstado";
import { IDEEstados } from "../../aplicaciones/ide-v1/situada/IDEEstados";

export interface IAutomata {

    nombre: string;

    estado: IEstado;
    mundo: IMundo;

    eferencia: Subject<IMundo>;

    configurar(): void;
    inicializar(): void;

}

export interface IAutomataT<T> extends IAutomata {

    estado: IEstadoT<T>;

}

export class Automata<T> implements IAutomataT<T> {

    estado: IEstadoT<T>;
    mundo: IMundo;

    eferencia = new Subject<IMundo>();

    nombre: string;

    constructor() {

        this.nombre = i18.SITUADA.AUTOMATA.NOMBRE;
        this.mundo = new Mundo();
        this.mundo.modelo = new Modelo();
        this.estado = new EstadoT<T>(this.mundo.modelo);
    }

    configurar() {

        this.mundo.agregarAferencia(this.eferencia.asObservable());

    }

    async inicializar() {

        this.mundo.eferencia.subscribe(async (m) => {

            // console.log(agentMessage(this.nombre, i18.SITUADA.AUTOMATA.RECEPCION_AFERENCIA_LABEL));

            /**
            * Procesar aferencia: Modelo (m)
            * */

            const aferencia = new EstadoT<T>(m.modelo);

			if (m.modelo.dia == (m.modelo.muerte)) {
				this.estado.modelo.estado = IDEEstados.PARAR;
			}

            /**
            * Ejecución de las transiciones de ciclo
            * */
            await this.estado.transicion(aferencia);


            this.mundo.modelo = this.estado.comoModelo();

            /**
            * Lanzar eferencia de regreso al mundo
            * */
            // console.log(agentMessage(this.nombre, i18.SITUADA.AUTOMATA.ENVIO_EFERENCIA_LABEL));

            // this.eferencia.next(this.mundo);

        });

        // Invocación génesis...
        await this.mundo.alAcabar(this.nombre);
        console.log(agentMessage(this.nombre, "Acabé mis tareas. Adiós muy buenas!"))
    }
}
