import { IModelo } from "../../../mundos/modelo";

export interface Estado {

    modelo: IModelo;

    esObjetivo(): boolean;

}

export class Estado implements Estado {

    modelo: IModelo;
}