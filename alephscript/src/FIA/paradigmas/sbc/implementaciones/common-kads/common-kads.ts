import { IDiccionarioI18 } from "../../../../genesis-block";
import { IModelo } from '../../../../mundos/modelo';
import { agentMessage } from "../../../../agentMessage";
import { AS_COMMON_KADS_I18 } from "./as-common-kads-i18";
import { ISistema, SistemaRuntime } from "./sistema";
import { ICKNivelArtefactual, CKNivelArtefactual } from "./nivel/nivel-artefactual";
import { ICKNivelConceptual, CKNivelConceptual, ICKModeloConceptual } from "./nivel/nivel-conceptual";
import { IAlternativa, IObjetivo, ICKNivelContextual, CKNivelContextual } from "./nivel/nivel-contextual";
import { IModeloComunicaciones } from "./modelos/comunicacion/modelo-comunicaciones";
import { IEstadoT, EstadoT } from "./estado";

import { createGenerator, Config, TypeFormatter } from 'ts-json-schema-generator';


const fi18 = AS_COMMON_KADS_I18.COMMON_KADS.CK;
export enum CKFases {
    Nivel = "",
    NivelContextual = fi18.FASES.CONTEXTUAL.NOMBRE as any,
    NivelConceptual = fi18.FASES.CONCEPTUAL.NOMBRE as any,
    NivelArtefactual = fi18.FASES.DISENYO.NOMBRE as any,
    Monitorizacion = fi18.EJECUCION.NOMBRE as any
}

const etiqueta = "Explica en qué consiste el formulario de CommonKADS con nombre: ID. ";
const campo = "{ nombre: string, descripcion: string }";
const formulario = " { formulario { tipo: 'commonKADS', 'id': <id>,  campos_habituales: [" + campo + "] }";
const texto = "Devuelve { descripcion: '<formato markdown>' formulario: '" + formulario + "'}";
export const SolicitarExplicarFormulario = etiqueta + "Modo JSON activado, responde solo con el JSON. " + texto;

const etiquetaR = "Acompaña al usuario para rellenar el formulario: ID";
const textoR = "Una vez el usuario ha rellenado todos los campos, responde llamando a la función ProcesarFormulario(formulario)";
export const SolicitarRellenarFormulario = etiquetaR + "Modo JSON activado, responde solo con el JSON. " + textoR;

export interface IEspecificacion {

    conceptual: ICKModeloConceptual,
    comunicacion: IModeloComunicaciones

    comoJSON: () => Object;

}

export interface IFase {

    fase: CKFases;

    estado: IEstadoT<IModelo>;

    alternativas: IAlternativa[];

    objetivo: IObjetivo;

    especificacion: IEspecificacion;

    sistema: ISistema;

    imprimir(): string;

    llamada?: Subscription;

    solicitar?: Subject<IFase>;

    esperando?: boolean;
}

export const CK_FASE_clave = "CK_FASE_clave";

/**
 * Knowledge Acquisition and Design Structuring
 *
 * para el desarrollo SBC
 *
 */
export interface ICK {

    nombre: string;

    i18: IDiccionarioI18;

    nivel1: ICKNivelContextual;
    nivel2: ICKNivelConceptual;
    nivel3: ICKNivelArtefactual;

    instanciar(m: IMundo): Promise<IEstadoT<IModelo>>;

    modeloOrganizacion(f: IFase): IFase;
    modeloConceptual(f: IFase): IFase;
    modeloDisenyo(f: IFase): IFase;

    monitorizacion(f: IFase): Promise<IEstadoT<IModelo>>;

    imprimirFase(f: IFase): any;
}

export const CKCACHE_Clave = "CJKCACHE";

export const EXTERNAL_CACHE = "EXTERNAL_CACHE";


export class CK implements ICK {

    i18 = AS_COMMON_KADS_I18.COMMON_KADS.CK;

    nombre = this.i18.NOMBRE;

    nivel1 = new CKNivelContextual();
    nivel2 = new CKNivelConceptual();
    nivel3 = new CKNivelArtefactual();

    constructor() {}

    inited: false;

    async instanciar(m: IMundo, ide?: AlephScriptIDE): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            let c;
            let fase: IFase;

            m.elMundoAcabara.subscribe(s => resolve(fase?.estado));

            const e = m.eferencia.subscribe(async m => {

                e.unsubscribe();

                console.log(agentMessage(this.nombre, this.i18.CABECERA));
                const rt = new RTCache();
                fase = rt.leer(CK_FASE_clave);

                console.log("/******************** CARGA OBJETO FASE **************************** */")
                fase = fase || {

                    fase: CKFases.Nivel,
                    estado: new EstadoT<IModelo>(m.modelo),

                    alternativas: [],

                    objetivo: null,
                    especificacion: null,

                    sistema: null,

                    imprimir: () => this.imprimirFase(fase),

                };

                console.log("/******************** CARGA DEL IDE **************************** */")
                ide = m.modelo.dominio.base[IDE_clave];

                if (ide) {

                    const s = ide.actionServer.subscribe(f => {
                        rt.guardar(CK_FASE_clave, this.comoJSON(f));
                    });

                    console.log("ADD TO IDE ACTION SERVER!!!!")
                    c = await this.cicloAsync(fase, ide.actionServerS);
                    console.log("FIN ADD TO IDE ACTION SERVER!!!!", m.modelo.dominio.base[IDE_clave])
                    s.unsubscribe();
                } else {
                    console.log("NO IDE!!!!", m.modelo.dominio.base[IDE_clave])
                    c = await this.ciclo(fase);
                }

                /**
                 * LAST CALL TO MODEL STORAGE AFTER FINISHED FULL PROCESS
                 */
                console.log("/******************** FINALIZA EL COMMON KADS **************************** */")

                resolve(c);
            });
        })

    }

    modeloOrganizacion(f: IFase): IFase {

        console.log("/******************** MODELO DE ORGANIZACION **************************** */")
        // console.log(f.estado.modelo);

        f.fase = CKFases.NivelContextual;

        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.CONTEXTUAL.NOMBRE}`
        ));

        f.alternativas = this.nivel1.estudioViabilidad(f.estado.comoModelo());

        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.CONTEXTUAL.VIABILIDAD}:
             ${f.alternativas[0].organizacion.imprimir()}`
        ));

        if (f.alternativas.length == 1) {
            f.esperando = true;
        }

        f.objetivo = this.nivel1.estudioImpactoYMejoras(f.alternativas);
        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.CONTEXTUAL.IMPACTO}:
             ${f.objetivo.tareas.imprimir()},
             ${f.objetivo.agentes.imprimir()}`
        ));

        console.log(agentMessage(this.nombre,
            `${this.i18.CONSTRUCCION}: ${f.fase}: ${f.objetivo.conclusiones(f.estado.comoModelo()).imprimir()}`));
        f.solicitar.next(f);
        return f;

    }

    modeloConceptual(f: IFase): IFase {

        f.fase = CKFases.NivelConceptual;

        console.log("/******************** MODELO DE CONCEPTUAL **************************** */")
        console.log(f.objetivo.ota.dominio.base[Estudio.claveDominio])

        console.log("/******************** MODELO DE CONCEPTUAL **************************** */")

        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.CONCEPTUAL.NOMBRE}`
        ));

        const conceptual = this.nivel2.modeloConocimiento(f.objetivo.ota);
        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.CONCEPTUAL.CONOCIMIENTO}:
             ${conceptual.conocimiento.imprimir()}, ${conceptual.uml.imprimir()}, ${conceptual.cml.imprimir()}.`
        ));
        const comunicacion = this.nivel2.modeloComunicaciones(conceptual);
        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.CONCEPTUAL.COMUNICACIONES}:
             ${comunicacion.comunicacion.imprimir()}`
        ));

        f.especificacion = {
            conceptual,
            comunicacion,
            comoJSON: () => {
                return {
                    conceptual: conceptual.comoJSON(),
                    comunicacion: comunicacion.comoJSON()
                }
            }
        }

        console.log(agentMessage(this.nombre, `${this.i18.FASES.CONCEPTUAL.ESPECIFICACION}`));
        console.log(agentMessage(this.nombre, `${this.i18.CONSTRUCCION}: ${f.fase}`));


        const cache = new RTCache();
        cache.recuperar();

        const c = new RTCache();
        c.archivo = CONST_CORPUS_PATH + 'corpus/sbc.kads.app.json';

        const snapshot = (cache.dominio.base[CKCACHE_Clave]) as IFase;
        snapshot.fase = f.fase;

        c.dominio.base = snapshot;
        c.persistirRuta();

        const as = new AlephScriptBoilerplate();
        as.init();
        c.archivo = path.join(as.app.baseFolder, as.app.appFolder, "Build_0001.aleph");
        c.persistirRuta();

        return f;
    }

    modeloDisenyo(f: IFase): IFase {

        f.fase = CKFases.NivelArtefactual;

        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.DISENYO.NOMBRE}`
        ));

        f.sistema = this.nivel3.sistema(f.especificacion);
        console.log(agentMessage(this.nombre,
            `${this.i18.FASES.DISENYO.NOMBRE}:
             ${f.sistema.disenyo.imprimir()}.`
        ));

        console.log(agentMessage(this.nombre, `${this.i18.CONSTRUCCION}: ${f.fase}`));

        return f;

    }

    async monitorizacion(f: IFase): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            f.fase = CKFases.Monitorizacion;

            console.log(agentMessage(this.nombre,
                `${this.i18.EJECUCION.CABECERA}`
            ));

            try {
                const c = new SistemaRuntime(f.sistema);
                c.monitor.subscribe(notificacion => {
                    agentMessage(this.i18.NOMBRE, `${this.i18.EJECUCION.CUERPO}${notificacion}`)
                });

                const resultado = await c.ejecutar();
                resolve(resultado);

            } catch(ex) {

                reject(ex.message);

            }
            console.log(agentMessage(this.nombre, this.i18.EJECUCION.PIE));

        });
    }

    async ciclo(f: IFase): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            switch(f.fase) {
                case CKFases.Nivel:
                    f = this.modeloOrganizacion(f);
                    await this.ciclo(f);
                    break;
                case CKFases.NivelContextual:
                    f = this.modeloConceptual(f);
                    await this.ciclo(f);
                    break;
                case CKFases.NivelConceptual:
                    f = this.modeloDisenyo(f);
                    await this.ciclo(f);
                    break;
                case CKFases.NivelArtefactual:
                    const r = await this.monitorizacion(f);
                    await this.ciclo(f);
                    break;
                case CKFases.Monitorizacion:
                default:
                    f.fase = CKFases.Nivel;
            }
            resolve(f.estado);
        })
    }

    imprimirFase(f: IFase): any {

        switch(f.fase) {
            case CKFases.Nivel:
                return null;

            case CKFases.NivelContextual:
                return SolicitarExplicarFormulario.replace("ID", this.nivel1.organizacion.formularios[0].nombre);
                break;
            case CKFases.NivelConceptual:
                return JSON.stringify(this.nivel2.comoJSON());
                break;
            case CKFases.NivelArtefactual:
                return JSON.stringify(this.nivel3.comoJSON());
                break;
            case CKFases.Monitorizacion:
            default:
                return "";
        }

    }

    comoJSON(fase: IFase) {
        return {

            fase: fase.fase,

            estado: fase.estado.comoModelo().estado,

            alternativas: fase.alternativas.map(a => a.comoJSON()),

            objetivo: fase.objetivo?.comoJSON(),

            especificacion: fase.especificacion?.comoJSON(),

            sistema: fase.sistema?.comoJSON()
        }
    }

    async cicloAsync(fase: IFase, llamada: Subject<IFase>): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            fase.solicitar = llamada;

            const s = llamada.asObservable().subscribe(async f => {

                console.log(agentMessage(this.nombre, "AVANCE DE ESTADO: " + (f.fase || ' -- ') + " Esperando: " + ( f.esperando || ' -- ' )));

                if (f.esperando) {
                    return;
                }

                switch(f.fase) {
                    case CKFases.Nivel:
                        f = this.modeloOrganizacion(f);
                        break;
                    case CKFases.NivelContextual:
                        f = this.modeloConceptual(f);
                        break;
                    case CKFases.NivelConceptual:
                        f = this.modeloDisenyo(f);
                        break;
                    case CKFases.NivelArtefactual:
                        const r = await this.monitorizacion(f);
                        break;
                    case CKFases.Monitorizacion:
                    default:
                        if (f.llamada) f.llamada.unsubscribe();
                        resolve(f.estado);
                        f.fase = CKFases.Nivel;
                }
            })
            fase.llamada = s;
            llamada.next(fase);
        })
    }

    // TODO
    obtenerSchemaReferencia(): any {

        const keys = Reflect.ownKeys(CK.prototype);

		return keys;
	}

    // TODO
    async generarEsquema() {
        const configuracion: Config = {
          path: path.resolve(__dirname, 'test.ts'),
          tsconfig: "<path>tsconfig.json",
          type: '*',
          jsDoc: 'extended',
          expose: 'all',
        };

        const generator = createGenerator(configuracion);

        const esquema = generator.createSchema(configuracion.type);

        return esquema.definitions;

    }

}

import { BaseType, Definition, FunctionType, SubTypeFormatter } from "ts-json-schema-generator";
import { Subject, Subscription } from "rxjs";
import { AlephScriptIDE, CONST_CORPUS_PATH } from "../../../../aplicaciones/ide/aleph-script-idle";
import { IDE_clave } from "../../../conexionista/modelos-lenguaje/oai/Trainer_key";
import { RTCache } from "../../../../engine/kernel/rt-cache";
import path from "path";
import { IMundo } from "../../../../mundos/mundo";
import { Estudio } from "../../estudio";
import { AlephScriptBoilerplate } from "../../../../../as-seed/guest/main";

export class MyFunctionTypeFormatter implements SubTypeFormatter {
    // You can skip this line if you don't need childTypeFormatter
    public constructor(private childTypeFormatter: TypeFormatter) {}
    getChildren(type: BaseType): BaseType[] {
        return []
    }

    public supportsType(type: FunctionType): boolean {
        return type instanceof FunctionType;
    }

    public getDefinition(type: FunctionType): Definition {
        // Return a custom schema for the function property.
        // TODO
        return {
            type: "object",
            properties: {
                isFunction: {
                    type: "boolean",
                    const: true,
                },
            },
        };
    }


}


