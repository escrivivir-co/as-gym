import { inject, Injectable, signal } from '@angular/core';
import { EstadoJuego, POSICION_TABLERO, SalaBackend, Tablero } from './interfaces/sala';
import { Jugador } from './interfaces/jugador';
import { ServerService } from './server.service';
import { CrearSalaArgs } from './interfaces/crearSala';
import { UnirseASalaCrearSalaArgs } from './interfaces/unirseASala';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  serverService = inject(ServerService);
  usuarioService = inject(UsuarioService);

  constructor() {
    this.serverService.actualizacionDeSala$.subscribe((sala)=> {
      this.desestructurarSala(sala);
    })
   }
  jugador1 = signal<Jugador>({
    nombre: "",
    vidas: 0
  });
   jugador2 = signal<Jugador>({
    nombre: "",
    vidas: 0
  });
   estado = signal<EstadoJuego>("ESPERANDO_COMPAÑERO");
   numeroDeJugador = signal<1|2|undefined>(undefined);
   id = signal<number|undefined>(undefined);
   tablero = signal<Tablero>(["","","","","","","","","",]);

   desestructurarSala(salaBack:SalaBackend){
    console.log("Desestructurando",salaBack)
    this.id.set(salaBack.id);
    this.estado.set(salaBack.estado);
    this.jugador1.set(salaBack.jugadores[0]);
    this.jugador2.set(salaBack.jugadores[1]);
    this.tablero.set(salaBack.tablero);
   }

   /** Crea una sala de juegos, pública o privada */
   crearSala(esPrivada:boolean = false){
    const args:CrearSalaArgs = {
      publica: !esPrivada,
      nombreJugador: this.usuarioService.nombre()
    }
    this.serverService.server.emitWithAck("crearSala",args).then(res => {
      console.log("Crear sala", res)
      this.desestructurarSala(res.sala);
      this.numeroDeJugador.set(1)
    })
   }

   /** Une el cliente a una sala de juegos */
   unirseASala(id: number){
    const args:UnirseASalaCrearSalaArgs = {
      id,
      nombreJugador: this.usuarioService.nombre()
    }
      this.serverService.server.emitWithAck("unirseASala",args).then(res => {
        console.log("Resultado de unión a sala", res)
        this.desestructurarSala(res.sala);
        this.numeroDeJugador.set(2)
      })
   }

   /** Envia al server la petición de un jugador de hacer una jugada */
   jugar(posicion:POSICION_TABLERO){
    console.log("Emitiendo jugada")
    this.serverService.server.emit("jugar",{
      salaId: this.id(),
      jugador: this.numeroDeJugador(),
      posicion
    })
   }
}
