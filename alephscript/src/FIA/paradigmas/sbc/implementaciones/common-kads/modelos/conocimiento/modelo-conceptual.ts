import { IUMLModelo } from "./uml";

export interface IModeloConceptual  {

    uml: IUMLModelo;

    comoJSON(): object;

}