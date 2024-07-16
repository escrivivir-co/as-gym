import { agentMessage } from "../../../agentMessage";
import { dTF, IFuncion } from "./dTF";

export const enum Tipo {
    V = "VARIABLE",
    c = "constante",
    f = "funcion"
}

export interface ITerminal {

    v: string;
    tipo: Tipo;

    imprimir?: () => string;
    comparar?(SB: ITerminal): boolean;
    sustituir(s: S[]): ITerminal;
}

export type S = { V: ITerminal, c: ITerminal };

export class UnificadorGeneral {

    nombre = "Unificador";

    unificar(a: IFuncion, b: IFuncion): {
        unificable: boolean, umg: S[]
    } {

        /* console.log(
            agentMessage(
                "Unificador",
                "Unificando A y B: " + a.imprimir() + ", " + b.imprimir()
            )
        )*/

        /*
        PRE-CONDICION
        */
        if (a.v != b.v) {
            return { unificable: false, umg: [] }
        }

        // unificador de máxima generalidad
        let umg: S[] = [];

        let SA = a;
        let SB = b;

        let indice = 0;

        while(!SA.comparar(SB)) {

            /*console.log(agentMessage(this.nombre, 
                "Paso: " + indice++), 
                SA.parametros.map(p => p.imprimir()),
                SB.parametros.map(p => p.imprimir()),
                "estado S", umg.length)*/

            const primero = SA.parametros
                .findIndex((sa, index) => !sa.comparar(SB.parametros[index]))

            if (primero == -1) {
                break;
            }

            const u1 = SA.parametros[primero]
            const u2 = SB.parametros[primero]

            const almenosUnaVariable = u1.tipo == Tipo.V || u2.tipo == Tipo.V;
            const ambasFunciones = u1.tipo == Tipo.f && u2.tipo == Tipo.f;

            if (!almenosUnaVariable) {
                if (ambasFunciones) {
                    const funi = this.unificar(u1 as IFuncion, u2 as IFuncion)
                    // console.log("\t\t - Unificada func", funi)
                    if (funi.unificable) {
                        funi.umg.forEach(u => umg.push(u))

                        SA = SA.sustituir(umg);
                        SB = SB.sustituir(umg);

                        continue
                    } else {
                        // console.log("\t\t - No unificable, funciones diferentes", indice, "u1/u2", u1.imprimir(), u2.imprimir())
                        break;
                    }
                } else {
                    // console.log("\t\t - No unificable, no variables, índice", indice, "u1/u2", u1.imprimir(), u2.imprimir())
                    break; // No unificable
                }
            }

            const contenida = this.contenida(u2, u1) || this.contenida(u1, u2)
            if (contenida) {
                console.log("\t\t - No unificable, contenida, índice", indice, u1, u2)
                break; // No unificable
            }

            // console.log("\t\t - , índice", indice, "Identificados u1/u2", u1.imprimir(), u2.imprimir())
            umg.push({
                V: u1.tipo == Tipo.V ? u1 : u2,
                c: u1.tipo == Tipo.V ? u2 : u1,
            })

            SA = SA.sustituir(umg);
            SB = SB.sustituir(umg);

            if (indice > 3) break

        }

        /*console.log(agentMessage(this.nombre, 
            "Pasos totales: " + indice), 
            SA.parametros.map(p => p.imprimir()),
            SB.parametros.map(p => p.imprimir()),
            "estado S", umg.length)*/
        return { unificable: SA.comparar(SB), umg }
    }

    contenida(u1: ITerminal, u2: ITerminal) {

        if (u2.tipo != Tipo.f) {
            return false;
        }

        const dtf = u2 as dTF;

        return dtf.contenida(u1)
    }

}