/**
 * Tipos base del paradigma lógico
 */

export enum Tipo {
    V = "VARIABLE",
    c = "constante",
    f = "funcion"
}

export interface ITerminal {
    v: string;
    tipo: Tipo;
    imprimir(): string;
    comparar(SB: ITerminal): boolean;
    sustituir(s: Sustitucion[]): ITerminal;
}

export interface IFuncion extends ITerminal {
    parametros: ITerminal[];
    primerTerminalNoF(t: ITerminal[]): ITerminal;
    sustituir(s: Sustitucion[]): IFuncion;
    contenida(t: ITerminal): boolean;
}

/** Sustitución: Variable → Constante/Función */
export type Sustitucion = { V: ITerminal; c: ITerminal };

/** Línea de programa Prolog parseada */
export interface Linea {
    cabeza: IFuncion;
    cuerpo: IFuncion[];
}

/** Línea raw antes de parsear */
export interface LineaRaw {
    cabeza: string;
    cuerpo: string[];
}

/** Resultado de unificación */
export interface ResultadoUnificacion {
    unificable: boolean;
    umg: Sustitucion[];
}

/** Resultado de resolución completa */
export interface ResultadoResolucion {
    exito: boolean;
    soluciones: Sustitucion[][][];
    arbol: any; // Nodo raíz
}
