/**
 * Diseña en typescript un clasificador basado en un perceptrón
 * que separe dos clases ambas unidimensionales
 * con distribución gaussiana de varianza 1 y medias -10 y 10.
 * Agrega una clase que pruebe el perceptrón.
 */
class PerceptronUnidimensional {

    private peso: number;
    private umbral: number;
    private tasaAprendizaje: number;

    constructor(tasaAprendizaje: number) {
        this.peso = 0;
        this.umbral = 0;
        this.tasaAprendizaje = tasaAprendizaje;
    }

    private activacion(x: number): number {
        return x > this.umbral ? 1 : 0;
    }

    public entrenar(entradas: number[], salidasDeseadas: number[]): void {
        if (entradas.length !== salidasDeseadas.length) {
        throw new Error("La cantidad de ejemplos de entrenamiento no coincide con la cantidad de salidas deseadas.");
        }

        for (let epoch = 0; epoch < 1000; epoch++) {
        for (let i = 0; i < entradas.length; i++) {
            const entrada = entradas[i];
            const salidaDeseada = salidasDeseadas[i];
            const salidaCalculada = this.activacion(entrada);
            const error = salidaDeseada - salidaCalculada;

            this.peso += this.tasaAprendizaje * error * entrada;
            this.umbral += this.tasaAprendizaje * error;
        }
        }
    }

    public inferir(entrada: number): number {
        return this.activacion(entrada);
    }
    }

   // Clase de prueba
export class PruebaPerceptronUnidimensional {
    public static probar(): void {
        const perceptron = new PerceptronUnidimensional(0.1);

        // Generar datos de entrenamiento con distribución gaussiana
        const muestrasClase1 = this.generarMuestrasGaussianas(-10, 1, 50);
        const muestrasClase2 = this.generarMuestrasGaussianas(10, 1, 50);

        // Etiquetar las muestras con 0 o 1 (clases)
        const entradas = [...muestrasClase1, ...muestrasClase2];
        const salidasDeseadas = Array(muestrasClase1.length).fill(0).concat(Array(muestrasClase2.length).fill(1));

        // Entrenar el perceptrón
        perceptron.entrenar(entradas, salidasDeseadas);

        // Prueba del perceptrón
        const nuevaMuestra = 5;
        const resultado = perceptron.inferir(nuevaMuestra);
        console.log(`Resultado para nueva muestra ${nuevaMuestra}: ${resultado}`);
    }

    private static generarMuestrasGaussianas(media: number, varianza: number, cantidad: number): number[] {
        const muestras = [];
        for (let i = 0; i < cantidad; i++) {
            muestras.push(this.generarMuestraGaussiana(media, varianza));
        }
        return muestras;
    }

    private static generarMuestraGaussiana(media: number, varianza: number): number {
        return media + varianza * Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    }
    }

    // Ejecutar la prueba
    PruebaPerceptronUnidimensional.probar();