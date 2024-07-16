import { IModelo, Modelo } from "../../../../../../mundos/modelo";
import { Formulario, IFormulario } from "../../nivel/formulario";
import { ICKModelo, CKModelo } from "../ck-modelo";
import { FormularioTM1 } from "./formulario-TM-01";

export interface ITarea extends ICKModelo {

    formularios: IFormulario[];

}

export class Tarea extends CKModelo implements ITarea {

    formularios: IFormulario[];

    constructor() {

        super();

        this.formularios = [
            new FormularioTM1(),
            new Formulario("TM-2"),
        ];
    }

}