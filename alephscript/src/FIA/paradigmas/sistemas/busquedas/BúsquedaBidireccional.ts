import { Control } from "./control";

export interface BúsquedaBidireccional extends Control {

    // Siempre encuentra la solución
    /*
    La búsqueda bidireccional es completa si en una de las direcciones se hace búsqueda en anchura, porque así se garantiza que las dos búsquedas se encontrarán en algún momento.
    */
    completo: true;

    // Siempre encuentra la solución óptima
    /**
     * Si se realiza la búsqueda desde un nodo objetivo, es admisible.
     */
    admisible: false;

}
