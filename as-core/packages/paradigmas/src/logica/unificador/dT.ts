/**
 * dT - Terminal simple (constante o variable)
 * 
 * @migrado-desde alephscript/src/FIA/paradigmas/logica/unificador/dT.ts
 */

import { ITerminal, IFuncion, Tipo, Sustitucion } from '../types';

export class dT implements ITerminal {
    nombre = "Terminal";

    constructor(public v: string, public tipo: Tipo) {}

    imprimir(): string {
        if (this.tipo === Tipo.f) {
            const f = this as unknown as IFuncion;
            return `${f.v}(${f.parametros.map(p => p.imprimir()).join(", ")})`;
        } else {
            return this.v;
        }
    }

    comparar(SB: ITerminal): boolean {
        if (this.v !== SB?.v) {
            return false;
        }

        if (this.tipo !== SB.tipo) {
            return true;
        }

        if (this.tipo === Tipo.f) {
            const fA = this as unknown as IFuncion;
            const fB = SB as unknown as IFuncion;

            return (
                fA.parametros.length === fB.parametros.length &&
                fA.parametros.filter(
                    (a, index) => !a.comparar(fB.parametros[index])
                ).length === 0
            );
        }

        return true;
    }

    sustituir(s: Sustitucion[]): ITerminal {
        return this;
    }
}
