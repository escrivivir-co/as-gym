import { IComunicacion, Comunicacion } from "../modelos/comunicacion/comunicacion";
import { IConocimiento, Conocimiento } from "../modelos/conocimiento/conocimiento";
import { IModeloConceptual } from "../modelos/conocimiento/modelo-conceptual";
import { IFormulario } from "./formulario";
import { ICMLModelo } from "./cml";
import { ICKNivel } from "./nivel";
import { IFormularioOTA1 } from "./nivel-contextual";
import { IModeloComunicaciones } from "../modelos/comunicacion/modelo-comunicaciones";
import { Estudio } from "../../../estudio";

export interface ICKModeloConceptual extends IModeloConceptual {

    conocimiento: IConocimiento;
    cml: ICMLModelo;

}

export interface ICKNivelConceptual extends ICKNivel {

    conocimiento: IConocimiento;
    comunicacion: IComunicacion;

    modeloConocimiento(ota1: IFormularioOTA1): ICKModeloConceptual;
    modeloComunicaciones(mc: ICKModeloConceptual): IModeloComunicaciones;

}

export class CKNivelConceptual implements ICKNivelConceptual {

    conocimiento: IConocimiento = new Conocimiento();
    comunicacion: IComunicacion = new Comunicacion();

    formularios(): IFormulario[] {
        return [
            ...this.conocimiento.formularios,
            ...this.comunicacion.formularios
        ]
    }

    modeloConocimiento(ota1: IFormularioOTA1): ICKModeloConceptual {

        let estudio = new Estudio();
        estudio.modelo.dominio.base = {
            uml: this.conocimiento.uml.modelar(ota1),
            cml: this.conocimiento.cml.modelar(ota1)
        };

        this.conocimiento
            .formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return {
            conocimiento: this.conocimiento,
            ...estudio.modelo.dominio.base,
            comoJSON: () => {
                return {
                    conocimiento: this.conocimiento.imprimir()
                }
            }
        }  as ICKModeloConceptual

    }

    modeloComunicaciones(mc: IModeloConceptual): IModeloComunicaciones {

        let estudio = new Estudio();
        estudio.modelo.dominio.base = {
            plan: this.comunicacion.planificar(mc),
            transacciones: this.comunicacion.transacciones(mc),
            intercambio: this.comunicacion.intercambioInformacion(mc)
        };

        this.comunicacion
            .formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return {
            comunicacion: this.comunicacion,
            ...estudio.modelo.dominio.base,
            comoJSON: () => {
                return {
                    comunicacion: this.comunicacion.imprimir()
                }
            }
        } as IModeloComunicaciones

    }

    comoJSON(): any {

        return {
            conocimiento: this.conocimiento.imprimir(),
            comunicacion: this.comunicacion.imprimir(),
        }
    }

}

export interface IValoracion {}

export class Valoracion implements IValoracion {}