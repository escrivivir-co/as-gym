import { ITerminal, Tipo } from '../unificador/unificacion-general';
import { dTF, IFuncion } from "../unificador/dTF";
import { dT } from "../unificador/dT";

const prologEjemplo2 = [
    "p(X, Y) := q(X) and r(Y, Z).",
    "p(X, Y) := q(X) and q(Y).",
    "q(a).",
    "r(a, b).",
    "r(b, b)."
]

export type sLinea = string;
export type sTermino = string;

export type LineaRaw = {
    cabeza: sTermino,
    cuerpo: sTermino[]
};

export type Linea = {
    cabeza: IFuncion,
    cuerpo: IFuncion[]
};

export class Parser {

    lineasRaw: LineaRaw[] = [];
    lineas: Linea[] = [];

    constructor(public lineasOrigen: sLinea[]) {

        this.lineasOrigen.forEach(l => this.parsearLinea(l))
        console.log("\t - Parser Programa (líneas entrada/salida)", this.lineasOrigen.length, "/", this.lineas.length)
        this.lineas.map(
            (l, i) =>  "\t\t - L: " + (i + 1) + " "  +
                l.cabeza.imprimir() +
                    (l.cuerpo.length > 0 ? " :> " : "") +
                    l.cuerpo.map(ll => ll.imprimir()).join(", ")
        ).forEach(l => console.log(l))
        // console.log("\t LineasRaw", this.lineasRaw)
        // console.log("\t Lineas", this.lineas.map(l => l.cabeza.imprimir()))
    }

    parsearLinea(l: sTermino) {

        try {

            const linea = l.split(":=")

            const cabeza = linea[0]

            const cuerpo = (linea.length > 1 ?
                    linea[1].split("and").map(t => t.replace(".", "").trim()) :
                    []);

            this.lineasRaw.push({ cabeza, cuerpo })

            this.lineas = this.lineasRaw.map(lr => {
                return {
                    cabeza: this.parsearSTermino(lr.cabeza) as IFuncion,
                    cuerpo: lr.cuerpo.filter(c => c != "").map(c => this.parsearSTermino(c) as IFuncion)
                }
            })

        } catch(ex) {
            console.log("Parseador, error", ex.message);
        }

    }

    parsearSTermino(s: sTermino): ITerminal {

        // console.log("\t\t\t\t - Analizando: ", `[${s}]`)
        try {

            const p1 = s.indexOf("(")
            const p2 = s.lastIndexOf(")")

            if (p1 == -1 || p2 == -1) {
                return new dT(s, this.esMayuscula(s) ? Tipo.V : Tipo.c)
            }

            const cabezaRaw = s.substring(0, p1);
            const cuerpo = s.substring(p1 + 1, p2).split(",").filter(x => x).map(sT => this.parsearSTermino(sT.trim()));

            const t = new dTF(cabezaRaw, cuerpo)
            // console.log("Step f", t.v,  s, p1, p2, s.substring(p1, p2))
            return t;

        } catch(ex) {
            console.log("Parseador, error", ex.message);
        }

    }

    esMayuscula(s: string): boolean {
        return s.toUpperCase() == s;
    }
}