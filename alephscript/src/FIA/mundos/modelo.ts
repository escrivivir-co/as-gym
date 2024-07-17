import { Dominio } from "./dominio";
import { IModelo } from "./IModelo";

export const BASE_MUNDO_PULSO = 2000;

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

