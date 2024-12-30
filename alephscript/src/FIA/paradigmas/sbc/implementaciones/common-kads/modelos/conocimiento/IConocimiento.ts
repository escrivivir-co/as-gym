import { ICML } from "../../nivel/ICML";
import { IFormulario } from "../../nivel/IFormulario";
import { ICKModelo } from "../ICKModelo";
import { IUML } from "./IUML";


export interface IConocimiento extends ICKModelo {

	cml: ICML;
	uml: IUML;
	formularios: IFormulario[];

}
