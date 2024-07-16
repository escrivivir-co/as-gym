import { Observable, Subject } from "rxjs";
import { IInferencia } from "../../../../inferencia";

export interface IMotorInferencia {

    evento: Subject<IInferencia>;
    eventos: Observable<IInferencia>;

    reglas: IInferencia[]

    arrancar(log: (string) => void): void;
    trasDetenerse(log: (string) => void): void
}

export class MotorInferencia implements IMotorInferencia {

    evento = new Subject<IInferencia>();

    eventos: Observable<IInferencia>;

    reglas: IInferencia[] = []

    constructor() {

        this.eventos = this.evento.asObservable();
    }

    async arrancar(log: (string) => void): Promise<void> {

        return new Promise(async (resolve, reject) => {

            // console.log("motor.arrancar, reglas: ", this.reglas.length);

            await Promise.all(this.reglas.map(async regla => {

                // console.log("\t motor.arrancar, ejecutando: ", regla.claveDominio);
                const inferencia = await regla.evaluar();

                log(inferencia?.dominio[inferencia?.claveSalida]);

                this.evento.next(inferencia);

            }))
            for(const r of this.reglas) this.reglas.pop();

            resolve();
            this.suscriptores.forEach(s => s())
            this.suscriptores = [];

        });
    }

    suscriptores = [];
    trasDetenerse(log: (string: any) => void): void {

        this.suscriptores.push(log);
    }

}