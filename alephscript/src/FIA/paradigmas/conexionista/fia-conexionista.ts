import { iFIA, GenesisBlock } from "../../genesis-block";
import { Intencion } from "../../Intencion";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/mundo";
import { agentMessage } from "../../agentMessage";
import { ICanalizacion } from "./canalizacion";
import { IRedNeuronalArtificial, RedNeuronalArtificial } from "./red-neuronal";
import { ISolucion } from "./rna/red";
import { IAprendizaje } from "./rna/entrenar";

/**
 * Redes neuronales y otros gestores de tensores
 */
export interface IFIAConexionista extends iFIA {

    inferencia: (p: ICanalizacion) => ISolucion;

}

export class FIAConexionista extends GenesisBlock implements IFIAConexionista {

    runAsync = true;

    modelo: IRedNeuronalArtificial = new RedNeuronalArtificial();

    aprendizaje: (p: IAprendizaje) => IRedNeuronalArtificial;

    i18 = i18.CONEXIONISTA.NEURONAL;

    async inferencia(c: ICanalizacion): Promise<ISolucion> {

        this.modelo.clasificador.canalizacion = c;
        const solucion = await this.modelo.clasificador.canalizacion.canalizar();

        return solucion as unknown as ISolucion;
    }

    imprimir(): string {
        return `${this.i18.IDLE}`;
    }

    async instanciar(): Promise<string> {

        console.log(agentMessage(this.nombre, this.i18.SIMULATION_START));

        console.log(
            agentMessage(this.nombre, `${this.i18.SIMULATION_BODY}:${this.imprimir()}`)
        );

        await this.probar();

        console.log(agentMessage(this.nombre, `${this.i18.SIMULATION_END}`));
        return "";
    }

    async probar(): Promise<void> {

        const dato_a = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        const dato_b = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);

        console.log("T012")
        await this.modelo.clasificador.canalizacion.canalizarDe2Parametros({
            modelo: "/Users/morente/Desktop/DRIVE/taller_tc/JE20/je20/fia/dist/FIA/aplicaciones/cadena/conexionista/model.onnx" ,
            dato_a,
            dato_b
        })

    }

}

export namespace FIAConexionista {

export const fiaConexionista = new FIAConexionista();

fiaConexionista.nombre = i18.FIA_CONEXIONISTA_LABEL;
fiaConexionista.razona =
    (m: IMundo, i: Intencion) => {
    return "No";
}

}