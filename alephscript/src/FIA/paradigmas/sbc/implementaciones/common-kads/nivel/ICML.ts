import { ICMLModelo } from "./ICMLModelo";
import { IFormularioOTA1 } from "./IFormularioOTA1";

/**
 * Conceptual Modeling Language
 */

export interface ICML {

	modelar(f: IFormularioOTA1): ICMLModelo;

}
