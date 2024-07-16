import { IEstado } from "./estado";

export interface ILinea {
    estado: {
        aferente: IEstado;
        eferente: IEstado;
    }
}

export interface ITablaEstado {

    tabla: ILinea[];
    procesarAferencia(a: IEstado): IEstado | null;
}

export class TablaEstado {

    tabla: ILinea[] = [];

    procesarAferencia(a: IEstado): IEstado | null {

        const posicion = this.tabla.findIndex(e => e.estado.aferente === a);

        if (posicion > -1) {
            return this.tabla[posicion].estado.eferente;
        } else {
            return null;
        }

    }

}