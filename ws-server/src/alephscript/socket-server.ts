import http from "http";
import { Socket, Server, Namespace } from 'socket.io';
import type { Server as HTTPSServer } from "https";
import type { Http2SecureServer, Http2Server } from "http2";
const { instrument } = require("@socket.io/admin-ui");
import { Sala } from '../classes/sala';
import { isLogable, Message } from "./message";

export type NamespaceDetails = {
	name: string;
	socketsCount: number;
	sockets: Partial<Socket>[]
};

export type SocketDetails = {
	name: string;
};

// ROOM_MESSAGE
export type RoomDetails = {
	event: string;
	room: string;
	requester: string;
	sender: string;
	data: any;
};

export type SuscriptionDetails = {
	room: string;
	out: boolean;
};

export type ServerInstance = http.Server | HTTPSServer | Http2SecureServer | Http2Server;

const corsOptions = {
    origin: (origin: any, callback: any) => {
        callback(null, true);
    },
    credentials: true // Habilitar el soporte para credenciales
};

export class SocketServer {

	salas: Sala[] = [];

	namespaces = new Map<string, Namespace>();
	sockets = new Map<string, SocketDetails>();
	rooms = new Map<string, string>();

	io: Server;

	constructor(
		public name = "AlephServer",
		server: ServerInstance,
		activateInstrumens = true,
		public autoBroadcast = true
	) {

		this.io = new Server( server, { cors: corsOptions } );

		// Permite usar la aplicación Aleph-ws-server-ui para admin del server
		if (activateInstrumens) {
			instrument(this.io, {
				auth: false
			});
		}

	}

	createNamespace(namespace: string) {

		const socket = this.io.of('/' + namespace);

		socket.on("connection",(socket)=> this.onConnection(namespace, socket))
		socket.on("disconnect",(socket)=> this.onDisconnect(namespace, socket))

		this.namespaces.set(namespace, socket);

		this.log(namespace, "There is now namespaces: " + this.namespaces.size)
	}

	onConnection(namespace: string, socket: Socket) {

		this.log("New connection at", namespace + ". Socket: " + this.socketName(socket) + ": " + socket.id);

		if (this.autoBroadcast) {

			socket.on("CLIENT_REGISTER", (data, ...args)=> { this.onClientRegister(namespace, socket, data) })
			socket.on("CLIENT_SUSCRIBE", (data, ...args)=> { this.onClientSuscribe(namespace, socket, data) })
			socket.on("ROOM_MESSAGE", (data, ...args)=> { this.onRoomMessage(namespace, socket, data) });

			socket.onAny((event, ...args: any) => {

				// console.log("Event", event, "args", args)
				const innerEvent = new Message(args, event).event;

				if (isLogable(innerEvent) && isLogable(event)) {
					this.log(
						namespace + "/Socket.OnAny" + "/" + innerEvent +
						`:> Broadcasting event: ${event} with data:`,
						args
					)
					socket.broadcast.emit(event, args);
				}
			});
		}

	}

	onDisconnect(namespace: string, socket: Socket) {

		// this.logServerState(socket, namespace + ".onDisconnect");

	}

	onClientRegister(namespace: string, socket: Socket, args: SocketDetails) {

		this.log(namespace + ".onClientRegister." + socket.id, args);

		this.sockets.set(socket.id, args as SocketDetails);

	}

	onClientSuscribe(namespace: string, socket: Socket, args: SuscriptionDetails) {

		const message = namespace + ".onClientSuscribe." +
		this.sockets.get(socket.id)?.name || "El socket no se ha registrado: " + socket.id;
		if (args.out) {
			socket.leave(args.room);
			this.log("LEAVE:> " + message,
				args
			);
		} else {
			socket.join(args.room);
			this.log("JOIN:> " + message,
				args
			);
		}

	}

	onRoomMessage(namespace: string, socket: Socket, args: RoomDetails) {

		const message = namespace + ".onRoomMessage." +
			this.socketName(socket) +
			". Event: " + args.room + "/" + args.event;
		this.log(message);

		if (!args.room) {
			console.log(args)
		}

		switch(args.event) {
			case "GET_SERVER_STATE": {

				this.logServerState(socket, "SET_SERVER_STATE");
				return;
			}
			case "SET_SERVER_STATE": {
				console.log("Weird serach penta")
				return;
			}
		}

		const isGETTER = args.event.substring(0, 4) == "GET_";
		if (isGETTER) {
			this.log("Resolving GETTER... Is there any Master configured for this room?")
			const master = this.rooms.get(args.room);
			if (master) {
				this.log(namespace + "/" + this.socketName(socket) +
					":> Resolving GETTER... master found, emit [" + args.event + "] TO!",
					this.socketName({ id: master }))
				const requesterData = {
					...args,
					requester: socket.id,
					requesterName: this.socketName(socket)
				}
				socket.to(master).emit(args.event, requesterData);
			} else {
				this.log("Can't Resolve GETTER...!!! There is no master at room: [" + args.room + "]")
				console.log(args)
			}
			return;
		}

		const isSETTER = args.event.substring(0, 4) == "SET_";
		if (isSETTER) {
			// this.log("Resolving SETTER... has receiver? " + this.socketName({ id: args.requester}))
			const target = args.requester;
			const requesterData = {
				...args.data,
				sender: socket.id
			}
			if (target) {
				// SEND TO TARGET
				/* this.log(namespace + "/" + target +
					":> Resolving SETTER... master found, emit [" + args.event + "] TO!",
					this.socketName({ id: target }))
				*/
				socket.to(target).emit(args.event, requesterData);
			} else {
				// SEND TO ROOM
				socket.to(args.room).emit(args.event, requesterData);
			}
			return;
		}

		switch(args.event) {
			case "MAKE_MASTER": {
				this.log("Make " + this.socketName(socket) + " master of: " + namespace + "/" + args.room)
				this.rooms.set(args.room, socket.id);
				break;
			}
			default: {
				this.ioG(namespace)?.to(args.room).emit(args.event, args.data);
			}
		}

	}

	socketName(socket: Partial<Socket>): string {
		if (!socket.id) return "<-->";
		return (this.sockets.get(socket.id)?.name) || ("El socket no se ha registrado: " + socket.id)
	}

	startPing() {
		setInterval(() => {
			console.log("PingInterval", 5000)
			const namespaces: NamespaceDetails[] = [];

			this.io._nsps.forEach((namespace) => {

				const sockets: Partial<Socket>[] = [];
				for(const s of namespace.sockets.values()) {
					sockets.push({
						id: s.id
					});
				}

				namespaces.push({
					name: namespace.name,
					socketsCount: namespace.sockets.size,
					sockets: JSON.parse(JSON.stringify(sockets))
				});
			});

			const state = {
				socketId: 0,
				clientId: 0,
				socketsPerNamespace: namespaces,
				clients: this.io.engine?.clientsCount
			}
			this.io.emit("Server_State", state);
		}, 30000)
	}

	getNamespacesList(): NamespaceDetails[] {

		const namespaces: NamespaceDetails[] = [];

		this.io._nsps.forEach((namespace) => {

			const sockets: Partial<Socket>[] = [];
			for(const s of namespace.sockets.values()) {
				sockets.push({
					id: "/" + this.socketName(s)
				});
			}

			namespaces.push({
			  name: namespace.name,
			  socketsCount: namespace.sockets.size,
			  sockets
			});

		});
		return namespaces;

	}

	logServerState(socket: Socket, event: string) {

		const state = {
			action: event,
			socketId: socket.id,
			clientId: (socket?.client as any)?.id,
			socketsPerNamespace: this.getNamespacesList(),
			clients: this.io.engine?.clientsCount
		}
		socket.emit(event, state);
		this.log("Emit >> State"," to: " + this.socketName(socket) + " event: " + event);
	}

	log(message: string, data: any = undefined) {

		console.log("-",
			this.name,
			message,
			data ? data : ""
		);

	}

	ioG(namespace: string): Namespace | undefined {

		return this.namespaces.get(namespace);
	}
}