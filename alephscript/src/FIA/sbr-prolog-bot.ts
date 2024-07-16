import { Runtime } from "./engine/kernel/runtime";
import { i18 } from "./i18/aleph-script-i18";

import * as http from "http";
import { systemMessage } from "./systemMessage";
import { BaseExpertaSimulacion } from "./paradigmas/simbolica/modelos/formal/sistema/base-experta/simuacion";
import { AlephScriptBoilerplate } from "../as-seed/guest/main";
import { AlephNullBot } from "./paradigmas/sbr/app/aleph-null";

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

    const b = new AlephNullBot();
    b.iniciar();

});
