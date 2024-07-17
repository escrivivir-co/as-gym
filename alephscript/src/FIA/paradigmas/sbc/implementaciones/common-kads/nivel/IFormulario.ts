import { IDominio } from "../../../../../mundos/dominio";


export interface IFormulario {

	nombre: string;

	dominio: IDominio;
	rellenar: (d: IDominio) => void;

	imprimir(): string;

}
