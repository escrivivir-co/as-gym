import { IDominio } from "../../../../../mundos/dominio";
import { IInferencia } from "../../../../simbolica/inferencia";
import { ITarea } from "../modelos/tareas/ITarea";


export interface ICMLModelo {

	dominio: IDominio;
	inferencias: IInferencia[];
	tareas: ITarea[];

	imprimir(): string;
}
