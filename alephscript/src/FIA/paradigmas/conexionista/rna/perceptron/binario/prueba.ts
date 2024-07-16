import { IConjuntoEntrenamientoSupervisado } from "../../entrenar";
import { IEnunciado, ISolucion } from "../../red";
import { PerceptronBinario } from "./perceptron-binario";

export class PerceptronBinarioPrueba  {

    p = new PerceptronBinario();

    ce: IConjuntoEntrenamientoSupervisado;

    probar(): boolean {

        const p = new PerceptronBinario();

        p.entrenar(this.ce);

        const enunciado: IEnunciado = {
            valor: 100
        };

        const solucion = p.inferir(enunciado);

        const esperado: ISolucion = {
            valor: 1
        };

        return solucion === esperado;
    }

}