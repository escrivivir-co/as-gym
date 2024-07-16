import { IMotorInferencia, MotorInferencia } from '../../formal/sistema/semantica/motor-inferencia';
import { IInferenciaMarcoEquiparacion, IInferenciaMarcoHerencia, IInferenciaMarcoDemonio } from './inferencia';
import { IMarcoClase } from './marco-clase';
import { IMarcoInstancia } from './marco-instancia';
import { IMarco } from './marcos';

export interface IMotorInferenciaMarco extends IMotorInferencia {

    reglas: (IInferenciaMarcoEquiparacion | IInferenciaMarcoHerencia | IInferenciaMarcoDemonio)[]
}

export class MotorInferenciaMarco extends MotorInferencia implements IMotorInferenciaMarco {

}


function esRelacionFraternal(padreA: IMarco, padreB: IMarco): boolean {
    return padreA == padreB;
}

function esRelacionDijunta(claseA: IMarcoClase, claseB: IMarcoClase, 
    instanciasA: IMarcoInstancia[], instanciasB: IMarcoInstancia[]): boolean {
    return instanciasA
        .filter(ia => instanciasB.findIndex(ib => ia == ib) == -1).length == 0;
}

function esRelacionAdHoc(a: IMarco, b: IMarco): boolean {
    return true;
}