import { IModelo } from "../../../../../mundos/IModelo";
import { ICKNivelContextual } from "./ICKNivelContextual";
import { IFormularioOTA1 } from "./IFormularioOTA1";


export interface IObjetivo extends ICKNivelContextual {

	ota: IFormularioOTA1;
	conclusiones: (m: IModelo) => IFormularioOTA1;

}
