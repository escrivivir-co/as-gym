import { IAplicacion } from "./modelos/disenyo/IAplicacion";
import { IArquitectura } from "./modelos/disenyo/arquitectura";
import { IComponentes } from "./modelos/disenyo/componentes";
import { IDisenyo } from "./modelos/disenyo/IDisenyo";
import { IPlataforma } from "./modelos/disenyo/plataforma";

export interface ISistema {

	comoJSON(): object;

	disenyo: IDisenyo;

	arquitectura: IArquitectura;
	plataforma: IPlataforma;
	componentes: IComponentes;
	aplicacion: IAplicacion;

}
