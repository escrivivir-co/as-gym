import { Component, inject, Inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PrettyJsonPipeV2 } from '../../application/example-prettyjson/pretty-json.pipe';
import { ActivatedRoute } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { SeoService } from '../../../services/seo/seo.service';
import { Feature, FeatureName, Name } from './feature';
import { Dependency } from './dependency';
import { DomSanitizer } from '@angular/platform-browser';
import { IMenuState } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/alephscript/src/FIA/engine/kernel/IMenuState';
import { RunStateEnum } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/alephscript/src/FIA/mundos/RunStateEnum';
import { IMundo } from '../../../../../../alephscript/src/FIA/mundos/IMundo';
import { ServerService } from '../../../services/socketio/server.service';
import { IRuntimeBlock } from '../../../../../../ws-server/src/alephscript/IRuntimeBlock';
import { IServerState } from "../../../../../../ws-server/src/alephscript/IServerState";
import { DynamicFormComponent } from '../../application/feature/dynamic-form.component';

const notValidItems = [" ", "/", "-"]
function removeOccurrences(array: string[], target: string) {
	array.forEach(item => {
	  const regex = new RegExp(item, 'g'); // Create a global regex for the current item
	  target = target.replace(regex, ''); // Replace all occurrences of the item with an empty string
	});
	return target;
  }

export interface ServerNM { name: string };

export interface LogLabel {
	title: string,
	logs: any[]

};

export interface SignalEvent {
	event: string,
	data: {
		engine: string;
		action: string
	}
}

@Component({
	selector: 'app-about',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterOutlet, PrettyJsonPipeV2, DynamicFormComponent],
	templateUrl: './about.component.html',
	styleUrl: './about.component.css',
	encapsulation: ViewEncapsulation.None // https://medium.com/@yaronu/making-angular-component-css-classes-in-innerhtml-work-without-losing-emulated-encapsulation-350d63dbffad
})
export class AboutComponent implements OnInit {

	dependencies: Dependency;
	features: Feature;

	id: number;

	playStep: boolean = false;

	currentApp = signal<IMenuState>({
		index: -1,
		name: "--",
		state: RunStateEnum.STOP,
		mundo: {
			nombre: ""
		},
		bots: []
	});

	IDEapp = signal<LogLabel[]>([{
		title: "Esperando",
		logs: []
	}]);

	IDEFramework = signal<LogLabel>({
		title: "Esperando",
		logs: []
	});

	// mundoraízide
	// idesituada
	// fiasbc
	// modeloide
	// alephscriptassistant
	// fiasbccommonkads
	// commonkads

	serviceNamespaces = signal<ServerNM[]>([]);
	serviceClients = signal<ServerNM[]>([]);
	serviceUsuarios = signal<ServerNM[]>([]);
	serviceRooms = signal<ServerNM[]>([]);

	serviceApps = signal<IMenuState[]>([]);
	serviceModules = signal<FeatureName[]>([]);

	serverService = inject(ServerService);
	accordionState: any = {};

	AppId: number = -1;

	constructor(
		private seoService: SeoService,
		@Inject(PLATFORM_ID) private platformId: object,
		private sanitizer: DomSanitizer,
		private route: ActivatedRoute) {

		const content =
		'Entorno de gimnasio y entrenamiento para unidades Fundamentales ' +
		' de inteligencia artificial';

		const title = 'AlephScript Gym/IDE';
		this.seoService.setMetaDescription(content);
		this.seoService.setMetaTitle(title);

		this.id = 0;

		this.dependencies = {
			namespaces: [
				{ name: 'Angular 17.2.4' }
			],
			sockets: [
				{ name: 'Node.js 18.17.1' },
				{ name: 'Express 4.18.2' },
				{ name: 'pg-promise 11.5.4' },
			]
		};

		this.features = {
			modules: [
				{
					name: 'Angular CLI',
					englishTutorial: 'https://www.escrivivir.co/tutorials/getting-started-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/demarrer-avec-angular',
				}
			],
			apps: [
				{ name: 'Local JSON' },
			]
		};

		this.serverService.serverState$.subscribe(d => this.cargaServerState(d));
		this.serverService.MenuAppsList$.subscribe(d => this.cargaMenuAppState(d));
		this.serverService.chainState$.subscribe((d) => this.cargaChainState(d));

		this.cargaServerState(this.serverService.currentserverState$())
		this.cargaMenuAppState(this.serverService.currentMenuState$())
		this.cargaChainState(this.serverService.currentChainState$())

	}

	cargaMenuAppState(d: IMenuState[]) {
		this.features.apps = d;

		this.serviceApps.set(this.features.apps);

		// Update current
		if (this.currentApp()?.index != -1) {
			// console.log("The set", this.features.apps[this.currentApp()?.index])
			this.currentApp.set(this.features.apps[this.currentApp()?.index])
		} else {
			if (this.AppId != -1) {
				this.findAndSetRoutingApp()
			}
		}
	}

	cargaServerState(d: IServerState) {
		d.sockets = d.sockets || [];

		let sockets: Name[] = [];
		const deps = d.socketsPerNamespace.map(nd => {

			const ndsockets = nd.sockets.map(s => { return { name: nd.name + (s.id || "") } })
			sockets = sockets.concat(ndsockets)
			return {
				name: nd.name + " (" + nd.socketsCount + " sockets)"
			}
		});
		this.dependencies.namespaces = deps;

		this.dependencies.sockets = sockets.flat();

		this.serviceNamespaces.set(this.dependencies.namespaces);
		this.serviceClients.set(this.dependencies.sockets);
		this.serviceRooms.set(d.rooms.map(r => { return {
			name: r.roomId + " (" + r.miembros.length + ") miembros :>" + r.miembros?.map(s => s.usuario.substring(0, 5) + s.sesion?.substring(0, 5)).join(":> ")
		}}))
		this.serviceUsuarios.set(d.miembros.map(r => { return {
			name: r.usuario + " (" + (r.sesiones?.length || 0) + ") sockets :>" + r.sesiones?.map(s => s.substring(0, 5)).join(":>")
		}}))
	}

	cargaChainState(d: IRuntimeBlock) {
		if (d.id != "FIA" && d.id != this.currentApp().name + "") {
			console.log("DEPRECATED SUSCRIPTION TO ChainState. Use new method, app-room. REFUSE TO LOG AS APP NAMES DONT MATCH", this.currentApp().name, d.id)
		};

		this.IDEapp.set([]);

		this.features.modules = Object.keys(d.estado)
			.sort(
				(a: string, b: string) => a.toUpperCase() > b.toUpperCase() ? 1 : -1
			)
			.map((k: string) => {

				const savedK = removeOccurrences(notValidItems, k);
				this.accordionState[savedK] = this.accordionState[savedK] == undefined ? false : this.accordionState[savedK];
				this.IDEapp().push({
					title: savedK,
					logs: d.estado[k].map((e: any) => { return { title: e.estado } })
				});

				return {
					name: k,
					englishTutorial: d.estado[k].length,
					frenchTutorial: ''
				}
		});
		// ("Send new modules", this.features.modules)
		this.serviceModules.set(this.features.modules);
	}

	onCheckboxChange(event: Event): void {

		const checkbox = event.target as HTMLInputElement;
		this.playStep = checkbox.checked;

	}

	sendSignal(signal: SignalEvent) {
		this.serverService.sendEngineAction(signal);
	}

	setCurrentApp(app: IMenuState) {

		this.currentApp.set(app);

		this.serviceModules.set([]);
		this.IDEapp.set([]);

	}

	ngOnInit(): void {

		const content =
			'Cette application a été développée avec Angular version 16.1.7 et bootstrap 5.3.2' +
			' Elle applique le Routing, le Lazy loading, le Server side rendering et les Progressive Web App (PWA)';

		const title = 'AlephScript UI/UX | About';

		this.seoService.setMetaDescription(content);
		this.seoService.setMetaTitle(title);
		this.playStep = true

    	this.route.paramMap.subscribe(params => {

			this.AppId = parseInt(params.get('id') || '-1', 10);
			this.findAndSetRoutingApp()
    	});

	}

	findAndSetRoutingApp() {
		if (this.AppId) {
			const app = this.serviceApps().find(a => a.index == this.AppId)
			if ( app )this.setCurrentApp(app)
		}
	}

	saveAccordionState(key: string) {

		if (
			Object.keys(this.accordionState).find(k => k == key)
		) {
			this.accordionState[key] = !this.accordionState[key];
		} else {
			this.accordionState[key] = false;
		}

		// console.log("Accordion state is now", key, this.accordionState)
	}

	getLogAsJson(data: string ) {
		try {
			return JSON.parse(data).map((t: any) => {
				return {
					...t,
					historial: t.historial.map((h: any) => JSON.parse(h))
				}
			})
		} catch {
			return {
				data
			}
		}
	}

	sanitize(data: string) {
		return this.sanitizer.bypassSecurityTrustHtml(data);
	}

	getASCREEN(data: LogLabel[]): LogLabel[] {
		const d = data.find(d => d.title == "ASCREEN")
		return d ? [d] : []

	}

	get(key: string, data: LogLabel[]): LogLabel[] {
		return data.filter(d => (d.title).toUpperCase().includes(key.toUpperCase()))

	}

	getMundoPaginator(m: Partial<IMundo>): {
		actual: number;
		dias: number[]
	} {

		const actual = m?.modelo?.dia || 0;
		const dias = Array.from({ length: (m?.modelo?.dia || 0) + 1}, (_, index) => index);
		// console.log("Paginator mundo", actual, dias)
		return {
			actual,
			dias

		}
	}

	handleFormSubmit(updatedObject: any) {
		console.log('Formulario actualizado:', updatedObject);
		// Aquí puedes manejar el objeto actualizado, por ejemplo, cerrar el modal y pasar el objeto a un componente padre.
	  }
}
