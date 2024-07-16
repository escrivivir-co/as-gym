import { MarcoClase } from "./marco-clase";
import { IMarco } from "./marcos";

export interface IMarcoInstancia extends IMarco {

}

export class MarcoInstancia extends MarcoClase implements IMarcoInstancia {}