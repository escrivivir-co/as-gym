/**
 * IFIACompleta - Interfaz extendida de iFIA con paradigma asignado
 * 
 * Combina la interfaz base iFIA con un paradigma específico
 */

import { iFIA, IPercepto, IAccion, IMundo } from '@fia/core';
import { IParadigma, IResultadoRazonamiento } from './IParadigma';

/**
 * Estado completo de una FIA
 */
export interface IFIAEstado {
    /** Nombre de la FIA */
    nombre: string;
    /** Paradigma activo */
    paradigma: string;
    /** Estado de ejecución */
    ejecutando: boolean;
    /** Ciclos totales */
    ciclos: number;
    /** Estado del mundo */
    mundo: IMundo;
}

/**
 * FIA Completa con paradigma integrado
 */
export interface IFIACompleta extends iFIA {
    /** Paradigma asignado */
    paradigma: IParadigma;
    
    /** Estado completo */
    estado: IFIAEstado;
    
    /**
     * Asignar un paradigma a esta FIA
     * @param paradigma Paradigma a usar
     */
    asignarParadigma(paradigma: IParadigma): void;
    
    /**
     * Ejecutar ciclo de razonamiento usando el paradigma
     * @param percepto Entrada
     */
    ciclo(percepto: IPercepto): Promise<IResultadoRazonamiento>;
}

/**
 * Implementación base de FIA Completa
 */
export class FIACompletaBase implements IFIACompleta {
    nombre: string;
    mundo: IMundo;
    paradigma!: IParadigma;
    
    estado: IFIAEstado;
    
    constructor(nombre: string, mundo?: IMundo) {
        this.nombre = nombre;
        this.mundo = mundo || this.crearMundoVacio();
        this.estado = {
            nombre,
            paradigma: '',
            ejecutando: false,
            ciclos: 0,
            mundo: this.mundo
        };
    }
    
    private crearMundoVacio(): IMundo {
        return {
            nombre: `mundo_${this.nombre}`,
            entidades: [],
            relaciones: [],
            tiempo: Date.now()
        };
    }
    
    asignarParadigma(paradigma: IParadigma): void {
        this.paradigma = paradigma;
        this.estado.paradigma = paradigma.nombre;
    }
    
    async instanciar(): Promise<void> {
        if (this.paradigma) {
            await this.paradigma.inicializar();
        }
    }
    
    async ciclo(percepto: IPercepto): Promise<IResultadoRazonamiento> {
        if (!this.paradigma) {
            throw new Error(`FIA ${this.nombre} no tiene paradigma asignado`);
        }
        
        this.estado.ejecutando = true;
        const resultado = await this.paradigma.razonar(percepto, this.mundo);
        this.estado.ciclos++;
        this.estado.ejecutando = false;
        
        if (resultado.mundoActualizado) {
            this.mundo = resultado.mundoActualizado;
            this.estado.mundo = this.mundo;
        }
        
        return resultado;
    }
    
    razona(percepto: IPercepto): IAccion[] {
        // Versión síncrona - wrapper
        return [];
    }
}
