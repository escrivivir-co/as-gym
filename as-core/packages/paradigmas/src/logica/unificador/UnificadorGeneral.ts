/**
 * UnificadorGeneral - Algoritmo de unificación de Robinson
 * 
 * Implementa el Unificador de Máxima Generalidad (UMG)
 * para términos de lógica de primer orden.
 * 
 * @migrado-desde alephscript/src/FIA/paradigmas/logica/unificador/unificacion-general.ts
 */

import { ITerminal, IFuncion, Tipo, Sustitucion, ResultadoUnificacion } from '../types';
import { dTF } from './dTF';

export class UnificadorGeneral {
    nombre = "Unificador";

    /**
     * Unifica dos funciones y retorna el UMG si existe
     */
    unificar(a: IFuncion, b: IFuncion): ResultadoUnificacion {
        // PRE-CONDICION: mismo nombre de función
        if (a.v !== b.v) {
            return { unificable: false, umg: [] };
        }

        let umg: Sustitucion[] = [];
        let SA = a;
        let SB = b;
        let indice = 0;

        while (!SA.comparar(SB)) {
            const primero = SA.parametros.findIndex(
                (sa, index) => !sa.comparar(SB.parametros[index])
            );

            if (primero === -1) {
                break;
            }

            const u1 = SA.parametros[primero];
            const u2 = SB.parametros[primero];

            const almenosUnaVariable = u1.tipo === Tipo.V || u2.tipo === Tipo.V;
            const ambasFunciones = u1.tipo === Tipo.f && u2.tipo === Tipo.f;

            if (!almenosUnaVariable) {
                if (ambasFunciones) {
                    const funi = this.unificar(u1 as IFuncion, u2 as IFuncion);
                    if (funi.unificable) {
                        funi.umg.forEach((u) => umg.push(u));
                        SA = SA.sustituir(umg);
                        SB = SB.sustituir(umg);
                        continue;
                    } else {
                        break;
                    }
                } else {
                    break; // No unificable
                }
            }

            const contenida =
                this.contenida(u2, u1) || this.contenida(u1, u2);
            if (contenida) {
                break; // No unificable (occur check)
            }

            // Añadir sustitución al UMG
            umg.push({
                V: u1.tipo === Tipo.V ? u1 : u2,
                c: u1.tipo === Tipo.V ? u2 : u1,
            });

            SA = SA.sustituir(umg);
            SB = SB.sustituir(umg);

            if (indice++ > 3) break;
        }

        return { unificable: SA.comparar(SB), umg };
    }

    /**
     * Verifica si u1 está contenida en u2 (occur check)
     */
    private contenida(u1: ITerminal, u2: ITerminal): boolean {
        if (u2.tipo !== Tipo.f) {
            return false;
        }
        const dtf = u2 as dTF;
        return dtf.contenida(u1);
    }
}
