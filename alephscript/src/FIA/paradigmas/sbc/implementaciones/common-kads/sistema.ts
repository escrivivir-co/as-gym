import { Observable, Subject } from "rxjs";
import { Modelo } from "../../../../mundos/modelo";
import { IModelo } from "../../../../mundos/IModelo";
import { IDiccionarioI18 } from "../../../../genesis-block";
import { AS_COMMON_KADS_I18 } from "./as-common-kads-i18";
import { agentMessage } from "../../../../agentMessage";
import { EstadoT } from "./estado";
import { IEstadoT } from "./IEstadoT";
import { ISistema } from "./ISistema";

export interface ISistemaRuntime {

    i18: IDiccionarioI18;

    nombre: string;

    sistema: ISistema;
    monitor: Observable<IEstadoT<IModelo>>;

    ejecutar(): Promise<IEstadoT<IModelo>>;
}

export class SistemaRuntime implements ISistemaRuntime {

    i18 = AS_COMMON_KADS_I18.COMMON_KADS.SISTEMA;

    nombre = this.i18.NOMBRE;

    sujeto = new Subject<IEstadoT<IModelo>>();

    monitor = this.sujeto.asObservable();

    constructor(public sistema: ISistema) {}

    async ejecutar(): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            console.log(agentMessage(this.nombre, `${this.i18.CABECERA}`));
            const estado = new EstadoT<IModelo>(new Modelo());
            try {
                await this.sistema.aplicacion.iniciar(estado);

                resolve(estado);

            } catch(ex) {
                reject(ex.message);
            }
            console.log(agentMessage(this.nombre, `${this.i18.PIE}`));
        });

    }
}
