import { IDatosEntrenamientoMimetico, IDatosMimetico } from "./datos";
import { IModeloMimetico, ModeloMimetico } from "./modelo";
import { IOraculoMimetico, OraculoMimetico } from "./oraculo";

export interface IEstudianteMimetico<T> {
    entrenar(entrenamiento: IDatosEntrenamientoMimetico): IOraculoMimetico<T>;
}

export class EstudianteMimetico<T> implements IEstudianteMimetico<T> {

    constructor(public modelo: IModeloMimetico<T>) {
    }

    entrenar(entrenamiento: IDatosEntrenamientoMimetico): IOraculoMimetico<T> {

        const oraculo = new OraculoMimetico<T>(this.modelo);
        entrenamiento.tensorEtiquetado.map(te => oraculo.modelo.base[te.entrada] = te.etiqueta);
        return oraculo;
    }
}