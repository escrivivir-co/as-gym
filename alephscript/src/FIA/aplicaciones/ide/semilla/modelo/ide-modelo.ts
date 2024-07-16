import { Modelo } from "../../../../mundos/modelo";
import { AS_APP_IDE_i18 } from "../ide-app-i18";
import { IDEEstados } from "../situada/ide-estado";

export class IDEModelo extends Modelo {

    estado: IDEEstados;

    nombre = AS_APP_IDE_i18.IDE.MUNDO.MODELO;

    imprimir(): string {

        return this.nombre;
    }

}