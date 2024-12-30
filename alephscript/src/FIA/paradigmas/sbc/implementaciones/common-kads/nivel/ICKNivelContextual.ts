import { IModelo } from "../../../../../mundos/IModelo";
import { IAgente } from "../modelos/agentes/IAgente";
import { IOrganizacion } from "../modelos/organizacion/IOrganizacion";
import { ITarea } from "../modelos/tareas/ITarea";
import { IAlternativa } from "./IAlternativa";
import { IFormularioOTA1 } from "./IFormularioOTA1";
import { IObjetivo } from "./IObjetivo";
import { ICKNivel } from "./ICKNivel";
import { IRecurso } from "./IRecurso";


export interface ICKNivelContextual extends ICKNivel {

	organizacion: IOrganizacion;
	tareas: ITarea;
	agentes: IAgente;

	estudioViabilidad(m: IModelo): IAlternativa[];
	estudioImpactoYMejoras(a: IAlternativa[]): IObjetivo;

	recursos(): IRecurso[];
	conclusiones(m: IModelo): IFormularioOTA1;

}
