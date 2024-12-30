import { Formulario } from "../../nivel/formulario";
import { IFormulario } from "../../nivel/IFormulario";
import { CKModelo } from "../ck-modelo";
import { FormularioAM1 } from "./formulario-AM-01";
import { IAgente } from "./IAgente";

export class Agente extends CKModelo implements IAgente {

    formularios: IFormulario[];

    constructor() {

        super();

        this.formularios = [
            new FormularioAM1(),
        ];
    }

}