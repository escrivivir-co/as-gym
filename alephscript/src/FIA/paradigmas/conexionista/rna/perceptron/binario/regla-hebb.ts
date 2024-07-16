/**
 * Crea en typescript un clase PerceptronBinario.
 * Esta clase implementa una red neuronal artificial.
 * Para entrenarse debe usar la regla de Hebb.
 *
 * Agrega una clase para probar el PerceptronBinario que,
 * primero la entrene y después la use para inferir
 * - la función AND.
 */
class ReglaHebb {

    pesos: number[];
    umbral: number;

    /**
     *  - User: qué es la tasaAprendizaje
        - ChatGPT:
La tasa de aprendizaje (tasaAprendizaje) es un parámetro importante en algoritmos de aprendizaje, incluyendo aquellos utilizados en redes neuronales. En el contexto de un perceptrón y la regla de Hebb, la tasa de aprendizaje determina cuánto deben ajustarse los pesos de la red en cada iteración durante el proceso de entrenamiento.

En el código proporcionado, la tasa de aprendizaje se establece en 0.1 en la clase PerceptronBinario. Este valor es un ejemplo y puede ser ajustado experimentalmente. La elección de la tasa de aprendizaje es un equilibrio delicado. Si la tasa de aprendizaje es muy pequeña, el modelo puede converger muy lentamente y podría quedar atrapado en mínimos locales. Si la tasa de aprendizaje es muy grande, el modelo puede oscilar alrededor del mínimo o incluso divergir.

Entonces, la elección de la tasa de aprendizaje depende de la naturaleza del problema y puede requerir ajustes empíricos. Puedes experimentar con diferentes valores (por ejemplo, 0.01, 0.1, 0.5) y observar cómo afectan el rendimiento del modelo. Algunas técnicas avanzadas también ajustan automáticamente la tasa de aprendizaje durante el entrenamiento para mejorar la convergencia.

En resumen, la tasa de aprendizaje es un hiperparámetro que debe ajustarse cuidadosamente para cada problema específico, y la elección de un valor adecuado es parte del proceso de experimentación en el desarrollo de modelos de aprendizaje automático.
     */
    tasaAprendizaje: number;

    constructor(numEntradas: number, tasaAprendizaje: number) {

        this.pesos = new Array(numEntradas).fill(0);
        this.umbral = 0;
        this.tasaAprendizaje = tasaAprendizaje;
    }

    activacion(entrada: number[]): number {

      const sumaPonderada = entrada.reduce((sum, value, index) => sum + value * this.pesos[index], 0);
      return sumaPonderada > this.umbral ? 1 : 0;

    }

    public entrenar(entradas: number[][], salidasDeseadas: number[]): void {

        if (entradas.length !== salidasDeseadas.length) {
            throw new Error("La cantidad de ejemplos de entrenamiento no coincide con la cantidad de salidas deseadas.");
        }

        const numEntradas = this.pesos.length;

        for (let epoch = 0; epoch < 1000; epoch++) {

            for (let i = 0; i < entradas.length; i++) {

                const entrada = entradas[i];
                const salidaDeseada = salidasDeseadas[i];

                const salidaCalculada = this.activacion(entrada);
                const error = salidaDeseada - salidaCalculada;

                for (let j = 0; j < numEntradas; j++) {
                    this.pesos[j] += this.tasaAprendizaje * error * entrada[j];
                }
            }
        }
    }

    public inferir(entrada: number[]): number {
        return this.activacion(entrada);
    }

}

// Clase de prueba
class PruebaReglaHebb {

    public static probarAnd(): void {
        const perceptron = new ReglaHebb(2, 0.1);
        const entradas = [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
        ];
        const salidasDeseadas = [0, 0, 0, 1];

        perceptron.entrenar(entradas, salidasDeseadas);

        console.log("Resultado después del entrenamiento:");
        entradas.forEach((entrada) => {
            const resultado = perceptron.inferir(entrada);
            console.log(`${entrada[0]} AND ${entrada[1]} = ${resultado}`);
        });
    }
}
