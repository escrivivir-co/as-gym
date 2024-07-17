import { Comunicacion } from "../modelos/comunicacion/comunicacion";
import { IComunicacion } from "../modelos/comunicacion/IComunicacion";
import { Conocimiento } from "../modelos/conocimiento/conocimiento";
import { IConocimiento } from "../modelos/conocimiento/IConocimiento";
import { IModeloConceptual } from "../modelos/conocimiento/modelo-conceptual";
import { IFormulario } from "./IFormulario";
import { IFormularioOTA1 } from "./IFormularioOTA1";
import { IModeloComunicaciones } from "../modelos/comunicacion/modelo-comunicaciones";
import { Estudio } from "../../../estudio";
import { ICKModeloConceptual } from "./ICKModeloConceptual";
import { ICKNivelConceptual } from "./ICKNivelConceptual";
import { IValoracion } from "./IValoracion";

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

export class Valoracion implements IValoracion {}