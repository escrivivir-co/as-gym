/**
 * Parser - Parser de programas Prolog
 * 
 * Convierte texto plano en estructura de cláusulas.
 * Sintaxis: cabeza := cuerpo1 and cuerpo2.
 * 
 * @migrado-desde alephscript/src/FIA/paradigmas/logica/resolucion/parser.ts
 */

import { ITerminal, IFuncion, Tipo, Linea, LineaRaw } from '../types';
import { dT } from '../unificador/dT';
import { dTF } from '../unificador/dTF';

export class Parser {
    lineasRaw: LineaRaw[] = [];
    lineas: Linea[] = [];

    constructor(public lineasOrigen: string[]) {
        this.lineasOrigen.forEach((l) => this.parsearLinea(l));
    }

    /**
     * Parsea una línea de programa Prolog
     */
    parsearLinea(l: string): void {
        try {
            const linea = l.split(':=');
            const cabeza = linea[0].trim();
            const cuerpo =
                linea.length > 1
                    ? linea[1]
                          .split('and')
                          .map((t) => t.replace('.', '').trim())
                    : [];

            this.lineasRaw.push({ cabeza, cuerpo });

            this.lineas = this.lineasRaw.map((lr) => ({
                cabeza: this.parsearTermino(lr.cabeza) as IFuncion,
                cuerpo: lr.cuerpo
                    .filter((c) => c !== '')
                    .map((c) => this.parsearTermino(c) as IFuncion),
            }));
        } catch (ex: any) {
            console.error('Parser error:', ex.message);
        }
    }

    /**
     * Parsea un término (constante, variable, o función)
     */
    parsearTermino(s: string): ITerminal {
        try {
            const p1 = s.indexOf('(');
            const p2 = s.lastIndexOf(')');

            // Sin paréntesis → constante o variable
            if (p1 === -1 || p2 === -1) {
                return new dT(
                    s.trim(),
                    this.esMayuscula(s.trim()) ? Tipo.V : Tipo.c
                );
            }

            // Con paréntesis → función
            const cabezaRaw = s.substring(0, p1).trim();
            const cuerpo = s
                .substring(p1 + 1, p2)
                .split(',')
                .filter((x) => x)
                .map((sT) => this.parsearTermino(sT.trim()));

            return new dTF(cabezaRaw, cuerpo);
        } catch (ex: any) {
            console.error('Parser término error:', ex.message);
            return new dT(s, Tipo.c);
        }
    }

    /**
     * Detecta si un string es variable (mayúsculas)
     */
    esMayuscula(s: string): boolean {
        return s.length > 0 && s.toUpperCase() === s;
    }

    /**
     * Imprime el programa parseado
     */
    imprimir(): void {
        console.log(
            '\t - Parser Programa (líneas entrada/salida)',
            this.lineasOrigen.length,
            '/',
            this.lineas.length
        );
        this.lineas.forEach((l, i) => {
            console.log(
                `\t\t - L${i + 1}: ${l.cabeza.imprimir()}${
                    l.cuerpo.length > 0 ? ' :> ' : ''
                }${l.cuerpo.map((ll) => ll.imprimir()).join(', ')}`
            );
        });
    }
}
