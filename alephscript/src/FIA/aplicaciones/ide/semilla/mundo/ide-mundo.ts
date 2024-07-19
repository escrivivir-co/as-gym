import { Observable } from "rxjs";
import { Mundo } from "../../../../mundos/mundo";
import { IMundo } from "../../../../mundos/IMundo";
import { IModelo } from "../../../../mundos/IModelo";

export class IDEMundo extends Mundo {

    modelo: IModelo;

    agregarAferencia(o: Observable<IMundo>) {

        const s = o.subscribe(m => {

            this.modelo = m.modelo;
            /* console.log(agentMessage(this.nombre,
                i18.MUNDO.AFERENCIA.RECEPCION_LABEL), this.modelo.imprimir()); */

        });

        this.aferencias.push(s);

    }

}