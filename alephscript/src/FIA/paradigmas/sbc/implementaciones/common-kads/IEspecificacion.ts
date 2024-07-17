import { IModeloComunicaciones } from "./modelos/comunicacion/modelo-comunicaciones";
import { ICKModeloConceptual } from "./nivel/ICKModeloConceptual";


export interface IEspecificacion {

	conceptual: ICKModeloConceptual;
	comunicacion: IModeloComunicaciones;

	comoJSON: () => Object;

}
