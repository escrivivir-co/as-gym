import { Axioma, Sustituciones } from "../logica/axioma";

export interface Deducir {

    axioma: Axioma;
    deducir: (a: Axioma) => Sustituciones[];

}