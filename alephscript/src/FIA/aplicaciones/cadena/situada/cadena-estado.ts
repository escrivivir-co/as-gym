import { EstadoT } from "../../../paradigmas/situada/estado";
import { CadenaModelo } from "../modelo/cadena-modelo";


export enum CadenaEstados {
    PARADA = "PARADA",
    ARRANCAR = "ARRANCAR",
    AVANZAR = "AVANZAR",
    PARAR = "PARAR",
    FUERA_SERVICIO = "FUERA_SERVICIO"
}

export class CadenaEstado<CadenaEstados> extends EstadoT<CadenaEstados> {

    modelo: CadenaModelo;

    transicion(): void {

        switch(this.modelo.motor) {

            case CadenaEstados.PARADA:
                this.modelo.motor = CadenaEstados.ARRANCAR;
               break;

            case CadenaEstados.ARRANCAR:
               this.modelo.motor = CadenaEstados.AVANZAR;
               break;

            case CadenaEstados.AVANZAR:

               /**
                * Procesar la aferencia
                **/

               // La cinta trabajará con la luz apagada la primera mitad del día
               // y con la luz encendida la segunda.
               const iluminacion = this.modelo.dia % 2 == 0;

               /**
                *  Construir la eferencia
                **/
               this.modelo.posicion++;
               this.modelo.iluminacion = iluminacion;

               /**
                * Construir la condición de salida
                **/

               // El autómata detendrá la simulación
               // con tiempo de parar la máquina;
               // teniendo en cuenta el tiempo de arranque y de parada

               const tiempoArranque = 2;
               const tiempoParada = 2;
               if (this.modelo.posicion === (
                  this.modelo.muerte - tiempoArranque - tiempoParada
               )) {
                  this.modelo.motor = CadenaEstados.PARAR;
               }

               break;

            case CadenaEstados.PARAR:
               this.modelo.posicion = 0;
               this.modelo.iluminacion = false;
               this.modelo.motor = CadenaEstados.FUERA_SERVICIO;
               break;

            default:
               this.modelo.iluminacion = false;
               this.modelo.motor = CadenaEstados.PARADA;
        }
    }
}