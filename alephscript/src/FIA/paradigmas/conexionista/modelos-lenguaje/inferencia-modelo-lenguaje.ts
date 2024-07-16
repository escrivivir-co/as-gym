import { IBaseConocimiento } from "../../../mundos/base-conocimiento";
import { IDominio } from "../../../mundos/dominio";
import { Inferencia } from "../../simbolica/inferencia";

export class InferenciaModeloLenguaje<T> implements InferenciaModeloLenguaje<T> {

    mensajes: T[];

    configurar(b: IBaseConocimiento, parametros: IDominio): void {}

    imprimir() {
        return " \n export class InferenciaModeloLenguaje: \n" + JSON.stringify(this) + "\n";
    }

}

export interface InferenciaModeloLenguaje<T> extends Inferencia {
    mensajes: T[];

    configurar(b: IBaseConocimiento, parametros: IDominio): void;

    imprimir();
}
