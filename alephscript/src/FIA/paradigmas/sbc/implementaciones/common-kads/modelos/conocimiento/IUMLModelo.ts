import { IDominio } from "../../../../../../mundos/dominio";


export interface IUMLModelo {

	dominio: IDominio;

	imprimir(): string;

	comoJSON(): Object;

}
