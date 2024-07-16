import { IDominio, Dominio } from "../../../../../../mundos/dominio";
import { Estudio } from "../../../../estudio";
import { Formulario } from "../../nivel/formulario";

export class FormularioTM1 extends Formulario {

    dominio: IDominio = new Dominio({});

    constructor(public nombre: string = "AS_TM-01") {
        super();
    };

    rellenar(d: IDominio) {
        console.log("Ejecutando formulario", this.nombre);
    }

    imprimir(): string {

        const estado = (this.dominio
            .base[Estudio.claveDominio] || [])
            .map(m => m.nombre)
            .join(" - ");

        return `${this.nombre}:[${estado}]`
    }

}