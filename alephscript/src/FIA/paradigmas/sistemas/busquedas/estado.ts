import { IModelo } from "../../../mundos/IModelo";

export interface Estado {

    modelo: any;

    esObjetivo(): boolean;

}

export class Estado implements Estado {

    modelo: any;
}