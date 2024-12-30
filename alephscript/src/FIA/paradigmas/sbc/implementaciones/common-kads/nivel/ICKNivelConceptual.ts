import { IComunicacion } from "../modelos/comunicacion/IComunicacion";
import { IModeloComunicaciones } from "../modelos/comunicacion/modelo-comunicaciones";
import { IConocimiento } from "../modelos/conocimiento/IConocimiento";
import { ICKModeloConceptual } from "./ICKModeloConceptual";
import { IFormularioOTA1 } from "./IFormularioOTA1";
import { ICKNivel } from "./ICKNivel";


export interface ICKNivelConceptual extends ICKNivel {

	conocimiento: IConocimiento;
	comunicacion: IComunicacion;

	modeloConocimiento(ota1: IFormularioOTA1): ICKModeloConceptual;
	modeloComunicaciones(mc: ICKModeloConceptual): IModeloComunicaciones;

}
