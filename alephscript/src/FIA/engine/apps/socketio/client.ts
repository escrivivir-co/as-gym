import { SocketClient } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/ws-server/src/alephscript/socket-client';

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