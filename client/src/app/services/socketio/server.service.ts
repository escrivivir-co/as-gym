import { Inject, inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { UsuarioService } from './usuario.service';
import { SalaBackend } from './interfaces/sala';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SocketClient } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/ws-server/src/alephscript/socket-client';
import { RunStateEnum, SignalEvent } from '../../pages/general/about/about.component';

export type NamespaceDetails = {
	name: string;
	socketsCount: number;
	sockets: Partial<Socket>[];
  };

export interface ServerState {
	action: string;
	socketId: string;
	clientId: string;
	socketsPerNamespace: NamespaceDetails[];
	sockets: Partial<Socket>[];
	clients: number;
}

export interface MenuState {
	index: number;
	name: string;
	state: RunStateEnum;
}

export interface RuntimeBlock
{
    id: string;
    estado: any;
    fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
	private ngZone = inject(NgZone);

	server: any;
	runtime: any;

	usuarioService: UsuarioService = inject(UsuarioService);

	serverState$ = new Subject<ServerState>();
	menuState$ = new Subject<MenuState[]>();
	chainState$ = new Subject<RuntimeBlock>();

	actualizacionDeSala$ = new Subject<SalaBackend>();
	web: any;

	constructor(
		@Inject(PLATFORM_ID) private platformId: object
	) {

		this.usuarioService.nombre.set("AlephEuler45");

		if (isPlatformBrowser(this.platformId)) {
			this.ngZone.runOutsideAngular(() => {

				this.initSockets();

			});
		}
	}

	sendEngineAction(signal: SignalEvent) {

		(this.web as AlephScriptClient).room(signal.event, signal.data, "ENGINE_THREADS");

	}

	initSockets() {

		this.web = new AlephScriptClient("AS-02");
		this.web.initTriggersDefinition.push(() => {

			this.web.io.on("SET_LIST_OF_THREADS", (...args: any[]) => {
				console.log("Receiving list of threads...", args)
				const data = Object.keys(args[0]).map(k => args[0][k])
				this.menuState$.next(data);
			})
			this.web.room("GET_LIST_OF_THREADS");

			this.web.io.on("SET_SERVER_STATE", (...args: any[]) => {
				// console.log("Receiving server state...", (args[0]))
				this.serverState$.next(args[0])
			})
			this.web.room("GET_SERVER_STATE");
			this.web.io.on("SET_EXECUTION_PROCESS", (...args: any[]) => {

				const bloque = args[0];
				// console.log("SET_EXECUTION_PROCESS", bloque)
				this.chainState$.next(args[0])
			})
		})
	}
}



export class AlephScriptClient extends SocketClient {

	constructor(
		name = "ClientID",
		url: string = "http://localhost:3000",
		namespace: string = "/runtime",
		autoConnect = true
	) {
		super(name, url, namespace, autoConnect);
	}

}
