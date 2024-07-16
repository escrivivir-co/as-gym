import { IBaseConocimiento } from "../../../../mundos/base-conocimiento";
import { IModeloConceptual } from "../../paradigma";


export class Conceptual implements IModeloConceptual {

    nombre: string;

    base: IBaseConocimiento;

}