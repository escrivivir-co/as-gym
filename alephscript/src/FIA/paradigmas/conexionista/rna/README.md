# FIA Conexionista: Red Neuronal Articial

Una RNA es un paradigma de procesamiento de información inspirado en cómo lo hace el cerebro. En las RNA un número de [neuronas](./neurona.ts) colaboran para resolver un problema. Cada neurona recibe un conjunto de entradas y devuelve una única salida. Las salidas de unas neuronas son la entrada para otras, estableciéndose una red de procesamiento.

Distintas [funciones de activación o transición](./activacion.ts) pueden ser implementadas:

- Funcion Escalón
- Funcion Lineal
- Funcion Sigmoidea
- Funcion Tangente Hiperbólica
- Funcion Gaussiana

Por ejemplo:

```ts

export interface IFuncionActivacion {
    g: (activacion: SumaPonderada) => Salida
}

export class FuncionEscalon implements IFuncionActivacion {

    g(activacion: SumaPonderada): Salida {

        return activacion < 0 ? 0 : 1;

    }
}

```

Los problemas que pueden resolver las RNAs son de 2 tipos básicos:

- [clasificacion](./clasificacion.ts)
- [regresion](./regresion.ts)

Esta sección ha sido confeccionada junto a ChatGPT. En noviembre 2023 no es una sección redactada sino en bruto, recopilación de conceptos principales y código de ejemplo: TODO.