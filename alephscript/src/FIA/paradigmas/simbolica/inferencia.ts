import { IBaseConocimiento } from "../../mundos/base-conocimiento";
import { IDominio, Dominio } from "../../mundos/dominio";

export interface IInferencia {

    claveDominio: string;

    claveContexto: string;

    claveEntrada: string;
    claveSalida: string;

    dominio: IDominio;

    configurar(b: IBaseConocimiento, parametros: IDominio): void;

    evaluar: () => Promise<IInferencia>;
}

export interface IInferenciaConcepto extends IInferencia {};

export interface IInferenciaRelacion extends IInferencia {};

export interface IInferenciaAccion extends IInferencia {};

export class Inferencia implements IInferencia {

    dominio: IDominio = new Dominio({});

    claveDominio = "inferencias";
    claveContexto = "contexto";
    claveEntrada = "parametros";
    claveSalida = "evaluacion";

    configurar(b: IBaseConocimiento, d: IDominio): void {
        this.dominio = d;
    }

    async evaluar(): Promise<IInferencia> {
        return this;
    }

    imprimir() {
        return " \n export class Inferencia implements IInferencia: \n" + JSON.stringify(this) + "\n";
    }

}