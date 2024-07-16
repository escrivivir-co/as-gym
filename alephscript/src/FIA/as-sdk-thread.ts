import { i18 } from "./i18/aleph-script-i18";

import * as http from "http";
import { systemMessage } from "./systemMessage";
import { AlephScriptBoilerplate } from "../as-seed/guest/main";

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

    const b = new AlephScriptBoilerplate();
    const o = b.navigator();

    

});
