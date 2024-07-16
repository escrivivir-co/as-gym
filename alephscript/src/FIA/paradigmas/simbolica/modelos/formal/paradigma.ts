import { Subject } from "rxjs";
import { IMundo } from "../../../../mundos/mundo";
import { IModeloFormal } from "../../paradigma";
import { Conceptual } from "../conceptual/paradigma";
import { IMotorInferencia, MotorInferencia } from "./sistema/semantica/motor-inferencia";

export class Formal extends Conceptual implements IModeloFormal {

    eventos = new Subject<IMundo>();

    motor: IMotorInferencia = new MotorInferencia();

}