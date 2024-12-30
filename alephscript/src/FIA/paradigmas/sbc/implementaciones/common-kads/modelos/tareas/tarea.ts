import { Modelo } from "../../../../../../mundos/modelo";
import { IModelo } from "../../../../../../mundos/IModelo";
import { Formulario } from "../../nivel/formulario";
import { IFormulario } from "../../nivel/IFormulario";
import { CKModelo } from "../ck-modelo";
import { FormularioTM1 } from "./formulario-TM-01";
import { ITarea } from "./ITarea";

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