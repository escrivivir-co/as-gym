import * as http from 'http';
import { i18, systemMessage } from '@fia/i18n';
import { Runtime } from '@fia/runtime';

const host = 'localhost';
const port = 8001;

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200);
    res.end("FIA Runtime Thread");
};

const server = http.createServer(requestListener);

server.on('error', (e: Error) => {
    console.log(systemMessage(`Thread Handle Error: ${e.message}`));
});

server.listen(port, async () => {
    console.log(systemMessage(i18.SISTEMA.STARTING_LABEL));
    
    const rt = new Runtime();
    rt.start();
    await rt.demo();
});
