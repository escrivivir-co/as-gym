import { IFormulario } from "../nivel/IFormulario";
import { ICKModelo } from "./ICKModelo";

export class CKModelo implements ICKModelo {

    formularios: IFormulario[];

    imprimir(): string {

        const estado = "\t\t -" + this.formularios
            .map(f => f.imprimir())
            .join("\n\t\t\t -");

        return `${estado}`;
    }
}