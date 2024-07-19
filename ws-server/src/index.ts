import express, { Application } from 'express'
import { createServer } from 'node:http';
import { AlephScriptServer } from './alephscript/server';
import { AlephScriptClient } from './alephscript/client';
import cors from 'cors';
import { IUserDetails } from './alephscript/IUserDetails';

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

	const asCli = new AlephScriptClient("botDevil", "http://localhost:3000", "/runtime");
	// THE NAMESPACE '/admin' IS CREATED AND MANAGED BY UI APP ADMIN DASHBORAD, DON'T MESS WITH IT
	// const asCliA = new AlephScriptClient("SERVER_cADMIN", "http://localhost:3000", "/admin");
	const noPath = new AlephScriptClient("botGod", "http://localhost:3000", "/");

	noPath.initTriggersDefinition.push(() => {

		noPath.io.emit("CLIENT_REGISTER", { usuario: noPath.name, sesion: "333" } as IUserDetails);
	})

	asCli.initTriggersDefinition.push(() => {

		asCli.io.on("SET_LIST_OF_THREADS", (...args: any[]) => {

		})
		asCli.room("GET_LIST_OF_THREADS");

		asCli.io.on("SET_SERVER_STATE", (...args: any[]) => {

		})
		asCli.room("GET_SERVER_STATE");
		asCli.io.emit("CLIENT_REGISTER", { usuario: asCli.name, sesion: "666" } as IUserDetails);
	})
	// as.startPing();
	// asCli.io.disconnect();
})

