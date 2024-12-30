
import { CML } from "../../nivel/cml";
import { ICML } from "../../nivel/ICML";
import { Formulario } from "../../nivel/formulario";
import { IFormulario } from "../../nivel/IFormulario";
import { CKModelo } from "../ck-modelo";
import { UML } from "./uml";
import { IUML } from "./IUML";
import { IConocimiento } from "./IConocimiento";

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