import { Modelo } from "../../../../../mundos/modelo";
import { IFormulario } from "./formulario";
import { CML, ICML } from "./cml";


export class Vacio extends Modelo {

    formularios = [];

    cml: ICML = new CML();

}

export interface ICKNivel {

    formularios: () => IFormulario[];

    comoJSON(): object;

}



