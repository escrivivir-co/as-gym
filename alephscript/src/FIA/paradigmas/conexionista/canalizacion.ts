import * as ort from 'onnxruntime-node'
import { i18 } from '../../i18/aleph-script-i18';
import { agentMessage } from "../../agentMessage";
import { IApiMessage } from './modelos-lenguaje/inferencia-oai';
import { InferenciaOpenAI } from "./modelos-lenguaje/Inferencia-open-ai";

export interface ICanalizacion {

    canalizar(): void;

    canalizarDe2Parametros(inferencia: CanalizacionParametros): Promise<string>

}

export interface CanalizacionParametros {
    modelo: string;
    dato_a: Float32Array;
    dato_b: Float32Array;
}

export class Canalizacion implements ICanalizacion {

    canalizar(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * 
     * @param inferencia.modelo: './model.onnx'
     *                  .dato_a: Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
     * *                .dato_b: Float32Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120])
     */
    async canalizarDe2Parametros(inferencia: CanalizacionParametros): Promise<string> {

        return new Promise(async (resolve, reject) => {

            const dominio = i18.CONEXIONISTA.NEURONAL;
            try {

                console.log(
                    agentMessage(dominio.NOMBRE, `${dominio.CREANDO_SESION_INFERENCIA_LABEL}:${inferencia.modelo}`)
                );
                // create a new session and load the specific model.
                //
                // the model in this example contains a single MatMul node
                // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
                // it has 1 output: 'c'(float32, 3x3)
                const session = await ort.InferenceSession.create(inferencia.modelo);


                console.log(
                    agentMessage(dominio.NOMBRE,
                        `${dominio.CARGANDO_PARAMETROS_LABEL}:${inferencia.dato_a}, ${inferencia.dato_b}`)
                );
                const tensorA = new ort.Tensor('float32', inferencia.dato_a, [3, 4]);
                const tensorB = new ort.Tensor('float32', inferencia.dato_b, [4, 3]);

                // prepare feeds. use model input names as keys.
                const feeds = { a: tensorA, b: tensorB };

                // feed inputs and run
                const results = await session.run(feeds);

                // read from results
                const dataC = results.c.data;
                console.log(
                    agentMessage(dominio.NOMBRE,
                        `${dominio.RESPUESTA_INFERENCIA_LABEL}:${dataC}`)
                );
                resolve("");

            } catch (e) {
                console.log(
                    agentMessage(dominio.NOMBRE,
                        `${dominio.RESPUESTA_INFERENCIA_LABEL}:${e}`)
                );
                reject(agentMessage(dominio.NOMBRE,
                    `${dominio.RESPUESTA_INFERENCIA_LABEL}:${e}`))
            }
        })
    }

    /**
     * 
     * @param inferencia.modelo: './model.onnx'
     *                  .dato_a: Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
     * *                .dato_b: Float32Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120])
     */
    async canalizarLenguajeNatural(inferencia: CanalizacionParametros): Promise<string> {

        return new Promise(async (resolve, reject) => {

            const dominio = i18.CONEXIONISTA.NEURONAL;
            try {

                console.log(
                    agentMessage(dominio.NOMBRE, `${dominio.CREANDO_SESION_INFERENCIA_LABEL}:${inferencia.modelo}`)
                );
                // create a new session and load the specific model.
                //
                // the model in this example contains a single MatMul node
                // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
                // it has 1 output: 'c'(float32, 3x3)
                const session = await ort.InferenceSession.create(inferencia.modelo);


                console.log(
                    agentMessage(dominio.NOMBRE,
                        `${dominio.CARGANDO_PARAMETROS_LABEL}:${inferencia.dato_a}, ${inferencia.dato_b}`)
                );
                const tensorA = new ort.Tensor('float32', inferencia.dato_a, [3, 4]);
                const tensorB = new ort.Tensor('float32', inferencia.dato_b, [4, 3]);

                // prepare feeds. use model input names as keys.
                const feeds = { a: tensorA, b: tensorB };

                // feed inputs and run
                const results = await session.run(feeds);

                // read from results
                const dataC = results.c.data;
                console.log(
                    agentMessage(dominio.NOMBRE,
                        `${dominio.RESPUESTA_INFERENCIA_LABEL}:${dataC}`)
                );
                resolve("");

            } catch (e) {
                console.log(
                    agentMessage(dominio.NOMBRE,
                        `${dominio.RESPUESTA_INFERENCIA_LABEL}:${e}`)
                );
                reject(agentMessage(dominio.NOMBRE,
                    `${dominio.RESPUESTA_INFERENCIA_LABEL}:${e}`))
            }
        })
    }

}

export class CanalizacionOpenApi extends Canalizacion {
    api: InferenciaOpenAI<IApiMessage>;
}