import { IConocimiento } from "../modelos/conocimiento/IConocimiento";
import { IModeloConceptual } from "../modelos/conocimiento/modelo-conceptual";
import { ICMLModelo } from "./ICMLModelo";


export interface ICKModeloConceptual extends IModeloConceptual {

	conocimiento: IConocimiento;
	cml: ICMLModelo;

}
