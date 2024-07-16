import { IEstrategiaControl, IModeloComputacional } from "../../paradigma";
import { Formal } from "../formal/paradigma";

export class Computable extends Formal implements IModeloComputacional {
    control: IEstrategiaControl;

}