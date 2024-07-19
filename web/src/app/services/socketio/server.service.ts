import { Inject, inject, Injectable, NgZone, PLATFORM_ID, signal } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { SalaBackend } from './interfaces/sala';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SocketClient } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/ws-server/src/alephscript/socket-client';
import { SignalEvent } from '../../pages/general/about/about.component';
import { IMenuState } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/alephscript/src/FIA/engine/kernel/IMenuState';
import { IServerState } from "../../../../../ws-server/src/alephscript/IServerState";
import { IRuntimeBlock } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/ws-server/src/alephscript/IRuntimeBlock'
import { IAppState } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/ws-server/src/alephscript/IAppState'

@Injectable({
  providedIn: 'root'
})
export class ServerService {
	private ngZone = inject(NgZone);

	server: any;
	runtime: any;

	usuarioService: UsuarioService = inject(UsuarioService);

	serverState$ = new Subject<IServerState>();
	currentserverState$ = signal<IServerState>({
		action: '',
		socketId: '',
		clientId: '',
		socketsPerNamespace: [],
		sockets: [],
		clients: 0,
		miembros: [],
		rooms: []

	});

	MenuAppsList$ = new Subject<IMenuState[]>();
	currentMenuState$ = signal<IMenuState[]>([]);

	chainState$ = new Subject<IRuntimeBlock>();
	currentChainState$ = signal<IRuntimeBlock>({
		id: '',
		estado: {},
		fecha: new Date()
	});


	appState$ = new Subject<IAppState>();
	currentAppState$ = signal<IAppState>({
		index: 0,
		name: '' /*,
		fase: IFase*/
	});

	actualizacionDeSala$ = new Subject<SalaBackend>();
	web: any;

	constructor(
		@Inject(PLATFORM_ID) private platformId: object
	) {

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

		this.web = new AlephScriptClient(this.usuarioService.nombre());
		this.web.initTriggersDefinition.push(() => {

			this.web.io.on("SET_LIST_OF_THREADS", (...args: any[]) => {
				// console.log(agentMessage"Receiving list of threads...", args)
				const data = Object.keys(args[0])
					.map(k => args[0][k]).filter(k => typeof k == "object")
				this.MenuAppsList$.next(data);
				this.currentMenuState$.set(data)
			})
			this.web.room("GET_LIST_OF_THREADS");

			this.web.io.on("SET_SERVER_STATE", (...args: any[]) => {
				// console.log("Receiving server state...", (args[0]))
				this.serverState$.next(args[0])
				this.currentserverState$.set(args[0])
			})
			this.web.room("GET_SERVER_STATE");
			this.web.io.on("SET_EXECUTION_PROCESS", (...args: any[]) => {

				this.chainState$.next(args[0])
				this.currentChainState$.set(args[0])
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
