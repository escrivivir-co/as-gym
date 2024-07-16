import { IInferenciaRelacion } from '../../../inferencia';
import { InferenciaRelacion } from '../../formal/inferencia/relacion/paradigma';
import { IMarco, IPropiedad } from './marcos';
import { Valor } from './faceta';
import { IMotorInferenciaMarco } from './motor-inferencia';
import { IRelacion } from './relacion';

export type ValorEquiparacion = { candidato: IMarco, equiparacion: number}[];

export interface IInferenciaMarcoEquiparacion extends IInferenciaRelacion {

    marco_pregunta: Partial<IMarco>;
    candidatos: IMarco[];

    valorEquiparacion: ValorEquiparacion;
    obtenerValorEquiparacion: () => ValorEquiparacion;

    marco_solucion: IMarco;
    infererir: (m: Partial<IMarco>) => IMarco;
}

export interface IInferenciaMarcoHerencia extends IInferenciaRelacion {

    propiedad_pregunta: IPropiedad;

    instancia: IMarco;

    inferir(): IPropiedad;

    herenciaSimple(): IPropiedad;

    herenciaMultipleBusquedaProfundidad(i: IRelacion): IPropiedad | null;

    herenciaMultipleBusquedaAmplitud(): IPropiedad;

    herenciaMultipleDistanciaInferencial(): IPropiedad;

}

export interface IInferenciaMarcoDemonio extends IInferenciaRelacion {

}

export class InferenciaMarcoEquiparacion extends InferenciaRelacion {

    valorEquiparacion: ValorEquiparacion = [];

    marco_solucion: IMarco;

    constructor(public marco_pregunta: Partial<IMarco>, public candidatos:IMarco[]) {
        super();
    }

    inferir(): IMarco {

        this.valorEquiparacion = this.obtenerValorEquiparacion();

        const maximo = this.valorEquiparacion
            .reduce((maximo, candidato) => Math.max(maximo, candidato.equiparacion), 0);
        this.marco_solucion = this.valorEquiparacion.find(m => m.equiparacion === maximo)?.candidato;
        return this.marco_solucion;
    }

    obtenerValorEquiparacion(): ValorEquiparacion {

        return this.candidatos.map(candidato =>  { return {
            candidato,
            equiparacion: this.calcularEquiparacion(candidato)
        }});

    }

    calcularEquiparacion(candidato: IMarco): number {

        let equiparacion = 0;
        if (this.marco_pregunta.propiedades.estado.length > 0) {
            const igualdad = candidato.propiedades.estado.filter( p => {
                const propiedad = this.marco_pregunta
                    .propiedades.estado.find(pp => p.nombre == pp.nombre);
                return propiedad.valor === p.valor
            });
            equiparacion = (igualdad.length / candidato.propiedades.estado.length) * 100
        }

        return equiparacion;

    }

}

export class InferenciaMarcoHerencia extends InferenciaRelacion {

    marco_solucion: IMarco;

    constructor(public propiedad_pregunta: IPropiedad, public instancia: IMarco) {
        super();
    }

    herenciaMultipleBusquedaProfundidad(i: IRelacion): IPropiedad | null {

        const relacion = this.instancia.arcos.estado.find(arco => {
            const propiedad = arco
                .destino
                .arcos.estado
                .filter(a => ['instancia', 'subclase'].indexOf(a.etiqueta.estado.valor) > -1)
                .filter(a => a.destino
                    .propiedades
                    .estado
                    .find(p => p.nombre === this.propiedad_pregunta.nombre))
                .find(subarco => this.herenciaMultipleBusquedaProfundidad(subarco));

            if (propiedad) return propiedad;

        });

        return null;

    }


}

