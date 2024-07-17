import { IDominio } from "./dominio";

/**
 * Tuétano de los mundos, los Modelos contienen su información.
 * o bien mutables funcionando por sí solos,
 * o bien puros, en cadenas de bloques.
 */

export interface IModelo {

	nombre: string;

	/**
	 * Contador de días (uno por ciclo)
	 */
	dia: number;

	/**
	 * Límite de días, el mundo se depondrá
	 */
	muerte: number;

	/**
	 * Frecuencia de ciclo (en ms)
	 */
	pulso: number;

	dominio: IDominio;

	imprimir(): string;

	estado: any;

}
