import { IEspecificacion } from "../../IEspecificacion";
import { ICKModelo } from "../ICKModelo";
import { IAplicacion } from "./IAplicacion";
import { IArquitectura } from "./arquitectura";
import { IComponentes } from "./componentes";
import { IPlataforma } from "./plataforma";


export interface IDisenyo extends ICKModelo {
	comoJSON(): unknown;

	arquitectura(e: IEspecificacion): IArquitectura;
	plataforma(e: IEspecificacion): IPlataforma;
	componentes(e: IEspecificacion): IComponentes;
	aplicacion(e: IEspecificacion): IAplicacion;


}
