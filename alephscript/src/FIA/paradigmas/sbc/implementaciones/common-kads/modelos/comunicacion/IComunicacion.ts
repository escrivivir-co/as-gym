import { ICKModelo } from "../ICKModelo";
import { IModeloConceptual } from "../conocimiento/modelo-conceptual";
import { IIntercambio } from "./intercambio";
import { IPlan } from "./plan";
import { ITransaccion } from "./transacciones";


export interface IComunicacion extends ICKModelo {

	planificar(mc: IModeloConceptual): IPlan;
	transacciones(mc: IModeloConceptual): ITransaccion[];
	intercambioInformacion(mc: IModeloConceptual): IIntercambio[];

}
