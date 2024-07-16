import { dT } from "./dT";
import { ITerminal, S, Tipo } from "./unificacion-general";

export interface IFuncion extends ITerminal {

    parametros: ITerminal[];
    primerTerminalNoF(t: ITerminal[]): ITerminal;
    sustituir(s: S[]): IFuncion;

}

export class dTF extends dT implements IFuncion {

    constructor(public v: string, public parametros: ITerminal[]) {
        super(v, Tipo.f);
    }

    contenida(t: ITerminal) {

        if (this.tipo === Tipo.f) {
            return this.parametros.find(p => p.tipo == Tipo.f ? (p as dTF).contenida(t) : p.v == t.v) != null;

        } else {
            return this.v == t.v;
        }

    };

    sustituir(s: S[]): IFuncion {
        const sustitucion = new dTF(this.v,
            this.parametros.map(p => {
                if (p.tipo == Tipo.V) {
                    const r = s.find(s => s.V.v == p.v)
                    if (r) {
                        return r.c
                    }
                } else if (p.tipo == Tipo.f) {
                    return p.sustituir(s)
                }
                return p;
            })
        );
        return sustitucion;
    }

    primerTerminalNoF(t: ITerminal[]): ITerminal {

        return t.find(p => p.tipo != Tipo.f);

    }

}
