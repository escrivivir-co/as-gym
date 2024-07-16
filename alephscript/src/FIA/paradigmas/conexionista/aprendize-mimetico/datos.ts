import { IEtiqueta } from "./modelo";

export interface IDatosMimetico {

    tensor?: number[];
}

export interface IDatosAleatoriosMimetico extends IDatosMimetico {


}

export interface IDatosEtiquetadosMimetico extends IDatosMimetico {

    tensorEtiquetado: {
        entrada: number,
        etiqueta: IEtiqueta
    }[];

}

export interface IDatosEntrenamientoMimetico extends IDatosEtiquetadosMimetico {


}


export interface IGeneradorAleatorioMimetico {

    distribucionUniforme(maximo: number, dimension: number): IDatosAleatoriosMimetico;

    distribucionNormal(media: number, varianza: number, dimension: number): IDatosAleatoriosMimetico;

    distribucionRemuestreo(e: IDatosEntrenamientoMimetico, dimension: number): IDatosAleatoriosMimetico;
}

export class GeneradorAleatorioMimetico implements IGeneradorAleatorioMimetico{

    distribucionUniforme(maximo: number, dimension: number): IDatosAleatoriosMimetico {
        const tensor = new Array<number>(dimension)
            .map(() => Math.random() * maximo);
        return {
            tensor
        };

    }

    distribucionNormal(media: number, varianza: number, dimension: number): IDatosAleatoriosMimetico {

        const tensor = new Array<number>(dimension)
            .map(() => media + varianza * Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));
        return {
            tensor
        };
    }

    distribucionRemuestreo(e: IDatosEntrenamientoMimetico, dimension: number): IDatosAleatoriosMimetico {

        const tensor = new Array<number>(dimension)
            .map(() => {
                const rango = Math.random() * e.tensor.length;
                return e.tensor[rango];
            });

        return {
            tensor
        };
    }


}