import { ITerminal, S, Tipo } from "./unificacion-general";
import { dTF, IFuncion } from "./dTF";


export class dT implements ITerminal {

    nombre = "Terminal"
    constructor(public v: string, public tipo: Tipo) {
    }

    imprimir(): string {

        if (this.tipo === Tipo.f) {

            const f = this as unknown as IFuncion;
            return `${f.v}(${f.parametros.map(p => p.imprimir()).join(", ")})`;

        } else {
            // console.log("imprimir_test", this)
            return this.v;
        }

    };

    comparar(SB: ITerminal): boolean {

        // console.log(`\t - Comparar A: ${this.imprimir()} con B: ${SB?.imprimir()}`)
        // console.log(`\t - Comparar A: ${this.v} con B: ${SB?.v}`)
        if (this.v != SB?.v) {
            return false;
        }

        if (this.tipo != SB.tipo) {
            return true;
        }

        if (this.tipo == Tipo.f) {

            const fA = this as unknown as dTF
            const fB = SB as unknown as dTF

            // console.log(`\t\t - Encontradas funciones, num params, A: ${fA.parametros.length} con B: ${fB.parametros.length}`)
            return fA.parametros.length == fB.parametros.length &&
                fA.parametros.filter(
                    (a, index) => !a.comparar(fB.parametros[index])
                ).length  == 0
        }

        return true;

    }

    sustituir(s: S[]): ITerminal {
        return this;
    }
}
