import { IModelo } from "../../../mundos/IModelo";

export interface Estado {

    modelo: IModelo;

    esObjetivo(): boolean;

}

export class Estado implements Estado {

    modelo: IModelo;
}