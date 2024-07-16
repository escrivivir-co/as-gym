import { IModelo } from "../../../../../../mundos/modelo";
import { agentMessage } from "../../../../../../agentMessage";
import { EstadoT } from "../../../../../situada/estado";
import { AS_COMMON_KADS_I18 } from "../../as-common-kads-i18";

export interface IAplicacion {
    comoJSON(): unknown;

    nombre: string;
    iniciar(estado: EstadoT<IModelo>): Promise<EstadoT<IModelo>>;

}
export class Aplicacion implements IAplicacion {

    i18 = AS_COMMON_KADS_I18.COMMON_KADS.SISTEMA.APLICACION;

    nombre = this.i18.NOMBRE;

    async iniciar(estado: EstadoT<IModelo>): Promise<EstadoT<IModelo>> {

        estado.modelo.dominio.base = {
            start: new Date(),
            end: new Date()
        };

        console.log(agentMessage(this.nombre, `${this.i18.CABECERA}`));
        console.log(agentMessage(this.nombre, `${this.i18.PIE}`));
        return estado;

    }

    comoJSON(): unknown {
        return this.nombre;
    }

}