import { IDominio, Dominio } from "./dominio";

export const BASE_MUNDO_PULSO = 2000;

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

export class Modelo implements IModelo {

    nombre = "<Modelo Vacío>";
    dia: number = 0;
    muerte: number = 3;
    pulso: number = BASE_MUNDO_PULSO;
    dominio = new Dominio({});
    estado;

    imprimir(): string {
        return Object
            .keys(this).map(k => {

                let out = "";

                if (typeof this[k] === "object") {
                    out = `${k}: ${JSON.stringify(this[k])}`
                } else {
                    out = `${k}: ${this[k]}`
                }

                return out;
            }).join("\n\t\t -");
    }
}

