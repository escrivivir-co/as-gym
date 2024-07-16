import { Dominio, IDominio } from "../../../../../../mundos/dominio";
import { Modelo } from "../../../../../../mundos/modelo";
import { IInferencia } from "../../../../../simbolica/inferencia";
import { AS_COMMON_KADS_I18 } from "../../as-common-kads-i18";
import { IFormularioOTA1 } from "../../nivel/nivel-contextual";
import { ITarea } from "../tareas/tarea";

/**
 * Conceptual Modeling Language
 */
export interface IUML {

    modelar(f: IFormularioOTA1): IUMLModelo;
}

export interface IUMLModelo {

    dominio: IDominio;

    imprimir(): string;

    comoJSON(): Object;

}

export class UML implements IUML {

    constructor() {}

    modelar(f: IFormularioOTA1): IUMLModelo {

        const modelo = new Modelo();
        const dominio = new Dominio(modelo);

        dominio.base["Common.Kads.uml"] = {};

        return {
            dominio,
            imprimir: () => AS_COMMON_KADS_I18.COMMON_KADS.CK.FASES.CONCEPTUAL.UML,
            comoJSON: this.comoJSON
        }
    }

    comoJSON(): Object
    {
        return {
            uml: AS_COMMON_KADS_I18.COMMON_KADS.CK.FASES.CONCEPTUAL.UML
        }
    }

}