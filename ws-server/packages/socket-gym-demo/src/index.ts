import express, { Application } from 'express'
import { createServer } from 'node:http';
import { AlephScriptServer, AlephScriptClient } from '@alephscript/core';
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

// Usar la librería AlephScript
const as = new AlephScriptServer(server);

server.listen(3000, ()=> {

	console.log("🚀 Socket Gym Demo - Server escuchando en el puerto 3000");
	console.log("📦 Usando @alephscript/core library");

	// Crear clientes usando la librería
	const asCli = new AlephScriptClient("SERVER_cRUNTIME", "http://localhost:3000", "/runtime");
	// THIS IS UI APP ADMIN DASHBOARD, DON'T CONNECT const asCliA = new AlephScriptClient("SERVER_cADMIN", "http://localhost:3000", "/admin");
	const noPath = new AlephScriptClient("SERVER_cNOPATH", "http://localhost:3000", "/");

	// Configurar triggers usando la librería
	asCli.initTriggersDefinition.push(() => {

		asCli.io.on("SET_LIST_OF_THREADS", (...args: any[]) => {
			console.log("📥 Receiving list of threads from @alephscript/core...")
		})
		asCli.room("GET_LIST_OF_THREADS");

		asCli.io.on("SET_SERVER_STATE", (...args: any[]) => {
			console.log("📊 Receiving server state from @alephscript/core...")
		})
		asCli.room("GET_SERVER_STATE");
	})

	console.log("✅ Demo aplicación configurada correctamente usando @alephscript/core");
	// as.startPing();
	// asCli.io.disconnect();
})
