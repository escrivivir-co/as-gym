import { IModelo } from "../../../../mundos/IModelo";


export interface IEstado {

	modelo: IModelo;

	comoModelo: () => IModelo;
	deModelo: (m: IModelo) => void;

}
