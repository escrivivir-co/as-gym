import { ICanalizacion, Canalizacion } from "./canalizacion";

export interface IClasificadorNumericoParametrizado {

    canalizacion: ICanalizacion;

}

export class ClasificadorNumericoParametrizado implements IClasificadorNumericoParametrizado {

    canalizacion = new Canalizacion();


}