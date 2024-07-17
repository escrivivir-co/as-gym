import { Modelo } from "../../../../../mundos/modelo";
import { CML } from "./cml";
import { ICML } from "./ICML";


export class Vacio extends Modelo {

    formularios = [];

    cml: ICML = new CML();

}


