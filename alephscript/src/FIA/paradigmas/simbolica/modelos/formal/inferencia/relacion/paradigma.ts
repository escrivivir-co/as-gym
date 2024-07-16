import { IBaseConocimiento } from "../../../../../../mundos/base-conocimiento";
import { IDominio, Dominio } from "../../../../../../mundos/dominio";
import { Inferencia, IInferenciaRelacion, IInferencia } from "../../../../inferencia";
import { IGrafo } from '../../sistema/semantica/grafo';
import { TecnicasInferenciaRed } from "../../sistema/semantica/regla";

export interface ISolucion {}

export interface IProblema {

    predicado: IPredicado;
    dominio: IDominio;

}

export interface IPredicado {}

export interface IRequisitos  {
}

export class InferenciaRelacion
    extends Inferencia
    implements IInferenciaRelacion {

    claveDominio = "inferencias_relacion";

    dominio: IDominio = new Dominio({});
    tipo: TecnicasInferenciaRed;

    constructor() {
        super();
        this.dominio.base[this.claveDominio] = {};

    }

    configurar(g: IGrafo, parametros: IDominio): void {

        this.configurarV2([], TecnicasInferenciaRed.equiparacion, g, parametros);
    }

    configurarV2(entidades: IGrafo[], tipo: TecnicasInferenciaRed, raiz: IGrafo, parametros: IDominio): void {

        this.tipo = tipo;

        this.dominio.base[this.claveDominio][this.claveEntrada] = parametros;
        this.dominio.base[this.claveDominio][this.claveContexto] = {
            entidades,
            raiz
        };
    }

    activar(): { parametros: IBaseConocimiento, contexto: { entidades: IGrafo[], raiz: IGrafo } } {

        return {
            parametros: this.dominio.base[this.claveDominio][this.claveEntrada].base,
            contexto: this.dominio.base[this.claveDominio][this.claveContexto]
        }

    }

    async evaluar(): Promise<IInferencia> {
        return this;
    }

    imprimir(): string {
        return JSON.stringify(
            Object.keys(
                this.dominio.base[this.claveDominio][this.claveEntrada].base).join(" - "),
                null,
                "\t"
            );
    }
}