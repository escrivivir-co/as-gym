import { IFormulario } from "../nivel/IFormulario";


export interface ICKModelo {

	formularios: IFormulario[];
	imprimir(): string;
}
