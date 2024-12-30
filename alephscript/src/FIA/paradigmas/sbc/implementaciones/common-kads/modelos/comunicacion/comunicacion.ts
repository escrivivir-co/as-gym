import { IModelo } from "../../../../../../mundos/IModelo";
import { Estudio } from "../../../../estudio";
import { Formulario } from "../../nivel/formulario";
import { IFormulario } from "../../nivel/IFormulario";
import { CKModelo } from "../ck-modelo";
import { IModeloConceptual } from "../conocimiento/modelo-conceptual";
import { IComunicacion } from "./IComunicacion";
import { IIntercambio } from "./intercambio";
import { IPlan } from "./plan";
import { ITransaccion } from "./transacciones";

export class Comunicacion extends CKModelo implements IComunicacion {

    formularios: IFormulario[];

    constructor() {

        super();

        this.formularios = [
            new Formulario("CM-1"),
            new Formulario("CM-2")
        ];
    }

    planificar(mc: IModeloConceptual): IPlan {

        let estudio = new Estudio();
        estudio.modelo = mc as unknown as IModelo;

        this.formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return this;

    }

    transacciones(mc: IModeloConceptual): ITransaccion[] {

        let estudio = new Estudio();
        estudio.modelo = mc as unknown as IModelo;

        this.formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return [this];

    }

    intercambioInformacion(mc: IModeloConceptual): IIntercambio[] {

        let estudio = new Estudio();
        estudio.modelo = mc as unknown as IModelo;

        this.formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return [this];

    }

}