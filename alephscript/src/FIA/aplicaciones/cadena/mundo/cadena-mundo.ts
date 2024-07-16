import { Observable } from "rxjs";
import { i18 } from "../../../i18/aleph-script-i18";
import { IMundo, Mundo } from "../../../mundos/mundo";
import { agentMessage } from "../../../agentMessage";


export class CadenaMundo extends Mundo {
    agregarAferencia(o: Observable<IMundo>) {

        const s = o.subscribe(m => {

            console.log("Imprimir the cadena mundo");
             this.modelo = m.modelo;
                 console.log(agentMessage(this.nombre,
                     i18.MUNDO.AFERENCIA.RECEPCION_LABEL), this.modelo.imprimir());

         });

         this.aferencias.push(s);

     }

}