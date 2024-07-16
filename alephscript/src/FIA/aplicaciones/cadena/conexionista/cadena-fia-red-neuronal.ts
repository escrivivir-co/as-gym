import { i18 } from "../../../i18/aleph-script-i18";
import { RedNeuronalArtificial } from "../../../paradigmas/conexionista/red-neuronal";
import { agentMessage } from "../../../agentMessage";
import { CadenaFIAConexionista } from "./cadena-fia-conexionista";
import { CadenaInferenciaLenguajeNatural as CadenaReglaLenguajeNatural } from "./cadena-inferencia-lenguaje-natural";
import { ApiState, STATES } from '../../../paradigmas/conexionista/modelos-lenguaje/oai/api';
import { PromptBase } from "../../../paradigmas/conexionista/modelos-lenguaje/inferencia-oai";
import { Dominio } from "../../../mundos/dominio";

export class CadenaRedNeuronal extends RedNeuronalArtificial {}

export class CadenaFiaRedNeuronal extends CadenaFIAConexionista {

    modelo = new CadenaRedNeuronal();
    nombre = i18.APPS.CADENA.CONEXIONISTA.RED.NOMBRE;

    async instanciar(): Promise<string> {

        console.log(agentMessage(this.nombre, i18.APPS.CADENA.CONEXIONISTA.SIMULATION_START));

        await this.cargaRed();

        console.log(
            agentMessage(this.nombre, `${i18.APPS.CADENA.SIMULATION_BODY}:${this.imprimir()}`)
        );

        await this.mundo.alAcabar(this.nombre);

        console.log(agentMessage(this.nombre, `${i18.APPS.CADENA.CONEXIONISTA.SIMULATION_END}`));
        return "";
    }

    async cargaRed() {

        this.mundo.agregarAferencia(this.modelo.eventos.asObservable());

        this.mundo.eferencia.subscribe(async (m) => {

            console.log(
                agentMessage(
                    this.nombre,
                    i18.APPS.CADENA.CONEXIONISTA.AFERENCIA
            ));
            await this.probar();

        });

    }

    async probar(): Promise<void> {

        return new Promise((resolve, reject) => {

            const c = i18.APPS.CADENA.CONEXIONISTA.NEURONAL.PROMPTS;
            const prompts: PromptBase = {
                system: {
                    background: c.SYSTEM.BACKGROUND,
                    format: c.SYSTEM.FORMAT
                },
                assistant: {
                    cache: c.ASSISTANT.CACHE,
                    archive: c.ASSISTANT.ARCHIVE
                },
                user: {
                    analytics: c.USER.ANALYTICS,
                    prompt: c.USER.PROMPT
                }
            };

            const regla = new CadenaReglaLenguajeNatural();
            const parametros = new Dominio(prompts);

            const a: ApiState = {
                state: STATES.NOT_INIT,
                modelo: this.mundo.modelo
            }
            regla.configurar(a, parametros);

            this.modelo.motor.reglas.push(regla);

            console.log(agentMessage(this.nombre,
                `${i18.APPS.CADENA.TEST.CASO.BUCLE.CREAR_REGLA_LABEL}:${0} con prompts: ${regla.mensajes.length}`
            ));

            this.modelo.motor.arrancar((log) => {
                console.log(
                    agentMessage(this.nombre,
                        `${i18.APPS.CADENA.CONEXIONISTA.INFERENCIA}: resolución de la api: ${Object.keys(log).join(" - ")}`));
                this.modelo.eventos.next(this.mundo);
            });

            const takeOne = this.modelo.motor.eventos.subscribe(s => {

                this.mundo.modelo.dominio['modelo.motor.eventos'] = s?.dominio?.base || this.mundo.modelo.dominio['modelo.motor.eventos'];
                takeOne.unsubscribe();
            })

            /**
             *  Capturar evento de parada
             * */
            this.modelo.motor.trasDetenerse(() => {

                console.log(agentMessage(
                    this.nombre, 
                    `${i18.APPS.CADENA.CONEXIONISTA.INFERENCIA}:${"Motor de inferencias parado. Se han lanzado todas las inferencia. Esperando resultados...!"}`));
                resolve();
            });

            /**
             *  Condición de salida
             * */
            setTimeout(
                () => reject("forma.sistema.semantica.paradigma.RedSemantica.probar, tiempo expirado!")
                , 5000
            );
        });

    }
}


