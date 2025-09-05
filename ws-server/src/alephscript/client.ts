import { SocketClient } from "./socket-client";

export class AlephScriptClient extends SocketClient {
  disconnect() {
    console.log("AlephScriptClient.disconnect");
  }
  connect() {
    console.log("AlephScriptClient.connect");
  }

  onMessage(arg0: (message: any) => void) {
    console.log("AlephScriptClient.onMessage");
  }
  broadcast(arg0: {
    type: string;
    event: string;
    data: any;
    timestamp: number;
  }) {
    console.log("broadcast");
  }

  constructor(
    public name = "AlephClient",
    public url: string = "http://localhost:3000",
    public namespace: string = "/",
    public autoConnect = true
  ) {
    super(name, url, namespace, autoConnect);
  }
}
