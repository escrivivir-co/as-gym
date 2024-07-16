import { IMarco, Marco } from "./marcos";

export interface IMarcoClase extends IMarco {

}


export class MarcoClase extends Marco implements IMarcoClase {}
