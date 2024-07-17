import { IFormularioOTA1 } from "../../nivel/IFormularioOTA1";
import { IUMLModelo } from "./IUMLModelo";

/**
 * Conceptual Modeling Language
 */

export interface IUML {

	modelar(f: IFormularioOTA1): IUMLModelo;
}
