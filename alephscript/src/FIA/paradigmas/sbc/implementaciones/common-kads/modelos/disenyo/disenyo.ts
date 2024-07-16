import { IModelo, Modelo } from "../../../../../../mundos/modelo";
import { Estudio } from "../../../../estudio";
import { IEspecificacion } from "../../common-kads";
import { Formulario, IFormulario } from "../../nivel/formulario";
import { ICKModelo, CKModelo } from "../ck-modelo";
import { IAplicacion, Aplicacion } from "./aplicacion";
import { IArquitectura } from "./arquitectura";
import { IComponentes } from "./componentes";
import { IPlataforma } from "./plataforma";

export interface IDisenyo extends ICKModelo {
    comoJSON(): unknown;

    arquitectura(e: IEspecificacion): IArquitectura;
    plataforma(e: IEspecificacion): IPlataforma;
    componentes(e: IEspecificacion): IComponentes;
    aplicacion(e: IEspecificacion): IAplicacion;


}

export class Disenyo extends CKModelo implements IDisenyo {

    formularios: IFormulario[];

    constructor() {

        super();

        this.formularios = [
            new Formulario("DM-1"),
            new Formulario("DM-2"),
            new Formulario("DM-3"),
            new Formulario("DM-4"),
        ];
    }

    comoJSON(): unknown {
        return this.formularios.map(f => f.nombre);
    }

    arquitectura(e: IEspecificacion): IArquitectura {
        let estudio = new Estudio();
        estudio.modelo = e as unknown as IModelo;

        this.formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return this;
    }

    plataforma(e: IEspecificacion): IPlataforma {
        let estudio = new Estudio();
        estudio.modelo = e as unknown as IModelo;

        this.formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return this;
    }

    componentes(e: IEspecificacion): IComponentes {

        let estudio = new Estudio();
        estudio.modelo = e as unknown as IModelo;

        this.formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        return this;
    }

    aplicacion(e: IEspecificacion): IAplicacion {

        let estudio = new Estudio();
        estudio.modelo = e as unknown as IModelo;

        this.formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        const a = new Aplicacion();
        return a;

    }

}