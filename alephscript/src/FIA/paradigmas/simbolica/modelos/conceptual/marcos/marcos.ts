import { IDiccionarioI18 } from "../../../../../genesis-block";
import { IReglaMarco } from "../../../regla";
import { IBusqueda, IGrafo } from "../../formal/sistema/semantica/grafo";
import { InferenciaConcepto } from "../inferencia/concepto/paradigma";
import { AS_MARCOS_i18 } from './as-marcos-i18';
import { IFacetas } from "./faceta";
import { IInferenciaMarcoDemonio, IInferenciaMarcoEquiparacion, IInferenciaMarcoHerencia } from "./inferencia";
import { IRelaciones } from "./relacion";

export interface IPropiedad {
    nombre: string;
    tipo: string;
    valor: string;
}

export interface IPropiedades {
    estado: IPropiedad[];
}

export interface IPropiedadClase extends IPropiedades {
    estado: IPropiedad[];   // Definida y rellenada en marco-clase
}

export interface IPropiedadInstancia extends IPropiedadClase {
    estado: IPropiedad[];   // Definida en marco-clase pero rellenada en marco-instancia
}

export class ReglaMarco extends InferenciaConcepto
    implements IReglaMarco {

    inferencia: IInferenciaMarcoEquiparacion | IInferenciaMarcoHerencia | IInferenciaMarcoDemonio

}

export interface IMarco extends IGrafo {

    i18: IDiccionarioI18;

    arcos: IRelaciones;

    // Esquema de atributos
    propiedades: IPropiedades;

    // Conjunto de estados de los atributos
    facetas: IFacetas;

    // Árbol de subclases
    relaciones: IRelaciones;

}

export class Marco implements IMarco {

    arcos: IRelaciones;

    i18 = AS_MARCOS_i18;

    nombre: string = this.i18.MARCOS.NOMBRE;

    // Esquema de atributos
    propiedades: IPropiedades = { estado: [] };

    // Conjunto de estados de los atributos
    facetas: IFacetas = { estado: [] };

    // Árbol de subclases
    relaciones: IRelaciones = { estado: [] };

    imprimir(): string {
        throw new Error("Method not implemented.");
    }

    encontrar(b: IBusqueda): Promise<IGrafo> {
        throw new Error("Method not implemented.");
    }

}

/**
 * Herencia simple: cuando el sistema de marcos tiene forma de árbol,
 *  considerando sólo “subclase-de” e “instancia”, de modo que sólo
 *  existe un camino desde cada marco
    instancia hasta el nodo raíz de la jerarquía. Se busca primero el valor 
    de la propiedad en el marco instancia, y si no se toma de la clase
    donde esté y que esté más cercana a la instancia si hay varias
    opciones (así se pueden tratar excepciones a la regla general).
 */
export class MarcoSimple extends Marco {

}

/**
 * Herencia múltiple: cuando el sistema de marcos tiene forma de grafo, 
 * considerando sólo “subclase-de” e “instancia”, existiendo varios 
 * caminos desde ciertos marcos instancia hasta el nodo raíz de la 
 * jerarquía. Si un marco es subclase o instancia de más de una clase, 
 * la herencia es múltiple. El valor de la propiedad en ese caso depende 
 * del método usado para recorrer el grafo: profundidad, anchura o 
 * distancia inferencial.
 * 
- Profundidad: es una búsqueda en profundidad desde el marco instancia 
    hasta la raíz. Para evitar que se pueda heredar de clases generales 
    en vez de clases específicas, se impone que sólo se pueda buscar 
    la propiedad en una clase si antes se ha buscado en todas sus subclases.
- Anchura: se recorre el grafo en anchura (niveles a la misma distancia 
    que el marco instancia). El grado de especialización de las clases 
    debe estar bien diseñado.
- Distancia inferencial: sirve para detectar situaciones ambiguas, 
    pero no las resuelve. La condición necesaria y suficiente para que la 
    clase 1 esté más cercana a la clase 2 que a la clase 3 es que haya un
    camino desde la clase 1 hacia la clase 3 a través de la clase 2. 
    Supone un orden parcial y puede implicar heredar valores contradictorios
    de ramas no conectadas.
 */
export class MarcoMultiple extends Marco {
    
}