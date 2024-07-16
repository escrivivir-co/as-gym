import { IBaseConocimiento } from "./base-conocimiento";

/**
 * Una subunidad de almacenamiento en un modelo
 * constituye un dominio. Información pura.
 */
export interface IDominio {
    base: IBaseConocimiento
}

export class Dominio implements IDominio {

    constructor(public base: IBaseConocimiento){}

}