import { Inject, inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { io } from 'socket.io-client';
import { UsuarioService } from './usuario.service';
import { CrearSalaArgs } from './interfaces/crearSala';
import { UnirseASalaCrearSalaArgs } from './interfaces/unirseASala';
import { SalaBackend } from './interfaces/sala';
import { SalaService } from './sala.service';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
	private ngZone = inject(NgZone);

	server = io("localhost:3000", {autoConnect:false});
	usuarioService = inject(UsuarioService);

	actualizacionDeSala$ = new Subject<SalaBackend>();

	constructor(
		@Inject(PLATFORM_ID) private platformId: object
	) {

		if (isPlatformBrowser(this.platformId)) {
			this.ngZone.runOutsideAngular(() => {
				this.server = io("localhost:3000", {autoConnect:false});
				this.server.on("connect", ()=> {
					console.log("Conectado al back")
				});
				this.server.on("sala",(args)=> {
					this.actualizacionDeSala$.next(args)
				});
				this.server.connect();
			});
		}
	}
}
