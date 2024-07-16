import { agentMessage } from "../../../../../../agentMessage";

import { error } from "console";
import { Buffer } from "buffer";

import { AlephIDE } from "./aleph-ide";

import { Base, COLUMNAS, CabeceraPC, Linea, LineaExterna } from "./dominio/arbol";
import { PC1 } from "./dominio/ejemplo";
import { GuidExterno, Guid, Valor, CriteriosSensor, FuncionCriterio, Diagnostico, Aferencia } from "./dominio/tipos";

export const i18_PROCESADOR_ESTADO_AS = {
    NOMBRE: "Procesador estado",
    CARGA: {
        CABECERA: "Analizando Cabecera",
        CUERPO: "Analizando Cuerpo",
        ERROR: "Error al procesar la cabecera. Ver ejemplo, formato esperado...",
        CALCULO_FUNCIONES: "Calculando funciones de criterio"
    },
    AFERENCIA: {
        INICIO: "Iniciando Aferencia",
        IDENTIFICACION_SENSOR: "Buscando sensor",
        ERROR_ID_S: "Sensor no encontrado",
        BUSCANDO_REGLAS: "Buscando reglas",
        PROCESANDO_CRITERIOS: "Procesando criterios",
        POSITIVOS: "Positivos encontrados",
    },
    RED: {
        INICIO: "Creando estructura de la red",
        TRABAJO: "Cargando datos",
        ERROR: "Error al procesar líneas. Ver ejemplo, formato esperado..."
    }
}

export class CargadorBaseExperta {

    ide: AlephIDE = new AlephIDE;

    componente: GuidExterno;
    alteracion: GuidExterno;
    tipo: GuidExterno;

    componentes_tabla: Map<Guid, any> = new Map();
    alteraciones_tabla: Map<Guid, any> = new Map();
    tipos_tabla: Map<Guid, any> = new Map();

    valores: Valor[] = [];
    valores_tabla: Map<Guid, GuidExterno> = new Map();
    sensores: CriteriosSensor[] = [];

    sensores_tabla: Map<Guid, GuidExterno> = new Map();
    sensores_reguladores_tabla: Map<Guid, GuidExterno> = new Map();
    sensores_criterios_tabla: Map<Guid, GuidExterno> = new Map();
    sensores_funciones_tabla: Map<Guid, FuncionCriterio > = new Map();

    intensidades: Map<string, string> = new Map();

    diagnosticos_tabla: Map<Guid, GuidExterno> = new Map();
    diagnosticos_pasos_tabla: Map<Guid, GuidExterno> = new Map();
    diagnosticos: Diagnostico[] = [];
    diagnosticos_ocurrencias: Map<string, any> = new Map();

    i18 = i18_PROCESADOR_ESTADO_AS;

    nombre = this.i18.NOMBRE;

    constructor(public dominio: Base) {

    }

    async crearBase(): Promise<boolean> {

        return new Promise(async (resolve, reject) => {
            console.log(agentMessage(this.nombre, this.i18.CARGA.CABECERA));

            try {
                this.cargarCabecera();
            } catch (error) {
                console.log(agentMessage(this.nombre, this.i18.CARGA.ERROR));
                console.log(agentMessage(this.nombre, error.message));
                console.log(CabeceraPC);
            }

            console.log(agentMessage(this.nombre, this.i18.CARGA.CUERPO));

            try {
                this.cargarLineas();
            } catch (error) {
                console.log(agentMessage(this.nombre, this.i18.CARGA.ERROR));
                console.log(agentMessage(this.nombre, error.message));
                console.log(PC1);
            }
            // console.log(this.dominio.red);
            // console.log(this.componentes_tabla);
            // console.log(this.alteraciones_tabla);
            // console.log(this.valores);
            // console.log(this.dominio.red.lineas);
            // console.log(this.dominio.red.lineas.map(l => l.diagnosticos));
            // console.log(this.dominio.red.lineas[0].diagnosticos);

/*
            try {
                console.log(agentMessage(this.nombre, this.i18.CARGA.CALCULO_FUNCIONES));
                this.ide.inicializar();
                const criterios = this.sensores_criterios_tabla.values();
                console.log(criterios)
                // await this.crearFunciones(criterios);
            } catch (error) {
                console.log(agentMessage(this.nombre, this.i18.CARGA.ERROR));
                console.log(agentMessage(this.nombre, error.message));
                console.log(PC1);
            }
*/
            resolve(true);
        })
    }

    cargarCabecera() {

        console.log(agentMessage(this.nombre, "\t - Cabecera: componente"));
        this.componente = this.dominio.cabecera[COLUMNAS.componente];

        console.log(agentMessage(this.nombre, "\t - Cabecera: alteracion"));
        this.alteracion = this.dominio.cabecera[COLUMNAS.alteracion];

        console.log(agentMessage(this.nombre, "\t - Cabecera: tipos_tabla"));
        this.tipo = this.dominio.cabecera[COLUMNAS.tipo];

        console.log(agentMessage(this.nombre, "\t - Cabecera: valores"));
        this.dominio.cabecera[COLUMNAS.valores].forEach(c => {

            const guid = this.agregarOrecuperar(this.valores_tabla, c);
            this.valores.push(guid);

        });

        console.log(agentMessage(this.nombre, "\t - Cabecera: sensores"));
        this.dominio.cabecera[COLUMNAS.sensores].forEach((c, i) => {

            console.log(agentMessage(this.nombre, `\t\t ${i} - Crear guid`));

            const sensorGuidExterno = Object.keys(c)[0]; // k = temperatura
            const guidSensor = this.agregarOrecuperar(this.sensores_tabla, sensorGuidExterno);

            const reguladorGuidExterno = Object.keys(c)[0]; // k = temperatura
            const guidRegulador = this.agregarOrecuperar(this.sensores_reguladores_tabla, reguladorGuidExterno);

            console.log(agentMessage(this.nombre, `\t\t ${i} - Almacenar`));
            this.sensores.push( { guidSensor, guidRegulador });

        });

        console.log(agentMessage(this.nombre, "\t - Cabecera: diagnosticos"));
        this.dominio.cabecera[COLUMNAS.diagnosticos].forEach(c => {

            const Guid = this.agregarOrecuperar(this.diagnosticos_tabla, c);

            this.diagnosticos.push(Guid);
        });

        this.dominio.red = {
            ENTIDADES:
                [
                    this.componente,
                    this.alteracion,
                    ...this.valores,
                    ...this.sensores,
                    ...Array.from(this.intensidades, ([name, value]) => name),
                    ...Array.from(this.diagnosticos, ([name, value]) => name)
                ],
            ESTRUCTURALES: {
                INSTANCIA: {
                    texto: "<clave> es instancia de <valor>",
                }
            }
        }
    }

    cargarLineas() {

        const errores: Error[] = [];
        this.dominio.red.lineas = [];
        this.dominio.lineas.forEach((l, i) => {
            try {
                this.procesarLinea(l, i);
            } catch (error) {
                console.log(agentMessage(this.nombre, `\t\t ${i} - Error al cargar línea: ${ error.message }`));
                errores.push(error.message);
            }
        })

        if (error.length > 0 ) {
            throw new Error(errores.join("\n\t -"));
        }
    }

    procesarLinea(l: LineaExterna, i: number) {

        const linea: Linea = {
            Guid: "",
            componente: "",
            alteracion: "",
            tipo: "",
            valores: [],
            sensores: [],
            diagnosticos:[]
        }

        linea.Guid = this.crearGuid(i.toString());

        console.log(agentMessage(this.nombre, `\t ${i} - Linea: Componente`));
        let clave = this.agregarOrecuperar(this.componentes_tabla, l[COLUMNAS.componente]);
        linea.componente = clave;

        console.log(agentMessage(this.nombre, `\t ${i} - Linea: Alteracion`));
        clave = this.agregarOrecuperar(this.alteraciones_tabla, l[COLUMNAS.alteracion]);
        linea.alteracion = clave;

        console.log(agentMessage(this.nombre, `\t ${i} - Linea: Tipo`));
        clave = this.agregarOrecuperar(this.tipos_tabla, l[COLUMNAS.tipo]);
        linea.tipo = clave;

        console.log(agentMessage(this.nombre, `\t ${i} - Linea: Valores`));
        l[COLUMNAS.valores].forEach((v, i) => {

            if (v) {
                console.log(agentMessage(this.nombre, `\t\t ${i} - Agregar valor`));
                const guidValor = this.valores[i];
                linea.valores.push(guidValor)
            }

        })

        console.log(agentMessage(this.nombre, `\t ${i} - Linea: sensores`));
        l[COLUMNAS.sensores].forEach((l, i) => {

            console.log(agentMessage(this.nombre, `\t\t ${i} - Crear regla de sensor`));
            if (l) {
                console.log(agentMessage(this.nombre, `\t\t\t ${i} - Crear guid criterio`));
                const guidCriterio = this.agregarOrecuperar(this.sensores_criterios_tabla, l);
                this.sensores_funciones_tabla.set(guidCriterio, (...args) => true)
                console.log(agentMessage(this.nombre, `\t\t\t ${i} - Almacenar criterio`));
                linea.sensores.push(guidCriterio);
            }

        })

        console.log(agentMessage(this.nombre, `\t ${i} - Linea: Diagnósticos`));
        l[COLUMNAS.diagnosticos].forEach((pasos, i) => {

            console.log(agentMessage(this.nombre, `\t\t ${i} - Agregar diagnóstico`));
            if (pasos && pasos.length > 0) {

                const guidsPasos = [];
                pasos.forEach((d) => {
                    const GuidPaso = this.agregarOrecuperar(this.diagnosticos_pasos_tabla, d);
                    guidsPasos.push(GuidPaso);
                });

                linea.diagnosticos.push(guidsPasos);
            } else {
                linea.diagnosticos.push([])
            }

        })
        this.dominio.red.lineas.push(linea);
    }

    agregarOrecuperar(map: Map<string, any>, valor: string): Guid {

        let existente = this.recuperar(map, valor);
        if (existente) return existente;
        // console.log("Buscar valor en mapa, no encontrado", valor, map)
        const clave = this.crearGuid(valor);
        // console.log(map)
        map.set(clave, valor);

        return clave;
    }

    recuperar(map: Map<string, any>, valor: string): Guid | null {

        // console.log("inicio recuperación", Object.keys(map), map.keys())
        let existente = Array.from(map.keys())
            .find(key => {
                /* console.log(`${map.get(key)} === ${valor}`);*/ return map.get(key) === valor
            });
        if (existente) return existente;

        return null;
    }

    crearGuid(datos: string): Guid {
        return Buffer.from(datos, 'binary').toString('base64').replace(/\=/g, "")
    }

    crearGuidObjeto(datos: object): Guid {
        return Buffer.from(JSON.stringify(datos), 'binary').toString('base64').replace(/\=/g, "")
    }

    /*
     * Método de aferencia:
     * Una vez importada la lista de criterios por sensor cuyas condiciones
     * están expresadas en lenguaje natural, solicitar al asistente una
     * conversión a funciones ts.
     *
     * VIA EN ESTUDIO
     *
     * Ejemplo de retorno:
     *
     * Prompt:
     *      "Dada una lista de especificaciones en lenguaje natural,
     *      devuelve una lista de funciones en typescript que las implementen.
     *      Las funciones se llamarán todas igual: FuncionCriterio.
     *      Modo JSON.
     *      Devuelve el campo 'funciones' con un Array válida de strings
     *      con el código listo para ejecutar con la instrucción eval.
     *      Cada posición de la lista debe ser el código de la función
     *      con cabecera correcta dentro de un string. Lista de especificaciones:
     *      ["tendencia decreciente con pérdida del 20% sobre Nmax",
     *      "tendencia creciente con pérdida del 80% sobre Nmin"]
     *
     * CHATGPT 3.5
     *
     *      "Las funciones en TypeScript correspondientes a las especificaciones
     *      proporcionadas son:\\n\\n1. Función para `tendencia decreciente`
     *      con pérdida del `20%` sobre `Nmax`:
     *
     * \\n```typescript\\nfunction FuncionCriterio(Nmax: number): boolean {
     * \\n    return Nmax * (1 - 0.2) < Nmax;\\n}\\n```
     * \\n\\n2. Función para `tendencia decreciente` con pérdida del `80%` sobre `Nmax`:
     * \\n```typescript\\nfunction FuncionCriterio(Nmax: number): boolean {
     * \\n    return Nmax * (1 - 0.8) < Nmax;\\n}\\n```
     * \\n\\n3. Función para `tendencia creciente` con ganancia del `20%` sobre `Nmin`:
     * \\n```typescript\\nfunction FuncionCriterio(Nmin: number): boolean {
     * \\n    return Nmin * (1 + 0.2) > Nmin;\\n}\\n```
     * \\n\\n4. Función para `tendencia creciente` con ganancia del `80%` sobre `Nmin`:
     * \\n```typescript\\nfunction FuncionCriterio(Nmin: number): boolean {
     * \\n    return Nmin * (1 + 0.8) > Nmin;\\n}
     * \\n```\\n\\nEstas funciones pueden ser ejecutadas usando la instrucción `eval`
     * en un entorno de ejecución de TypeScript.\"
     * 
     * VIA EN ESTUDIO Y REFINAMIENTO
     */
    async crearFunciones(guidCriterios: IterableIterator<GuidExterno>): Promise<any> {

        return new Promise(async (resolve, reject ) => {
            let mensaje = "Dada una lista de especificaciones en lenguaje natural, devuelve una lista de funciones en typescript que las implementen. Las funciones se llamarán todas igual: FuncionCriterio. Modo JSON. Devuelve el campo 'funciones' con un Array válida de strings con el código listo para ejecutar con la instrucción eval. Cada posición de la lista debe ser el código de la función con cabecera correcta dentro de un string. Lista de especificaciones: [";

            for(const g of guidCriterios) {
                mensaje += `'${g}',`;
            }
            mensaje = mensaje.slice(0, -1); // Remove last comma
            mensaje += "]"
            console.log(">>>>>>", mensaje)

            const claveFunciones = "claveFunciones";
            const funcionesCacheadas = this.ide.cache.leerLista(claveFunciones)

            if (funcionesCacheadas && funcionesCacheadas.length > 0) {
                console.log("Las funciones", funcionesCacheadas)
                resolve(true);
            }

            const res = await this.ide.trainer.crearHilo(
                {
                    assistant_id: this.ide.assistant.id,
                    solicitud: mensaje
                });

            if (res.ok) {
                console.log();
                console.log();
                console.log();

                console.log("OPENAPI:", res.data)
                console.log();
                console.log();
                console.log();

                const data = res.data.data.map(m => m.content.map(mm => JSON.stringify(mm)));
                console.log(agentMessage(this.nombre, res.data));
                console.log(agentMessage(this.nombre, data));
                console.log(data)

                this.ide.cache.guardar(claveFunciones, data);
                this.ide.cache.persistir();
            } else {
                console.log(agentMessage(this.nombre, res.data));
                console.log(res)
            }
            resolve(true);
        })

    }

    aferencia(estado: Aferencia) {

        console.log(agentMessage(this.nombre, this.i18.AFERENCIA.INICIO));

        console.log(agentMessage(this.nombre, `\t - ${this.i18.AFERENCIA.IDENTIFICACION_SENSOR}`));
        const sensor = this.recuperar(this.sensores_tabla, estado.GuidSensor);

        console.log(agentMessage(this.nombre, `\t\t - Sensor ${estado.GuidSensor}/${sensor}`));
        if (!sensor) {
            console.log(agentMessage(this.nombre, this.i18.AFERENCIA.ERROR_ID_S));
            console.log(this.sensores_tabla);
        }
        console.log(agentMessage(this.nombre, `\t - ${this.i18.AFERENCIA.BUSCANDO_REGLAS}`));
        const indiceSensor = this.sensores.findIndex(s => s.guidSensor === sensor);

        const reglas = this.dominio.red.lineas
            .filter(l => {
                if (l.sensores) {
                    return l.sensores[indiceSensor].length > 0
                }
            return false;
        });
        console.log(agentMessage(this.nombre, `\t\t - Reglas encontradas: ${reglas.length}`));

        console.log(agentMessage(this.nombre, this.i18.AFERENCIA.PROCESANDO_CRITERIOS));
        const positivos = reglas.filter(r => {

            const resultados: boolean[] = [];
            r.sensores.forEach(c => {
                const functionCriterio = this.sensores_funciones_tabla.get(c);
                const resultado = functionCriterio(estado.Lectura);
                resultados.push(resultado);
            })
            return resultados.filter(r => r === true).length > 0;
        })

        console.log(agentMessage(this.nombre, `\t\t - Positivos encontrados: ${positivos.length}`));

        console.log(agentMessage(this.nombre, this.i18.AFERENCIA.POSITIVOS));
        console.log(agentMessage(this.nombre, `\t - Lineas afectadas: ${positivos.length}`));

        positivos.forEach(p => {

            const c = this.componentes_tabla.get(p.componente);
            const t = this.tipos_tabla.get(p.tipo);
            const a = this.alteraciones_tabla.get(p.alteracion);

            console.log(agentMessage(this.nombre,
                `\t\t - ${c}/${t}/${a}, diag: ${p.diagnosticos.length}`));

            p.diagnosticos.forEach((d, i) => {

                const guidDiagnostico = this.diagnosticos[i];
                const diagnostico = this.diagnosticos_tabla.get(guidDiagnostico);
                console.log(agentMessage(this.nombre, `\t\t\t - ${i}: ${diagnostico}`));
                d.forEach((pasoGuid, ip) => {
                    const paso = this.diagnosticos_pasos_tabla.get(pasoGuid);
                    console.log(agentMessage(this.nombre, `\t\t\t\t - ${ip}: ${paso}`));
                })
            })
        })

    }
}
