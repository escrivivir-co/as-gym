import { LineaArchivo } from "../../aleph-null";
import { Axioma } from "./axioma";

export interface ClausulaHorn extends Axioma {

    linea: LineaArchivo;

}

export class ClausulaHorn implements ClausulaHorn {

    constructor(public linea: LineaArchivo) {
    }
}