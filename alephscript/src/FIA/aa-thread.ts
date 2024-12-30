import { i18 } from "./i18/aleph-script-i18";

import * as http from "http";
import { systemMessage } from "./systemMessage";
import { DevOpsFileManager } from "../as-sdks/devops/file-manager";
import { OpenAIAssistantManager } from "../as-sdks/devops/manager";
import { CandidateElimination } from "./paradigmas/sistemas/aprendizaje-automatico/supervisado/espacio-versiones/ev";

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

    const candidateElimination = new CandidateElimination();
	candidateElimination.test();
	candidateElimination.test2();

});
