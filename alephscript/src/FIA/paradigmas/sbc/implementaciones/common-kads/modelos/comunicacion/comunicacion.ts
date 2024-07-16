import { IModelo } from "../../../../../../mundos/modelo";
import { Estudio } from "../../../../estudio";
import { IFormulario, Formulario } from "../../nivel/formulario";
import { ICKModelo, CKModelo } from "../ck-modelo";
import { IModeloConceptual } from "../conocimiento/modelo-conceptual";
import { IIntercambio } from "./intercambio";
import { IPlan } from "./plan";
import { ITransaccion } from "./transacciones";

export interface IComunicacion extends ICKModelo {

    planificar(mc: IModeloConceptual): IPlan;
    transacciones(mc: IModeloConceptual): ITransaccion[];
    intercambioInformacion(mc: IModeloConceptual): IIntercambio[];

}

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