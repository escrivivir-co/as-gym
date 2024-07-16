import { Formulario } from "../../nivel/formulario";
import { ICKModelo, CKModelo } from "../ck-modelo";
import { FormularioOM1 } from "./formulario-OM-01";


export interface IOrganizacion extends ICKModelo {


}

export class Organizacion extends CKModelo implements IOrganizacion {

    constructor() {

        super();

        this.formularios = [
            new FormularioOM1(),
            new Formulario("OM-2"),
            new Formulario("OM-3"),
            new Formulario("OM-4"),
            new Formulario("OM-5"),
        ];
    }



}