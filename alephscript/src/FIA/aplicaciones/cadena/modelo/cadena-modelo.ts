import { CadenaEstados } from "../situada/cadena-estado";
import { Modelo } from "../../../mundos/modelo";
import { i18 } from "../../../i18/aleph-script-i18";


export class CadenaModelo extends Modelo {
    nombre = "Cadena de producción";
    motor: CadenaEstados;
    posicion: number = 0;
    iluminacion: boolean;

    imprimir(): string {
        console.log("Imprimir the cadena modelo");
        const result = Object
            .keys(this).map(k => {

                let out = "";

                if (typeof this[k] === "object") {

                    const dominioA = this.dominio['modelo.motor.eventos'] || {};

                    if (dominioA) {
                        out = dominioA['inferencias.openai']?.respuesta;
                        out = `${i18.APPS.CADENA.MUNDO.AFERENCIA.AFERENCIA_RECOMENDACIONES_LABEL} \n\t -${ out || '----' }\n`;
                    } else {
                        out = `${k}: ${Object.keys(this[k]).join(" - ")}`;
                    }
                } else {
                    out = `${k}: ${this[k]}`
                }
                return out || '---';
            }).join("\n\t\t -");
        return result || '--';
    }

}