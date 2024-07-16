import { IBaseConocimiento } from "../../../../../../mundos/base-conocimiento";
import { IArcos, Arcos } from "./arco";


export interface IEstado {
    nombre: string;
    valor: string;
}

export interface IConcepto extends IEstado {
}

export interface IEntidad extends IEstado {
    imprimir(): void;
}

export class Entidad implements IEntidad {
    nombre = "entidad";
    valor = "entidad";

    imprimir() {
        return this.nombre;
    }

}

export interface IGrafo extends IBaseConocimiento {

    nombre: string;

    arcos: IArcos;

    imprimir(): string;

    encontrar(b: IBusqueda): Promise<IGrafo>;
}

export interface IBusqueda {
    etiqueta: string;
    destino: string;
    camino: IGrafo[];
    encontrado: boolean
}

export class Grafo implements IGrafo {

    base: IBaseConocimiento;

    nombre: string;

    arcos: IArcos = new Arcos();

    imprimir(): string {

        let out = "";
        out += "\n\t - (grafo) -" + this.nombre + "; arcos";
        this.arcos.estado.forEach(e => {
            out += "\n\t\t - " + e.etiqueta.estado.nombre;
        });
        return out;
    }

    async encontrar(b: IBusqueda): Promise<IGrafo> {

        b.camino.push(this);

        if (this.nombre == b.destino) {
            b.encontrado = true;
            return null;
        }

        if (this.arcos.estado.length == 0) {
            return null;
        }

        const candidatos = this.arcos.estado
            .map(async a => {
                /* console.log(
                    i18.SIMBOLICA.SEMANTICA.BUSQUEDA.COMPARANDO
                        .replace("entidad", a.destino.nombre)
                        .replace("etiqueta", a.etiqueta.estado.valor)
                        .replace("valor", "")
                ); */

            //  && a.etiqueta.estado.nombre === etiqueta

            if (a.destino.nombre == b.destino) {
                return a.destino;
            } else {
                return await a.destino.encontrar(b);
            }
        });

        return await Promise.race(candidatos);
    }

}