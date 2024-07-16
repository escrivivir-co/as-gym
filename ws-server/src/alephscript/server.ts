import { Namespace } from "socket.io";
import { ServerInstance, SocketServer } from "./socket-server";

export class AlephScriptServer extends SocketServer {

	runtime: Namespace | undefined;
	admin: Namespace | undefined;
	base: Namespace | undefined;

	constructor(public server: ServerInstance) {

		super("AlephServer", server);

		this.createNamespace("admin");
		this.createNamespace("runtime");
		this.createNamespace("");

		this.runtime = this.ioG("runtime");

		this.runtime?.on("Menu_State", (socket) => {
			console.log("Piden Menu_State")
		})

		this.runtime?.on("Menu_State", (socket) => {
			console.log("Piden Menu_State")
		})

		this.admin = this.ioG("admin");

		this.base = this.ioG("");

	}

}




/*

	onDisconnect(socket: Socket) {

		this.logServerState(socket, "ondisconnnection");

	}




	onConnection(socket: Socket) {

		this.logServerState(socket, "onConnnection");

		socket.on("encontrarSala",(callback) => this.buscarSalaPublica(callback));
		socket.on("crearSala",(args,callback) => this.crearSala(socket,callback,args ))
		socket.on("unirseASala",(args,callback) => this.unirseASala(socket,callback,args));
		socket.on("disconnecting",()=> {
		if(socket.rooms.size < 2) return;
		const salaJugador = this.salas.find(sala => sala.id == parseInt([...socket.rooms][1].substring(5)))
		if(!salaJugador) return;
		salaJugador?.jugadorAbandono();
		socket.conn.close();
		this.salas = this.salas.filter(sala => sala.id !== salaJugador.id);
		console.log("Acabo de cerrar la sala",salaJugador.id,", ahora las salas son",this.salas)
		});
		socket.on("jugar",(args)=> {
		console.log("Viendo de registrar una jugada",args, this.buscarSala(args.salaId))
		this.buscarSala(args.salaId)?.jugar(args.jugador,args.posicion)
		})

		//

	}

	buscarSalaPublica(callback: Function){
		console.log("Buscando sala pública")
		const salaDisponible = this.salas.find(sala => {
		if(!sala.publica) return false;
		if(sala.jugadores[0].nombre && sala.jugadores[1].nombre) return false;
		return true
		})
		callback(salaDisponible ? salaDisponible.id : null);
	}

	crearSala(socket:Socket, callback: Function, args: CrearSalaArgs){

		const nuevaSala = new Sala(args, socket)
		nuevaSala.id = this.idProximaSala;
		this.idProximaSala++;
		this.salas.push(nuevaSala);
		this.unirseASala(socket, callback, {
			id: nuevaSala.id,
			nombreJugador: args.nombreJugador
		})
	}


	unirseASala(socket:Socket,callback:Function, args:UnirseASalaArgs){

		console.log("Uniendo a sala", args)
		if(!this.salas.length) return callback({exito: false, mensaje: "No existen salas"});

		const salaIndex = this.salas.findIndex(sala => sala.id === args.id);
		if(salaIndex === -1) return callback({exito: false, mensaje: "No existe la sala con ID " + args.id});
		if(this.salas[salaIndex].jugadores[0].nombre && this.salas[salaIndex].jugadores[1].nombre) return callback(
		{exito: false, mensaje: "La sala está llena"}
		);
		this.salas[salaIndex].agregarJugador(args.nombreJugador);

		socket.join("sala-"+this.salas[salaIndex].id);

		return callback({exito:true, mensaje: "Unido a la sala "+this.salas[salaIndex].id, sala: this.salas[salaIndex].getSala()})
	}

	buscarSala(id:number) {
		return this.salas.find(sala => sala.id === id)
	}
	*/