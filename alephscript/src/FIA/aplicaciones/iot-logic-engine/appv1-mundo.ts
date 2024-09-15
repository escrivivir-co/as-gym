import { Observable } from "rxjs";
import { IModelo } from "../../mundos/IModelo";
import { IMundo } from "../../mundos/IMundo";
import { IDEMundo } from "./ide-v1/ide-mundo";

export class AppV1Mundo extends IDEMundo {

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