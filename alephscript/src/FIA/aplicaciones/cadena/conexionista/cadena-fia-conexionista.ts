import { i18 } from "../../../i18/aleph-script-i18";
import { agentMessage } from "../../../agentMessage";
import { IProblema, IRequisitos, ISolucion } from "../../../paradigmas/simbolica/modelos/formal/inferencia/relacion/paradigma";
import { IRedNeuronalArtificial, RedNeuronalArtificial } from "../../../paradigmas/conexionista/red-neuronal";
import { IMundo } from "../../../mundos/mundo";
import { FIAConexionista, IFIAConexionista } from "../../../paradigmas/conexionista/fia-conexionista";

// export namespace IASituada {

    export const TOPE_POSICION = 9;

    export class CadenaFIAConexionista extends FIAConexionista {

        modelo: IRedNeuronalArtificial = new RedNeuronalArtificial();

        runAsync = true;

        nombre = i18.APPS.CADENA.CONEXIONISTA.NOMBRE;

        analisis: (p: IProblema) => ISolucion[];
        sintesis: (r: IRequisitos) => ISolucion;
        modificacion: (s: ISolucion) => IMundo;

        async instanciar(): Promise<string> {

            console.log(agentMessage(this.nombre, i18.APPS.CADENA.CONEXIONISTA.SIMULATION_START));

            console.log(
                agentMessage(this.nombre, `${i18.APPS.CADENA.SIMULATION_BODY}:${this.modelo}`)
            );

            return `${i18.APPS.CADENA.CONEXIONISTA.SIMULATION_END}`;
        }
    }

// }

