import { CargadorBaseExperta } from "./cargador";
import { CabeceraPC } from "./dominio/arbol";
import { PC1, PC2 } from "./dominio/ejemplo";
import { Aferencia } from "./dominio/tipos";

export function BaseExpertaSimulacion() {
    return new Promise(async (resolve, reject) => {
        const procesador = new CargadorBaseExperta({
            cabecera: CabeceraPC,
            lineas: [PC1, PC2],
            red: null
          });

          await procesador.crearBase();

          const GuidSensor = "temperatura";
          const Lectura = 50;

          const estado: Aferencia = {
            GuidSensor,
            Lectura
          }
          procesador.aferencia(estado);

          resolve(true);
    })
}