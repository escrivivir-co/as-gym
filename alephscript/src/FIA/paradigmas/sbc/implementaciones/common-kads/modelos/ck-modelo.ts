import { IFormulario } from "../nivel/formulario";

export interface ICKModelo {

    formularios: IFormulario[];
    imprimir(): string;
}

export class CKModelo implements ICKModelo {

    formularios: IFormulario[];

    imprimir(): string {

        const estado = "\t\t -" + this.formularios
            .map(f => f.imprimir())
            .join("\n\t\t\t -");

        return `${estado}`;
    }
}