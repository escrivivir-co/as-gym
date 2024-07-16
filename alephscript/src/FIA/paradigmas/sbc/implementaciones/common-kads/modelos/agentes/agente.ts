import { Formulario, IFormulario } from "../../nivel/formulario";
import { CKModelo, ICKModelo } from "../ck-modelo";
import { FormularioAM1 } from "./formulario-AM-01";

export interface IAgente extends ICKModelo {}

export class Agente extends CKModelo implements IAgente {

    formularios: IFormulario[];

    constructor() {

        super();

        this.formularios = [
            new FormularioAM1(),
        ];
    }

}