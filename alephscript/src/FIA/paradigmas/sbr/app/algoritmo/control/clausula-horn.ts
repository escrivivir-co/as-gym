import { Axioma, Sustituciones } from "../logica/axioma";
import { Deducir } from "./axioma";

export interface ResolucionSLD extends Deducir {

    deducirSLD: (a: Axioma) => Sustituciones[];

}