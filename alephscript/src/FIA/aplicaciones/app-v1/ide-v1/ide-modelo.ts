import { Modelo } from "../../../mundos/modelo";
import { AS_APP_IDE_i18 } from "./semilla/ide-v1-app.i18";
import { IDEEstados } from './situada/IDEEstados';


export class IDEModelo extends Modelo {

    estado: IDEEstados;

    nombre = AS_APP_IDE_i18.IDE.MUNDO.MODELO;

    imprimir?(): string {

        return this.nombre;
    }

}