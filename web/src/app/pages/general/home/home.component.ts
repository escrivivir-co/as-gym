import { inject, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { environment } from '../../../../environments/environment';

import { SeoService } from '../../../services/seo/seo.service';
import { ServerService } from '../../../services/socketio/server.service';
import { IMenuState } from '../../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
import { ServerNM } from '../about/about.component';
import { IServerState } from '../../../../../../ws-server/src/alephscript/IServerState';
import { DynamicFormComponent } from '../../application/feature/dynamic-form.component';

/*
{
	icon: "fa-solid fa-file-lines",
	description: "Css linear-gradient",
	link: '/landing-page',

	index: -1,
	name: "--",
	state: RunStateEnum.STOP,
	mundo: {
		nombre: ""
	},
	bots: []
}
*/
export interface IFiaBox extends IMenuState {
	icon: string; // "fa-solid fa-file-lines",
	name: string; // "Landing Page",
	description: string; // "Css linear-gradient",
	link: string; // '/landing-page'
}

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterOutlet, DynamicFormComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

	name = environment.application.name;
	angular = environment.application.angular;
	bootstrap = environment.application.bootstrap;
	fontawesome = environment.application.fontawesome;

	serviceUsuarios = signal<ServerNM[]>([]);
	serviceRooms = signal<ServerNM[]>([]);
	serviceNamespaces = signal<ServerNM[]>([]);
	serviceClients = signal<ServerNM[]>([]);

	items = signal<IFiaBox[]>([]);
	icos = [
		{
			icon: "fa-solid fa-file-lines",
		},
		{
			icon: "fa-solid fa-address-card",
		},
		{
			icon: "fa-brands fa-bootstrap",
		},
		{
			icon: "fa-sharp fa-solid fa-newspaper",
		},
		{
			icon: "fa-solid fa-chart-simple",
		},
		{
			icon: "fa-brands fa-readme",
		},
		{
			icon: "fa-solid fa-blender-phone",
		},
		{
			icon: "fa-solid fa-screwdriver-wrench",
		},
		{
			icon: "fa-solid fa-network-wired",
		},
		{
			icon: "fa-regular fa-rectangle-list",
		},
		{
			icon: "fa-regular fa-window-restore",
		},
		{
			icon: "fa-solid fa-spell-check",
		},
		{
			icon: "fa-regular fa-comment-dots",
		}
	]
	serverService = inject(ServerService);

	jsonObject = {
		name: 'John Doe',
		age: 30,
		isEmployed: true,
		address: {
		  street: '123 Main St',
		  city: 'Anytown',
		  zipcode: '12345'
		},
		skills: [
		  { skillName: 'Programming', experience: 5 },
		  { skillName: 'Design', experience: 3 }
		]
	  };

	constructor(private seoService: SeoService) {

		const content =
			'Entorno de gimnasio y entrenamiento para unidades Fundamentales ' +
		' de inteligencia artificial';

		const title = 'AlephScript Gym/IDE';

		this.seoService.setMetaDescription(content);
		this.seoService.setMetaTitle(title);

		this.serverService.MenuAppsList$.asObservable().subscribe(d => {
			this.cargaDatos(d)
		})
		this.cargaDatos(this.serverService.currentMenuState$())

		this.serverService.serverState$.subscribe(d => this.cargaServerState(d));
		this.cargaServerState(this.serverService.currentserverState$())
	}


	cargaDatos(menus: IMenuState[]) {
		// console.log("carga datos", menus)
		const apps: IFiaBox[] = menus
				.map((m, index) => {
					return {
						... m,
						icon: this.icos[index].icon,
						description: m.mundo.nombre + "/" + m.mundo.modelo?.nombre,
						link: '/about/' + m.index
					}
				}).sort((a, b) => (a.mundo.runState || "") > (b.mundo.runState || "") ? -1 : 1);

		this.items.set(apps)
	}

	cargaServerState(d: IServerState) {

		let sockets: ServerNM[] = [];
		this.serviceNamespaces.set( d.socketsPerNamespace.map(nd => {

			const ndsockets = nd.sockets.map(s => { return { name: nd.name + (s.id || "") } })
			sockets = sockets.concat(ndsockets)
			return {
				name: nd.name + " (" + nd.socketsCount + " sockets)"
			}
		}));
		this.serviceClients.set(sockets.flat());

		this.serviceRooms.set(d.rooms.map(r => { return {
			name: r.roomId + " (" + r.miembros.length + ") miembros. :>" + r.miembros?.map(s => s.usuario + s.sesion).join(":> ")
		}}))
		this.serviceUsuarios.set(d.miembros.map(r => { return {
			name: r.usuario + " (" + (r.sesiones?.length || 0) + ") sockets. :>" + r.sesiones?.map(s => "[" + s + "]").join(":> ")
		}}))
	}


}
