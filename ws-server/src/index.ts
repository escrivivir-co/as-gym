import express, { Application } from 'express'
import { createServer } from 'node:http';
import { AlephScriptServer } from './alephscript/server';
import cors from 'cors';

const app: Application = express();
const corsOptions = {
	origin: (origin: any, callback: any) => {
		callback(null, true);
	},
	credentials: true
};
app.use(cors(corsOptions));

const server = createServer(app);

const as = new AlephScriptServer(server);

server.listen(3000, () => {

	console.log("Server escuchando en el puerto 3000");

});
