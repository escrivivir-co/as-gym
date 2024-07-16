import { GeneradorAleatorioMimetico, IDatosAleatoriosMimetico, IDatosEntrenamientoMimetico, IDatosEtiquetadosMimetico, IDatosMimetico } from './datos';
import { IEstudianteMimetico } from './estudiante';
import { IModeloMimetico, ModeloMimetico } from './modelo';
import { IOraculoMimetico } from './oraculo';

export interface IAprendizajeMimetico<T> {

    modelo_original: IModeloMimetico<T>;

    entrenamiento: IDatosEntrenamientoMimetico;
    estudiante: IEstudianteMimetico<T>;
    oraculo: IOraculoMimetico<T>;

    aleatorios: IDatosAleatoriosMimetico;
    etiquetados: IDatosEtiquetadosMimetico;

    entrenamiento_etiquetados: IDatosEntrenamientoMimetico | IDatosEtiquetadosMimetico;

    estudiante2: IEstudianteMimetico<T>;

    modelo_mimetico: IModeloMimetico<T>;

    instanciar(entrenamiento: IDatosEntrenamientoMimetico): void;
}

export class AprendizajeMimetico<T> implements IAprendizajeMimetico<T> {

    entrenamiento: IDatosEntrenamientoMimetico;
    estudiante: IEstudianteMimetico<T>;
    oraculo: IOraculoMimetico<T>;

    aleatorios: IDatosAleatoriosMimetico;
    etiquetados: IDatosEtiquetadosMimetico;

    entrenamiento_etiquetados: IDatosEntrenamientoMimetico | IDatosEtiquetadosMimetico;

    estudiante2: IEstudianteMimetico<T>;

    modelo_mimetico: IModeloMimetico<T>;

    constructor(public modelo_original: IModeloMimetico<T>) {}

    instanciar(entrenamiento: IDatosEntrenamientoMimetico) {

        this.entrenamiento = entrenamiento;

        this.ejecutarPrimeraFase();
        this.ejecutarSegundaFase();
    }

    ejecutarPrimeraFase() {

        this.oraculo = this.estudiante.entrenar(this.entrenamiento);
        this.modelo_original = this.oraculo.modelo;

    }

    ejecutarSegundaFase() {

        const aleatorios: IDatosAleatoriosMimetico = new GeneradorAleatorioMimetico().distribucionNormal(10, 1, 100);
        const etiquetados: IDatosEtiquetadosMimetico = this.oraculo.etiquetar(aleatorios);

        const entrenamiento_etiquetados: IDatosEtiquetadosMimetico = {
            tensorEtiquetado: this.entrenamiento.tensorEtiquetado.concat(etiquetados.tensorEtiquetado)
        };

        this.modelo_mimetico = this.estudiante2
            .entrenar(entrenamiento_etiquetados)
            .modelo;

    }
}

const am = new AprendizajeMimetico<IDatosMimetico>(new ModeloMimetico<IDatosMimetico>({ tensor: [] }))
const entrenamiento: IDatosEntrenamientoMimetico = { tensorEtiquetado: [] };
am.instanciar(entrenamiento);
console.log("Modelo resultante", am.modelo_mimetico);