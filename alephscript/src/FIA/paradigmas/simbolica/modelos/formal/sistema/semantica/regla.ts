import { i18 } from "../../../../../../i18/aleph-script-i18";
import { IInferencia } from "../../../../inferencia";
import { IReglaRed } from "../../../../regla";
import { InferenciaRelacion } from "../../inferencia/relacion/paradigma";
import { EtiquetaDescriptiva, EtiquetaEstructural } from "./etiqueta";
import { IBusqueda, IEstado, IGrafo } from "./grafo";

export enum InferenciaHerencia {
    instancia,
    subclase,
    parte
}

export enum TecnicasInferenciaRed {

    equiparacion,
    herencia
}

export interface IPregunta {

    esperado: boolean;
    texto: string;
    constantes: IGrafo[];
    variables: IGrafo[];
    arcos: string[];

}

export interface IApunte {

    tipo: TecnicasInferenciaRed;

    red: IGrafo;

    pregunta: IPregunta;

}

export class Apunte implements IApunte {

    tipo: TecnicasInferenciaRed;
    red: IGrafo;
    pregunta: IPregunta;

}

export class ApunteEquiparacion extends Apunte {

    /**
     * Equiparación: un fragmento de red, apunte o consulta se equipara
     * con una red semántica si se puede asociar con un fragmento de esta
     * última. Para ello se construye un apunte o fragmento de red con
     *  la consulta, se coteja o superpone ese apunte con la base de
     * conocimiento, se ligan los nodos variables del apunte con nodos
     * constantes de la red semántica, y por último, se devuelve como
     * resultado el apunte con los valores ligados.
     */
    tipo = TecnicasInferenciaRed.equiparacion;

 /**
     * Intenta equiparar el apunte con un fragmento de la red semántica.
     * @param {IApunte} apunte El apunte a inferir.
     * @returns {Promise<IApunte>} El apunte con los resultados de la inferencia.
     */
    async inferir(apunte: IApunte): Promise<IApunte> {
        // Itera sobre cada variable en la pregunta del apunte.
        for (const variable of apunte.pregunta.variables) {
            // Busca correspondencias en la red para la variable actual.
            const correspondencias = this.buscarCorrespondencias(variable, apunte.red);
            // Si se encuentran correspondencias, actualiza el apunte con estas ligaduras.
            if (correspondencias.length > 0) {
                apunte = this.ligarVariablesConConstantes(apunte, variable, correspondencias[0]);
            }
        }
        // Devuelve el apunte actualizado con todas las ligaduras realizadas.
        return apunte;
    }

    buscarCorrespondencias(variable: IGrafo, red: IGrafo): IGrafo[] {
        let correspondencias: IGrafo[] = [];

        // Recorrer todos los arcos del grafo.
        for (let arco of red.arcos.estado) {
            // Verificar si el arco es descriptivo o estructural y si coincide con la variable.
            if (arco.etiqueta instanceof EtiquetaDescriptiva && arco.etiqueta.estado.valor === variable.nombre) {
                correspondencias.push(arco.destino);
            } else if (arco.etiqueta instanceof EtiquetaEstructural && arco.etiqueta.estado.valor === variable.nombre) {
                correspondencias.push(arco.destino);
            }
        }

        return correspondencias;
    }

    ligarVariablesConConstantes(apunte: IApunte, variable: IGrafo, correspondencia: IGrafo): IApunte {
        // Suponiendo que necesitamos actualizar las constantes o variables dentro de la pregunta del apunte,
        // buscamos la correspondencia basada en el nombre de la variable y actualizamos su valor con el 'nombre' del IGrafo correspondiente.

        // Actualizar constantes
        const constanteIndex = apunte.pregunta.constantes.findIndex(c => c.nombre === variable.nombre);
        if (constanteIndex !== -1) {
            // Actualizar el valor de la constante con el nombre del nodo correspondiente en la red.
            apunte.pregunta.constantes[constanteIndex].nombre = correspondencia.nombre;
        }

        // Actualizar variables (si aplicable)
        const variableIndex = apunte.pregunta.variables.findIndex(v => v.nombre === variable.nombre);
        if (variableIndex !== -1) {
            // Similar a las constantes, pero dependiendo de la lógica específica de tu aplicación,
            // podrías querer actualizar la variable de alguna manera especial.
            apunte.pregunta.variables[variableIndex].nombre = correspondencia.nombre;
        }

        return apunte;
    }

}

export class ApunteHerencia extends Apunte {

    /**
     * Herencia de propiedades: se basa en el modus ponens,
     * y permite que nodos específicos de una red accedan a
     * las propiedades definidas en otros nodos usando los arcos
     * instancia y subclase-de. Para buscar si es cierta una sentencia
     * sobre un atributo de una entidad, se busca el nodo entidad,
     *  y se mira si desde ahí sale un arco con la etiqueta del atributo
     *  que buscamos. SI no existe, se buscan arcos instancia y se “sube”
     *  hacia la entidad superior, se busca ahí y si no esta se tira de
     * arcos subclase-de de forma sucesiva. Si hay varias opciones,
     * se hereda el valor de la propiedad del nodo más cercano al nodo
     * que sirvió como punto de partida a la inferencia.
     */
    tipo = TecnicasInferenciaRed.herencia;

    async inferir(a: IApunte) {

        const problemas = a.pregunta.variables.map(async (v, i) => {

            const camino: IGrafo[] = [];
            const b: IBusqueda = {
                etiqueta: a.pregunta.arcos[i],
                destino: a.pregunta.constantes[i].nombre,
                camino,
                encontrado: false
            }
            let solucion = await v.encontrar(b);
            while(solucion && !b.encontrado) {
                solucion = await solucion.encontrar(b);
            }

            return b;
        });
        const parciales = await Promise.all(problemas);
        // console.log("PARCI", parciales)
        const solucion = parciales.find(s => s.encontrado === a.pregunta.esperado);
        // console.log("PARCI SOL", solucion)
        if (!solucion) {
            console.log(a.pregunta.constantes, a.pregunta.variables)
            return `\n\t - ¡ERROR! Se esperaba: ${a.pregunta.esperado}, se obtuvo: ${solucion}`;
        }
        return `\n\t - Respuesta: ${solucion.camino.map(c => c.imprimir()).join("\t - ")}`;
    }
}

export class ApunteHerencia2 extends Apunte {

    /**
     * Herencia de propiedades: se basa en el modus ponens,
     * y permite que nodos específicos de una red accedan a
     * las propiedades definidas en otros nodos usando los arcos
     * instancia y subclase-de. Para buscar si es cierta una sentencia
     * sobre un atributo de una entidad, se busca el nodo entidad,
     *  y se mira si desde ahí sale un arco con la etiqueta del atributo
     *  que buscamos. SI no existe, se buscan arcos instancia y se “sube”
     *  hacia la entidad superior, se busca ahí y si no esta se tira de
     * arcos subclase-de de forma sucesiva. Si hay varias opciones,
     * se hereda el valor de la propiedad del nodo más cercano al nodo
     * que sirvió como punto de partida a la inferencia.
     */
    tipo = TecnicasInferenciaRed.herencia;

    async inferir(apunte: IApunte): Promise<IApunte> {
        // Suponemos que cada pregunta tiene una lista de constantes y variables que quieren ser resueltas
        // a través de herencia.
        for (let constante of apunte.pregunta.constantes) {
            // Buscar la propiedad en la red, comenzando por el nodo actual.
            let propiedad = this.buscarPropiedad(constante, apunte.red);

            // Si la propiedad es encontrada, actualizar la constante con el valor encontrado.
            if (propiedad) {
                constante.nombre = propiedad.valor; // Actualizar el valor de la constante.
            }
        }

        return apunte;
    }

    buscarPropiedad(constante: IGrafo, nodoActual: IGrafo): IEstado | null {
        // Verificar si el nodo actual contiene la propiedad buscada.
        let propiedad = this.obtenerPropiedadDesdeNodo(constante.nombre, nodoActual);

        if (propiedad) {
            return propiedad;
        }

        // Si no se encuentra en el nodo actual, buscar en nodos relacionados a través de arcos 'instancia' y 'subclase-de'.
        for (let arco of nodoActual.arcos.estado) {
            if (arco.etiqueta.estado.valor === 'instancia' || arco.etiqueta.estado.valor === 'subclase') {
                propiedad = this.buscarPropiedad(constante, arco.destino);

                if (propiedad) {
                    return propiedad; // Retornar la primera coincidencia encontrada.
                }
            }
        }

        return null; // Si no se encuentra la propiedad en ninguna parte de la jerarquía.
    }

    obtenerPropiedadDesdeNodo(nombrePropiedad: string, nodo: IGrafo): IEstado | null {
        // Buscar en arcos descriptivos si alguno contiene la propiedad buscada.
        for (let arco of nodo.arcos.estado) {
            if (arco.etiqueta instanceof EtiquetaDescriptiva) {
                // Para EtiquetaDescriptiva, comparar el valor de la relación con el nombre de la propiedad buscada.
                if (arco.etiqueta.estado.nombre === nombrePropiedad) {
                    // Retornar un objeto IEstado simulado que representa la propiedad encontrada.
                    return { nombre: arco.etiqueta.estado.nombre, valor: arco.etiqueta.estado.valor };
                }
            }
        }

        // Si la propiedad no se encuentra en los arcos descriptivos, podría considerarse buscar en arcos estructurales,
        // aunque generalmente las propiedades están en los descriptivos. La lógica adicional iría aquí.

        // Si la propiedad no se encuentra, retornar null.
        return null;
    }

}

export class ReglaRed extends InferenciaRelacion implements IReglaRed {

    apunte: IApunte;

    enunciado(): string {

        const p = this?.apunte?.pregunta;

        if (!p) return "No inicializado";

        return `${p.texto} ¿${p.esperado}?: ${i18.SIMBOLICA.SEMANTICA.INFERENCIA_NATURAL_LABEL
                .replace("<clave", this.tipo.toString())
                .replace("<constantes>", p.constantes.map(c => c.nombre).join(" - "))
                .replace("<variables>", p.variables.map(c => c.nombre).join(" - "))
                .replace("<arcos>", p.arcos.join(" - "))
                .replace("<entidades>", this.apunte.red.nombre)}`;
    }

    async evaluar(): Promise<IInferencia> {

        this.apunte = this.analizarParametros();

        switch(this.tipo) {
            case TecnicasInferenciaRed.equiparacion:

                const apunteEquiparacion = new ApunteEquiparacion();
                console.log("¡Acabado!")

                break;
            case TecnicasInferenciaRed.herencia:

                const apunteHerencia = new ApunteHerencia();
                this.dominio[this.claveSalida] = `${this.enunciado()} \t - ${await apunteHerencia.inferir(this.apunte)}`;
                break;
            default:
                console.log("¡Acabado3!")
                //
        }

        return this;
    }

    analizarParametros(): IApunte {

        const activar = this.activar();
        const c = activar.parametros;

        // console.log("Inicia analisis de parametros");

        const texto = c["texto"];
        const esperado = c["esperado"];
        const arcos = Object.keys(c).filter(a => a != "texto" && a != "esperado");

        // console.log("01: arcos", arcos);

        const variables = arcos.map(arco => Object.keys(c[arco]).map(variable => { return { arco, variable }})).flat();

        // console.log("02: variables", variables);

        const constantes = variables.map((ct: { arco: string, variable: string }) => c[ct.arco][ct.variable]).map(cl => Object.keys(cl)[0]);

        // console.log("03: constantes", constantes);

        const e = activar.contexto.entidades;
        const clavesAObjetos = (claves: string[]) => claves
            .map(cl => { const ee = e.find(i => cl === i.nombre); if (!ee) console.log("no for", cl); return ee});

        return {

            tipo: this.tipo,

            red: activar.contexto.raiz,

            pregunta: {
                esperado,
                texto,
                constantes: clavesAObjetos(constantes),
                variables: clavesAObjetos(variables.map(v => v.variable)),
                arcos
            }
        }

    }
}