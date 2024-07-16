import { i18 } from "../../../../i18/aleph-script-i18";
import { RedSemantica } from "../../../../paradigmas/simbolica/modelos/formal/sistema/semantica/red";
import { agentMessage } from "../../../../agentMessage";
import { CadenaFIASimbolica } from "../cadena-fia-simbolica";
import { CadenaGrafo } from "./cadena-grafo";

export class CadenaFIARedSemantica extends CadenaFIASimbolica {

    modelo = new RedSemantica();
    nombre = i18.APPS.CADENA.SIMBOLICA.RED.NOMBRE;

    constructor() {

        super();

        const grafo = new CadenaGrafo();

        this.modelo.nombre = i18.APPS.CADENA.SIMBOLICA.SEMANTICA.NOMBRE;
        this.modelo.base = grafo;

    }

    async instanciar(): Promise<string> {

        console.log(agentMessage(this.nombre, i18.APPS.CADENA.SIMBOLICA.SIMULATION_START));

        await this.cargaRed();

        console.log(
            agentMessage(this.nombre, `${i18.APPS.CADENA.SIMULATION_BODY}:${this.imprimir()}`)
        );

        await this.probar();

        return `${i18.APPS.CADENA.SIMBOLICA.SIMULATION_END}`;
    }

    async cargaRed() {

        const red = i18.APPS.CADENA.SIMBOLICA.DOMINIO;
        this.modelo.cargar(red);

    }

    imprimir(): string {

        let out = "";
        this.modelo.entidades.forEach(e => {
            out += e.imprimir();
        })
        return out;
    }

    async probar(): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const red = i18.APPS.CADENA.SIMBOLICA.DOMINIO;

            /*
    
                red.ENTIDADES.tarea
                red.ENTIDADES.robot
                red.ENTIDADES.objeto
                red.ENTIDADES.propiedad
                red.ENTIDADES.cadena
                red.ENTIDADES.almacen
    
                red.ARCOS.ESTRUCTURALES.INSTANCIA.cadena_1
                red.ARCOS.ESTRUCTURALES.INSTANCIA.robot_1
                red.ARCOS.ESTRUCTURALES.INSTANCIA.objeto_1
                red.ARCOS.ESTRUCTURALES.INSTANCIA.almacen_1
    
                red.ARCOS.ESTRUCTURALES.SUBCLASE.criptoselladora
    
            */

            const POSITIVOS = [{
                esperado: true,
                texto: "¿Es robot_1 instancia de robot? ¿Es robot_1 un robot?",
                instancia: {
                    robot_1: { robot: "" }
                }
            },
            {
                esperado: true,
                texto: "¿Es robot_1 una criptoselladora?",
                subclase: {
                    robot_1: { criptoselladora: "" }
                }
            },
            {
                esperado: true,
                texto: "¿Es el objeto_2 criptosellable?",
                parte: {
                    propiedad_cripta: { objeto_2: "" }
                }
            },
            {
                esperado: true,
                texto: "¿Necesita el objeto_2 criptosellado y puede el robot_1 hacerlo?",
                parte: {
                    propiedad_cripta: { objeto_2: "" }
                },
                subclase: {
                    robot_1: { criptoselladora: "" }
                }
            }];

            const NEGATIVOS = [
                {
                    esperado: false,
                    texto: "¿Es robot_1 instancia de cadena? ¿Es robot_1 una cadena?",
                    instancia: {
                        robot_1: { cadena: "" }
                    }
                },
                {
                    esperado: false,
                    texto: "¿Es robot_4 una criptoselladora?",
                    subclase: {
                        robot_4: { criptoselladora: "" }
                    }
                },
                {
                    esperado: false,
                    texto: "¿Es el objeto_3 criptosellable?",
                    parte: {
                        propiedad_cripta: { objeto_3: "" }
                    }
                },
                {
                    esperado: false,
                    texto: "¿Necesita el objeto_3 criptosellado y puede el robot_1 hacerlo?",
                    parte: {
                        propiedad_cripta: { objeto_3: "" }
                    },
                    subclase: {
                        robot_3: { criptoselladora: "" }
                    }
                }
            ]
            const casos = [
            ...POSITIVOS,
            ...NEGATIVOS
            ];

            await this.modelo.probar(casos);
            resolve();
        });
    }

}
