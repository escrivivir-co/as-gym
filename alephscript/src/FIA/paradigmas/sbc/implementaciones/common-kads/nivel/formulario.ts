import { Dominio, IDominio } from "../../../../../mundos/dominio";
import { Estudio } from "../../../estudio";

export const FORM_KEY = "FORM_KEY";

export interface IFormulario {

    nombre: string;

    dominio: IDominio;
    rellenar: (d: IDominio) => void;

    imprimir(): string;

}

export class Formulario implements IFormulario {

    dominio: IDominio = new Dominio({});

    constructor(public nombre: string = "F-01") {
        this.dominio.base[FORM_KEY] = {};
    };

    rellenar(d: IDominio) {
    }

    imprimir(): string {

        const estado = (this.dominio
            .base[Estudio.claveDominio] || [])
            .map(m => m.nombre)
            .join(" - ");

        return `${this.nombre}:[${estado}]`
    }

}