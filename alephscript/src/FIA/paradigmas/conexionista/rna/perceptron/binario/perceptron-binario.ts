import { ILaya } from "../../red-clasificacion";
import { Perceptron } from "../perceptron";

export interface IPerceptronBinario extends Perceptron {

    clases: ILaya[];
}


export class PerceptronBinario extends Perceptron implements IPerceptronBinario {

    clases = [
        {
            valor: 1
        },
        {
            valor: -1
        }
    ];

}