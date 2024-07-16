import { IDatosAleatoriosMimetico, IDatosEtiquetadosMimetico } from './datos';
import { IModeloMimetico } from "./modelo";

export interface IOraculoMimetico<T> {

    modelo: IModeloMimetico<T>;

    comoModelo(): IModeloMimetico<T>;
    etiquetar(aleatorios: IDatosAleatoriosMimetico): IDatosEtiquetadosMimetico;
}

export class OraculoMimetico<T> implements IOraculoMimetico<T> {

    constructor(public modelo: IModeloMimetico<T>) {
    }

    comoModelo(): IModeloMimetico<T> {

        return this.modelo;
    }

    etiquetar(aleatorios: IDatosAleatoriosMimetico): IDatosEtiquetadosMimetico {

        const tensorEtiquetado = aleatorios.tensor.map(entrada => {

            const etiqueta = this.modelo.etiqueta(entrada);

            return {
                entrada,
                etiqueta,
            }
        });

        return {
            tensorEtiquetado
        }
    }
}