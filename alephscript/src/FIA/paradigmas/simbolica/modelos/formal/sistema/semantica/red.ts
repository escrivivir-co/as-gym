import fs from 'fs'
import { Formal } from "../../paradigma";
import { agentMessage } from "../../../../../../agentMessage";
import { Traductor } from "../../../../../../i18/traductor";
import { IGrafo, Grafo } from "./grafo";
import { ReglaRed, TecnicasInferenciaRed } from "./regla";
import { ArcoEstructural, ArcoDescriptivo } from "./arco";
import { RelacionEstructural, EtiquetaEstructural, RelacionDescriptiva, EtiquetaDescriptiva } from "./etiqueta";
import { MotorInferencia } from "./motor-inferencia";
import { Dominio } from "../../../../../../mundos/dominio";
import { IModeloFormal } from "../../../../paradigma";
import { AS_SIMBOLICA_i18 } from "../../../../as-simbolica-i18";
import { ExportadorDeRed } from "./exportador-red";
import { Base } from '../base-experta/dominio/arbol';

export interface IRedSemantica extends IModeloFormal {

    baseR: Base;

    cargar(red: any, entidades: IGrafo[]): void;

    crearNodosEntidad(clave: string): void;
    crearArcosSubclase(clase_hija: string): void;
    crearArcosParteDe(clase_padre: string): void;
    crearArcosInstanciaDe(clase_hija: string): void;
    crearArcosDescriptivos(clase_padre: string): void;

}

export class RedSemantica extends Formal implements IRedSemantica {

    baseR: Base;

    crearNodosEntidad(clave: string) {
        // Creación de entidad
        const valor = this.baseR.red.ENTIDADES[clave];

        // Opcional: mapeo de valores por defecto
        const entidad = Object.assign(
            new Grafo(),
            {}
        );
        entidad.nombre = valor;

        console.log(agentMessage(this.nombre,
            `${this.i18.AGREGANDO_ENTIDADES_LABEL}${valor}`
        ));
        this.entidades.push(entidad);
    }

    crearArcosSubclase(clase_hija: string) {

        const etiqueta_texto = this.baseR.red.ESTRUCTURALES.SUBCLASE.texto;
        if (clase_hija === "texto") {
            return;
        }

        const existing = this.entidades.find(e => e.nombre === clase_hija);

        const grafoHija = existing || new Grafo();
        if (existing) {

        } else {
            this.entidades.push(grafoHija);
            grafoHija.nombre = clase_hija;
        }

        const padres = this.baseR.red.ESTRUCTURALES.SUBCLASE[clase_hija];

        Object.keys(padres).forEach(clase_padre => {

            const grafoPadre = this.entidades.find(e => e.nombre === clase_padre);

            if (!grafoPadre) {
                console.log(
                    "Error de integridad en CadenaFiaRedSemantica.ARCOS.ESTRUCTURALES.SUBCLASE",
                    ", padre no encontrado para la hija:",
                    clase_hija,
                    ", padre:",
                    clase_padre
                );
                return;
            }

            const relacion = new RelacionEstructural();
            relacion.nombre =  etiqueta_texto
                .replace("clave", grafoHija.nombre)
                .replace("valor", grafoPadre.nombre);

            relacion.valor = "subclase";

            const etiqueta = new EtiquetaEstructural();
            etiqueta.estado = relacion;

            const arco = new ArcoEstructural();
            arco.destino = grafoPadre;
            arco.etiqueta = etiqueta;
            grafoHija.arcos.estado.push(arco);

            console.log(agentMessage(this.nombre,
                `${this.i18.AGREGANDO_ARCOS_SUBCLASES_LABEL}${grafoHija.nombre}/${grafoPadre.nombre}`
            ));

        });

    }

    crearArcosParteDe(clase_padre: string) {

        const etiqueta_texto = this.baseR.red.ESTRUCTURALES.PARTE.texto;
        if (clase_padre === "texto") {
            return;
        }

        const existing = this.entidades.find(e => e.nombre === clase_padre);

        const grafoPadre = existing || new Grafo();
        if (existing) {

        } else {
            this.entidades.push(grafoPadre);
            grafoPadre.nombre = clase_padre;
        }

        const partes = this.baseR.red.ESTRUCTURALES.PARTE[clase_padre];

        Object.keys(partes).forEach(clase_hijo => {

            const existing2 = this.entidades.find(e => e.nombre === clase_hijo);

            const grafoHijo = existing2 || new Grafo();
            if (existing2) {

            } else {
                this.entidades.push(grafoHijo);
                grafoHijo.nombre = clase_hijo;
            }

            const relacion = new RelacionEstructural();

            relacion.nombre =  etiqueta_texto
                .replace("clave", grafoPadre.nombre)
                .replace("valor", grafoHijo.nombre);

            relacion.valor = "parte";

            const etiqueta = new EtiquetaEstructural();
            etiqueta.estado = relacion;

            const arco = new ArcoEstructural();
            arco.destino = grafoPadre;
            arco.etiqueta = etiqueta;
            grafoHijo.arcos.estado.push(arco);

            console.log(agentMessage(this.nombre,
                `${this.i18.AGREGANDO_ARCOS_PARTE_LABEL}${grafoHijo.nombre}/${grafoPadre.nombre}`
            ));

        });

    }

    crearArcosInstanciaDe(clase_hija: string) {

        const etiqueta_texto = this.baseR.red.ESTRUCTURALES.INSTANCIA.texto;
        if (clase_hija === "texto") {
            return;
        }

        const existing = this.entidades.find(e => e.nombre === clase_hija);

        const grafoHijo = existing || new Grafo();
        if (existing) {

        } else {
            this.entidades.push(grafoHijo);
            grafoHijo.nombre = clase_hija;
        }

        const padres = this.baseR.red.ESTRUCTURALES.INSTANCIA[clase_hija];

        Object.keys(padres).forEach(clase_padre => {

            const existing2 = this.entidades.find(e => e.nombre === clase_padre);

            const grafoPadre = existing2 || new Grafo();
            if (existing2) {

            } else {
                this.entidades.push(grafoPadre);
                grafoPadre.nombre = clase_padre;
            }

            const relacion = new RelacionEstructural();

            relacion.nombre =  etiqueta_texto
                .replace("clave", grafoHijo.nombre)
                .replace("valor", grafoPadre.nombre);

            relacion.valor = "instancia";

            const etiqueta = new EtiquetaEstructural();
            etiqueta.estado = relacion;

            const arco = new ArcoEstructural();
            arco.destino = grafoPadre;
            arco.etiqueta = etiqueta;
            grafoHijo.arcos.estado.push(arco);

            console.log(agentMessage(this.nombre,
                `${this.i18.AGREGANDO_ARCOS_INSTANCIA_LABEL}${grafoPadre.nombre}/${grafoHijo.nombre}`
            ));

        });

    }

    crearArcosDescriptivos(clase_padre: string) {

        const existing = this.entidades.find(e => e.nombre === clase_padre);

        const grafoPadre = existing || new Grafo();
        if (existing) {

        } else {
            this.entidades.push(grafoPadre);
            grafoPadre.nombre = clase_padre;
        }

        const partes = this.baseR.red.DESCRIPTIVOS[clase_padre];

        let parametros;
        Object.keys(partes).forEach(clase_hijo => {

            if (clase_hijo === "parametros") {
                const partes = this.baseR.red.DESCRIPTIVOS[clase_padre];
                parametros = partes[clase_hijo];
                return;
            }

            if (!parametros) {
                console.log("ERROR> Simbolica.Formal.Sistema.Semantica.CargarArcosDescriptivos.Error en el fichero de traducción. El primer nodo debe ser  'parametros'", clase_hijo);
                return;
            }

            const existing2 = this.entidades.find(e => e.nombre === clase_hijo);

            const grafoHijo = existing2 || new Grafo();
            if (existing2) {

            } else {
                this.entidades.push(grafoHijo);
                grafoHijo.nombre = clase_hijo;
            }

            const etiqueta_texto = partes[clase_hijo];

            const relacion = new RelacionDescriptiva();
            relacion.nombre =  new Traductor().crearTextoAyuda(clase_hijo, parametros, etiqueta_texto);;

            const etiqueta = new EtiquetaDescriptiva();
            etiqueta.estado = relacion;

            const arco = new ArcoDescriptivo();
            arco.destino = grafoPadre;
            arco.etiqueta = etiqueta;
            grafoHijo.arcos.estado.push(arco);

            console.log(agentMessage(this.nombre,
                `${this.i18.AGREGANDO_ARCOS_DESCRIPTIVOS_LABEL}${grafoHijo.nombre}/${grafoPadre.nombre}`
            ));

        });

    }

    i18 = AS_SIMBOLICA_i18.SIMBOLICA.SEMANTICA;

    entidades: IGrafo[] = [];

    nombre = this.i18.NOMBRE;

    base = new Grafo();
    motor = new MotorInferencia();

    cargar(red: any) {

        this.base = red;

        const entidades = this.entidades; // árbol a grafo
        /**
         * Añadir entidades maestras
         */
        Object.keys(red.ENTIDADES).forEach(clave => this.crearNodosEntidad(clave));

        /**
         * Añadir entidades del arco "subclase-de"
         */
        Object.keys(red.ARCOS.ESTRUCTURALES.SUBCLASE).forEach(clase_hija => this.crearArcosSubclase(clase_hija));

        /**
        * Añadir entidades del arco "parte-de"
        */

        Object.keys(red.ARCOS.ESTRUCTURALES.PARTE).forEach(clase_padre => this.crearArcosParteDe(clase_padre));

        /**
        * Añadir entidades del arco "instancia-de"
        */
        Object.keys(red.ARCOS.ESTRUCTURALES.INSTANCIA).forEach(clase_hija => this.crearArcosInstanciaDe(clase_hija));

        /**
        * Añadir entidades del arco "descriptivo"
        */
        Object.keys(red.ARCOS.DESCRIPTIVOS).forEach(clase_padre => this.crearArcosDescriptivos(clase_padre));

        /**
         * Convertir las entidades hoja en hijas de un nodo raíz
         */
        this.base = new Grafo();
        this.base.nombre = this.nombre;

        this.entidades/*.filter(e => e.arcos.estado.length == 0)*/.forEach(
            e =>
            {
                const relacion = new RelacionEstructural();

                relacion.nombre =  "relacion.raiz";
                relacion.valor =  "Terminal";

                const etiqueta = new EtiquetaEstructural();
                etiqueta.estado = relacion;

                const arco = new ArcoEstructural();
                arco.destino = e;
                arco.etiqueta = etiqueta;
                this.base.arcos.estado.push(arco);
        });

        const v = new ExportadorDeRed();
        fs.writeFileSync(__dirname + '/vistas/d3/files/arbol.json', JSON.stringify(v.comoArbolJSON(this.base), null, "\t"));

        this.entidades.push(this.base);
        fs.writeFileSync(__dirname + '/vistas/d3/red.json', v.comoListaJSON(this.entidades));

        fs.writeFileSync(__dirname + '/vistas/d3/semantica-ul.html', v.comoHTMLArbol(this.base));

        console.log(agentMessage(this.nombre,
            `
            - http://localhost:8080/semantica-arbol.html
            - http://localhost:8080/semantica-grafo.html
            - http://localhost:8080/semantica-ul.html`
        ));

        /* 
        
        console.log(agentMessage(this.nombre, "Escrito el árbol en: " + __dirname)); */
    }

    async probar(casos: object[]): Promise<string> {

        return new Promise(async (resolve, reject) => {

            console.log(agentMessage(this.nombre, `${this.i18.TEST.PROBAR_START_LABEL}:${""}`));

            /**
             *  Encolado de casos a probar
             * */
            [casos[2]].forEach((c, index) => {

                // console.log(agentMessage(this.nombre, `${this.i18.TEST.CASO.START_LABEL}:${index}`));

                const regla = new ReglaRed();
                const parametros = new Dominio(c);

                regla.configurarV2(this.entidades, TecnicasInferenciaRed.herencia, this.base, parametros);

                /*console.log(agentMessage(this.nombre,
                    `${this.i18.TEST.CASO.BUCLE.CREAR_REGLA_LABEL}:${index} con ${regla.imprimir()}`
                ));*/

                this.motor.reglas.push(regla);

            });

            /**
             *  Capturar evento de parada
             * */
            this.motor.trasDetenerse(() => {
                console.log(agentMessage(this.nombre, `${this.i18.TEST.PROBAR_END_LABEL}:${""}`));
                resolve("> forma.sistema.semantica.paradigma.RedSemantica.probar, finalizó con éxito");
            });

            /**
             *  Condición de salida
             * */
            setTimeout(
                () => reject("forma.sistema.semantica.paradigma.RedSemantica.probar, tiempo expirado!")
                , 5000
            );

            /**
             *  Arrancar la cola de inferencias
             * */
            await this.motor.arrancar((info) => {
                console.log(
                    agentMessage(this.nombre,
                        `${this.i18.TEST.CASO.BODY_LABEL} 
                        -  http://localhost:8080/
                        ${info}`));
            });

        });

    }

}