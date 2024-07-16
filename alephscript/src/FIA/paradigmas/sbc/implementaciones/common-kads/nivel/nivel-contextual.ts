import { agentMessageCache } from "../../../../../agentMessage";
import { IDominio } from "../../../../../mundos/dominio";
import { IModelo, Modelo } from "../../../../../mundos/modelo";
import { Estudio } from "../../../estudio";
import { IAgente, Agente } from "../modelos/agentes/agente";
import { IOrganizacion, Organizacion } from "../modelos/organizacion/organizacion";
import { ITarea, Tarea } from "../modelos/tareas/tarea";
import { Formulario, IFormulario } from "./formulario";
import { ICKNivel } from "./nivel";
import { IValoracion } from "./nivel-conceptual";

export interface IFormularioOTA1 extends IFormulario {

}

export class FormularioOTA1 extends Formulario implements IFormularioOTA1, IValoracion {

    nombre = "OTA-1";
    dominio: IDominio;
    rellenar: (d: IDominio) => void;

    comoValoracion(): FormularioOTA1 {
        return this;
    }

}

export interface IObjetivo extends ICKNivelContextual {

    ota: IFormularioOTA1;
    conclusiones: (m: IModelo) => IFormularioOTA1;

}

export interface ICKNivelContextual extends ICKNivel {

    organizacion: IOrganizacion;
    tareas: ITarea;
    agentes: IAgente;

    estudioViabilidad(m: IModelo): IAlternativa[];
    estudioImpactoYMejoras(a: IAlternativa[]): IObjetivo;

    recursos(): IRecurso[];
    conclusiones(m: IModelo): IFormularioOTA1;

}

export class CKNivelContextual implements ICKNivelContextual {

    organizacion: IOrganizacion = new Organizacion();
    tareas: ITarea = new Tarea();
    agentes: IAgente = new Agente();

    formularios = () =>  {
        return [
            ...this.organizacion.formularios,
            ...this.tareas.formularios,
            ...this.agentes.formularios
        ]
    }
    ota: IFormularioOTA1;

    estudioViabilidad(m: IModelo): IAlternativa[] {

        console.log("/******************** EMPIEZA ESTUDIO DE VIABILIDAD **************************** */")
        // agentMessageCache(m);

        let estudio = new Estudio();
        estudio.modelo = m;

        this.organizacion
            .formularios
            .forEach(
                formulario => estudio.estudiar(formulario)
            );

        const alternativa = new Alternativa();
        alternativa.organizacion = this.organizacion;

        [
            ...this.tareas.formularios,
            ...this.agentes.formularios
        ]
        .forEach(
            formulario => estudio.estudiar(formulario)
        );

        return [alternativa];

    }

    estudioImpactoYMejoras(a: IAlternativa[]): IObjetivo {

        /******************** EMPIEZA ESTUDIO DE IMPACTO Y MEJORAS **************************** */
        let estudio = new Estudio();
        estudio.modelo = new Modelo();
        estudio
            .modelo
            .dominio
            .base = a.map(
                        alt => {
                            return {
                                alternativa: alt
                                    .organizacion
                                    .formularios
                                    .map(f => f.dominio)
                                }
                            }
                        );
        return {
            ...this,
            conclusiones: this.conclusiones,
            comoJSON: this.comoJSON
        }

    }

    recursos(): IRecurso[] {

        return this.organizacion
            .formularios
            .map(f => f.dominio.base['common-kads.recursos'] as IRecurso);

    }

    conclusiones(m: IModelo): IFormularioOTA1 {

        console.log("/******************** GENERAR OTA1 **************************** */ \n");


        const estudio = new Estudio();
        const ota = new FormularioOTA1();

        estudio.modelo = m;
        estudio.estudiar(ota);

        this.formularios()
            .reduce((ota: IFormulario, f: IFormulario) => {
                estudio.estudiar(f);
                f.rellenar(m.dominio);
                console.log("\ t - " + f.nombre);
                ota.dominio.base[Estudio.claveDominio].push(f);
                return ota;
            }, ota);

        this.ota = ota;

        console.log("-----------------------------")
        console.log("OTA GENERATED", ota.dominio.base[Estudio.claveDominio])
        console.log("-----------------------------")
        return this.ota;

    }

    comoJSON(): {
        organizacion: any,
        tareas:  any,
        agentes:  any,
        recursos:  any,
        conclusiones:  any
    } {

        return {
            organizacion: this.organizacion.imprimir(),
            tareas: this.tareas.imprimir(),
            agentes: this.agentes.imprimir(),
            recursos: this.recursos?.name,
            conclusiones: this.conclusiones
        }
    }
}

export interface IRecurso {
    nombre?: string;
}

export interface IAlternativa extends ICKNivelContextual {

}

export class Alternativa extends CKNivelContextual implements IAlternativa {

    nombre = "alternativa";

}
