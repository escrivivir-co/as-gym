import { IModelo } from "../../../../../../mundos/IModelo";
import { IEstadoT } from "../../../../../situada/IEstadoT";




export interface IAplicacion {
	comoJSON(): unknown;

	nombre: string;
	iniciar(estado: IEstadoT<IModelo>): Promise<IEstadoT<IModelo>>;

}
