import { ClausulaHorn } from './algoritmo/logica/clausula-horn';
import { RTCache } from "../../../engine/kernel/rt-cache";
import { ResolucionSLD } from './algoritmo/control/clausula-horn';
import { PrologServer } from './prolog/server';

export const DEAFULT_PL = "/Users/morente/Desktop/THEIA_PATH/taller_tc/JE20/je20/fia/src/FIA/paradigmas/sbr/app/prolog/test.pl";

export interface Interprete {

    libreria: LibreriaProlog;

    servidor: PrologServer;

    deducir: (conocimiento: ClausulaHorn[]) => ResolucionSLD;
}

export class InterpreteSLD implements InterpreteSLD {

    constructor(public libreria: LibreriaProlog) {}

    servidor = new PrologServer();

    deducir(conocimiento: ClausulaHorn[]): ResolucionSLD
    {
        this.servidor.startServer();

        this.servidor.openProlog(this.libreria.archivo_pl);

        return null;
    }
}


export type RutaDisco = string;
export type Archivo = string;
export type LineaArchivo = string;

export interface Problema {

    archivo_pl: RutaDisco;
    comoHorn: () => ClausulaHorn[];

}

export interface LibreriaProlog {

    archivo_pl: RutaDisco;

    conocimiento: ClausulaHorn[];

    guardar: (conocimiento: ClausulaHorn[], archivo_pl: RutaDisco) => void;

    leer: (archivo_pl: RutaDisco) => ClausulaHorn[];
}

export class Libreria implements LibreriaProlog {

    rt = new RTCache();

    archivo_pl: RutaDisco = DEAFULT_PL;

    conocimiento: ClausulaHorn[];

    guardar(conocimiento: ClausulaHorn[], archivo_pl: RutaDisco): void {

        this.archivo_pl = archivo_pl;
        this.rt.archivo = archivo_pl;
        this.rt.dominio.base = conocimiento;
        this.rt.persistirRuta();

        this.conocimiento = conocimiento;

    }

    leer(archivo_pl: RutaDisco) : ClausulaHorn[] {

        const archivo: Archivo = this.rt.recuperRuta(archivo_pl);
        return archivo
            .split("\n")
            .map((axioma: LineaArchivo) => new ClausulaHorn(axioma));

    }
}

export interface AlephNull {

    iniciar: () => void;

    libreria: LibreriaProlog;

    interprete: Interprete;

    declararConocimiento: (problema: Problema) => ClausulaHorn[];

    deducir: (conocimiento: ClausulaHorn[]) => ResolucionSLD;
}

export class AlephNullBot implements AlephNull {
    server: PrologServer;

    iniciar(): void {
        this.libreria = new Libreria();
        this.server = new PrologServer();
        this.server.openProlog(this.libreria.archivo_pl);
        this.server.runPrologFunction("", "")

    }
    libreria: LibreriaProlog;

    interprete: Interprete;

    declararConocimiento(problema: Problema): ClausulaHorn[] {

        this.libreria = new Libreria();

        this.libreria.guardar(problema.comoHorn(), problema.archivo_pl);

        return this.libreria.conocimiento;

    }

    deducir(conocimiento: ClausulaHorn[]): ResolucionSLD {

        return this.interprete.deducir(conocimiento);
    }
}