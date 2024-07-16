export type SumaPonderada = number;
export type Salida = number;

export interface IActivacionNeurona {

    sesgo: number;
    pesos: number[];
    entradas?: number[];

}

export interface IFuncionActivacion {
    g: (activacion: SumaPonderada) => Salida
}

export class FuncionEscalon implements IFuncionActivacion {

    g(activacion: SumaPonderada): Salida {

        return activacion < 0 ? 0 : 1;

    }
}

export class FuncionLineal implements IFuncionActivacion {

    g(activacion: SumaPonderada): Salida {

        return activacion;

    }
}

export class FuncionTangenteHiperbolica implements IFuncionActivacion {

    g(activacion: SumaPonderada): Salida {

        const eaMas = Math.exp(activacion);
        const eaMenos = Math.exp(activacion * -1);

        const numerador = eaMas - eaMenos;
        const denominador = eaMas + eaMenos;

        return numerador / denominador;

    }
}

export class FuncionGaussiana implements IFuncionActivacion {

    mu = 0;
    sigma = 1;

    g(activacion: SumaPonderada): Salida {

        const exponent = -0.5 * Math.pow((activacion - this.mu) / this.sigma, 2);
        const coefficient = 1 / (this.sigma * Math.sqrt(2 * Math.PI));

        return coefficient * Math.exp(exponent);
    }

    generarMuestraGaussiana(media: number, varianza: number): number {
        return media + varianza * Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    }
}