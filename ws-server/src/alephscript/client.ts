import { SocketClient } from './socket-client';

export class AlephScriptClient extends SocketClient {

	constructor(
		public name = "AlephClient",
		public url: string = "http://localhost:3000",
		public namespace: string = "/",
		public autoConnect = true
	) {
		super(name, url, namespace, autoConnect);
	}

}