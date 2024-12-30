import { i18 } from "./i18/aleph-script-i18";

import * as http from "http";
import { systemMessage } from "./systemMessage";
import { DevOpsFileManager } from "../as-sdks/devops/file-manager";
import { OpenAIAssistantManager } from "../as-sdks/devops/manager";

const host = 'localhost';
const port = 8000;

const requestListener =  (req, res) => {
    res.writeHead(200);

    res.end("My first server!");
};

const server = http.createServer(requestListener);

server.on('error', (e) => {

  // Handle Error
  console.log(console.log("Thread Handle Error:", systemMessage(e.message)));

});
server.listen(port, async () => {

    console.log(systemMessage(i18.SISTEMA.STARTING_LABEL));

    /* await BaseExpertaSimulacion();

    const rt = new Runtime();
    rt.start();
    await rt.demo();*/

    /*const b = new PrimeroEnAnchura("Primero en anchura", PrimeroEnAnchura.sucesores);
    b.test();

    const c = new PrimeroEnProfundidad(new Arbol());
    c.test();

    const u = new CosteUniforme("CosteUniforme", CosteUniforme.sucesores);
    u.test();

    const bI = new PrimeroEnAnchuraIterativa("Primero en anchura", PrimeroEnAnchura.sucesores);
    bI.derecha_a_izquierda = true;
    bI.test();

    const cI = new PrimeroEnProfundidadIterativa(new Arbol());
    cI.izquierda_a_derecha = true;
    cI.test(); 

    const a = new AGBG(new GrafoAGBG());
    a.test();

    const bf = new PrimeroElMejor(new GrafoAGBG());
    bf.test();

    const ae = new AEstrella();
    ae.test();
    ae.test2();

    const eg = new EscaladaMaximoGradiente();
    eg.test();*/
    // eg.test6();
    // eg.test2();
    // eg.test3();
    // eg.test4();

    const eg = new DevOpsFileManager()
	// eg.test();

	const a = new OpenAIAssistantManager();
	await a.init();
	await a.setupAssistant();
	await a.requestSample();


});
