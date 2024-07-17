import { IFormulario } from "./IFormulario";


export interface ICKNivel {

	formularios: () => IFormulario[];

	comoJSON(): object;

}
