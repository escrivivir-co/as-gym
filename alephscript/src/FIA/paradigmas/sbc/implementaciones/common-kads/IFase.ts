import { Subscription, Subject } from "rxjs";
import { IModelo } from "../../../../mundos/IModelo";
import { CKFases } from "./CKFases";
import { IEspecificacion } from "./IEspecificacion";
import { IEstadoT } from "./IEstadoT";
import { IAlternativa } from "./nivel/IAlternativa";
import { IObjetivo } from "./nivel/IObjetivo";
import { ISistema } from "./ISistema";


export interface IFase { 

	fase: CKFases;

	bookmark?: string;

	estado: IEstadoT<IModelo>;

	alternativas: IAlternativa[];

	objetivo: IObjetivo;

	especificacion: IEspecificacion;

	sistema: ISistema;

	imprimir(): string;

	llamada?: Subscription;

	solicitar?: Subject<IFase>;

	esperando?: boolean;
}
