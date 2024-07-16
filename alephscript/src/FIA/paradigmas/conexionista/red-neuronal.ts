import { IBaseConocimiento } from "../../mundos/base-conocimiento";
import { Formal } from "../simbolica/modelos/formal/paradigma";
import { IClasificadorNumericoParametrizado, ClasificadorNumericoParametrizado } from "./clasificador";

export interface IRedNeuronalArtificial extends IBaseConocimiento  {

    clasificador: IClasificadorNumericoParametrizado;

}

export class RedNeuronalArtificial extends Formal implements IRedNeuronalArtificial {

    clasificador = new ClasificadorNumericoParametrizado();

}