import { IFormulario } from "../../nivel/IFormulario";
import { ICKModelo } from "../ICKModelo";


export interface ITarea extends ICKModelo {

	formularios: IFormulario[];

}
