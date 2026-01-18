import { Inject, inject, Injectable, NgZone, PLATFORM_ID, signal } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { SalaBackend } from './interfaces/sala';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SocketClient } from '@alephscript/mcp-core-sdk/client';
import { SignalEvent } from '../../pages/general/about/about.component';
import type { 
	IMenuState, 
	IServerState, 
	IRuntimeBlock, 
	IAppState 
} from '@alephscript/mcp-core-sdk/browser';

// SudokuData - tipo local específico del juego
interface SudokuData {
	board?: number[][];
	solution?: number[][];
	difficulty?: string;
	[key: string]: unknown;
}

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

	sudokuBoard$ = new Subject<SudokuData>();
	IAresponses$ = new Subject<any>();

	constructor(
		@Inject(PLATFORM_ID) private platformId: object
	) {

		if (isPlatformBrowser(this.platformId)) {
			this.ngZone.runOutsideAngular(() => {

				this.initSockets();

			});
		}
	}

	enterRoom(room: string) {
		this.web.io.emit("CLIENT_SUSCRIBE", { room });
	}

	sendEngineAction(signal: SignalEvent) {
		console.log("Send to", signal.event);
		(this.web as AlephScriptClient).room(signal.event, signal.data, signal.room || "ENGINE_THREADS");

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
			this.web.io.emit("CLIENT_SUSCRIBE", { room: "SUDOKU" });

			this.web.io.on("BOARD_DATA", (...args: any[]) => {
				//this.sudokuBoard$.next(args[0])
				this.sudoku.push(args[0])
			})

			this.web.io.on("SET_IA_RESPONSE", (...args: any) => {
				console.log("SET_IA_RESPONSE", args)
				this.IAresponses$.next(args)
			})

			this.web.io.on((event: any, ...args: any) => {
				console.log("ANT", event, args)
				this.IAresponses$.next(args)
			})

			setInterval(() => {
				if (this.sudoku.length > 0) {
					const p = this.sudoku[0]
					this.sudoku.splice(0, 1)
					this.sudokuBoard$.next(p)
				}
			}, 1)
		})
	}
	sudoku: SudokuData[] = [];
	IAresponses: any[] = [];
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
