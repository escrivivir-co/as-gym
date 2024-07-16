import { IDisenyo, Disenyo } from "../modelos/disenyo/disenyo";
import { IFormulario } from "./formulario";
import { IEspecificacion } from "../common-kads";
import { ISistema } from "../sistema";
import { ICKNivel } from "./nivel";
import { map } from 'rxjs/operators';


export interface ICKNivelArtefactual extends ICKNivel {

    disenyo: IDisenyo;

    sistema: (e: IEspecificacion) => ISistema;

}

export class CKNivelArtefactual implements ICKNivelArtefactual {

    arquitectura: () => void;
    plataforma: () => void;
    componentes: () => void;
    aplicacion: () => void;

    disenyo: IDisenyo = new Disenyo();

    formularios(): IFormulario[] {
        return [
            ...this.disenyo.formularios
        ]
    }

    sistema(e: IEspecificacion): ISistema {

        return {
            disenyo: this.disenyo,
            arquitectura: this.disenyo.arquitectura(e),
            plataforma: this.disenyo.plataforma(e),
            componentes: this.disenyo.componentes(e),
            aplicacion: this.disenyo.aplicacion(e),
            comoJSON: () => {
                return {
                    disenyo: this.disenyo.comoJSON(),
                    arquitectura: this.disenyo.arquitectura(e).comoJSON(),
                    plataforma: this.disenyo.plataforma(e).comoJSON(),
                    componentes: this.disenyo.componentes(e).comoJSON(),
                    aplicacion: this.disenyo.aplicacion(e).comoJSON(),
                }
            }
        }

    }

    comoJSON(): any {

        return {
            disenyo: this.disenyo.imprimir(),
            sistema: this.formularios().map(f => f.imprimir())
        }
    }

}