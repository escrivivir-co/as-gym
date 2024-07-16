import { IModelo, Modelo } from "../../mundos/modelo";
import { IFormulario } from "./implementaciones/common-kads/nivel/formulario";

export interface IEstudio {

    claveDominio: string;
    modelo: IModelo;
    estudiar: (f: IFormulario) => IEstudio;
}

export class Estudio implements IEstudio {

    static claveDominio = "sbc.estudio";

    claveDominio = Estudio.claveDominio;

    modelo = new Modelo();

    estudiar(f: IFormulario): IEstudio {

        // const domain = this.modelo.dominio.base[EXTERNAL_CACHE].domain['Model']['rows'];

        // console.log("Estudiar formulario", f.nombre)
        if (!Array.isArray(f.dominio.base[this.claveDominio])) {
            f.dominio.base[this.claveDominio] = [];
        }

        f.dominio.base[this.claveDominio].push(this.modelo);

        return this;
    }

}