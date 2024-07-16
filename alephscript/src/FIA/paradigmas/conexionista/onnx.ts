import { Tensor, InferenceSession } from "onnxruntime-web";
import { env } from "onnxruntime-web";
import * as ort from 'onnxruntime-node';
// import * as ort from 'onnxruntime-web/webgpu';
/*

https://onnxruntime.ai/docs/get-started/with-javascript.html

https://github.com/microsoft/onnxjs/blob/master/docs/migration-to-ort-web.md

https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js

https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js/quick-start_onnxruntime-node


load from ArrayBuffer/Uint8Array:
    - this is supported in both ONNX.js and ONNX Runtime Web. Just replace the URL string in the example above by a Uint8Array instance and it will work.
startProfiling() and endProfiling():
    - they are supported in both ONNX.js and ONNX Runtime Web.
*/
    export enum Backend {
        webgl = "webgl",  // WebGL
        wasm = "wasm"     // WebAssembly
    }
    /**
     * Cualquier (o la mayoría de modelos Red de Neuronal puede importarse a través
     * del conversor onnx)
     */
    export class ConversorRedesNeuronales {

        opciones = {
            executionProviders: [Backend.webgl],
        };

        modelo_onnx = "https://example.com/models/myModel.onnx";

        async iniciar() {

            const session = await InferenceSession.create(
                this.modelo_onnx,
                this.opciones
            );
        }
    }