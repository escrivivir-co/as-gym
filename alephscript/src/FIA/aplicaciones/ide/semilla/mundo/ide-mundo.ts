import { Observable } from "rxjs";
import { IMundo, Mundo } from "../../../../mundos/mundo";
import { IModelo } from "../../../../mundos/modelo";
import { agentMessage } from "../../../../agentMessage";
import { i18 } from "../../../../i18/aleph-script-i18";

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