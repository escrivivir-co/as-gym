
import { CML, ICML } from "../../nivel/cml";
import { Formulario, IFormulario } from "../../nivel/formulario";
import { ICKModelo, CKModelo } from "../ck-modelo";
import { IUML, UML } from "./uml";

export interface IConocimiento extends ICKModelo {

    cml: ICML;
    uml: IUML;
    formularios: IFormulario[];

}

export class Conocimiento extends CKModelo implements IConocimiento {

    cml: ICML = new CML();
    uml: IUML = new UML();

    formularios: IFormulario[];

    constructor() {

        super();

        this.formularios = [
            new Formulario("KM-1")
        ];
    }

}