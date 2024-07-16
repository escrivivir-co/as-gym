import express, { Application } from 'express'
import { createServer } from 'node:http';
import { AlephScriptServer } from './alephscript/server';
import { AlephScriptClient } from './alephscript/client';
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

server.listen(3000, ()=> {

	console.log("Server escuchando en el puerto 3000");

	const asCli = new AlephScriptClient("SERVER_cRUNTIME", "http://localhost:3000", "/runtime");
	// THIS IS UI APP ADMIN DASHBORAD, DON'T CONNECT const asCliA = new AlephScriptClient("SERVER_cADMIN", "http://localhost:3000", "/admin");
	const noPath = new AlephScriptClient("SERVER_cNOPATH", "http://localhost:3000", "/");

	asCli.initTriggersDefinition.push(() => {

		asCli.io.on("SET_LIST_OF_THREADS", (...args: any[]) => {

		})
		asCli.room("GET_LIST_OF_THREADS");

		asCli.io.on("SET_SERVER_STATE", (...args: any[]) => {

		})
		asCli.room("GET_SERVER_STATE");
	})
	// as.startPing();
	// asCli.io.disconnect();
})

