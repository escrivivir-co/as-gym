import { IUMLModelo } from "./IUMLModelo";

export interface IModeloConceptual  {

    uml: IUMLModelo;

    comoJSON(): object;

}