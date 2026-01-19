/**
 * dTF - Terminal Función (predicado con argumentos)
 * 
 * @migrado-desde alephscript/src/FIA/paradigmas/logica/unificador/dTF.ts
 */

import { ITerminal, IFuncion, Tipo, Sustitucion } from '../types';
import { dT } from './dT';

export class dTF extends dT implements IFuncion {
    constructor(public v: string, public parametros: ITerminal[]) {
        super(v, Tipo.f);
    }

    contenida(t: ITerminal): boolean {
        if (this.tipo === Tipo.f) {
            return (
                this.parametros.find((p) =>
                    p.tipo === Tipo.f
                        ? (p as dTF).contenida(t)
                        : p.v === t.v
                ) != null
            );
        } else {
            return this.v === t.v;
        }
    }

    sustituir(s: Sustitucion[]): IFuncion {
        const sustitucion = new dTF(
            this.v,
            this.parametros.map((p) => {
                if (p.tipo === Tipo.V) {
                    const r = s.find((sub) => sub.V.v === p.v);
                    if (r) {
                        return r.c;
                    }
                } else if (p.tipo === Tipo.f) {
                    return p.sustituir(s);
                }
                return p;
            })
        );
        return sustitucion;
    }

    primerTerminalNoF(t: ITerminal[]): ITerminal {
        return t.find((p) => p.tipo !== Tipo.f)!;
    }
}
