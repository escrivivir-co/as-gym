import { Dominio } from "../../../../../../mundos/dominio";
import { Modelo } from "../../../../../../mundos/modelo";
import { AS_COMMON_KADS_I18 } from "../../as-common-kads-i18";
import { IFormularioOTA1 } from "../../nivel/IFormularioOTA1";
import { IUML } from "./IUML";
import { IUMLModelo } from "./IUMLModelo";

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