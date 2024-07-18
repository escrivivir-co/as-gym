import { Component, inject, Inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PrettyJsonPipeV2 } from '../../application/example-prettyjson/pretty-json.pipe';

import { PLATFORM_ID } from '@angular/core';

import { SeoService } from '../../../services/seo/seo.service';
import { Feature, FeatureName, Name } from './feature';
import { Dependency } from './dependency';
import { ServerService, MenuState, RuntimeBlock } from '../../../services/socketio/server.service';
import { DomSanitizer } from '@angular/platform-browser';

export enum RunStateEnum {
	PLAY = "PLAY",
	PLAY_STEP = "PLAY_STEP",
	RESUME = "RESUME",
	PAUSE = "PAUSE",
	STOP = "STOP"
}

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
	imports: [CommonModule, RouterLink, RouterOutlet, PrettyJsonPipeV2],
	templateUrl: './about.component.html',
	styleUrl: './about.component.css',
	encapsulation: ViewEncapsulation.None // https://medium.com/@yaronu/making-angular-component-css-classes-in-innerhtml-work-without-losing-emulated-encapsulation-350d63dbffad
})
export class AboutComponent implements OnInit {

	dependencies: Dependency;
	features: Feature;

	id: number;

	playStep: boolean = false;

	currentApp = signal<MenuState>({
		index: -1,
		name: "--",
		state: RunStateEnum.STOP,
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

	serviceApps = signal<MenuState[]>([]);
	serviceModules = signal<FeatureName[]>([]);

	serverService = inject(ServerService);
	accordionState: any = {};

	constructor(
		private seoService: SeoService,
		@Inject(PLATFORM_ID) private platformId: object,
		private sanitizer: DomSanitizer) {

		const content = 'About content with meta';
		this.seoService.setMetaDescription(content);

		this.id = 0;

		this.dependencies = {
			namespaces: [
				{ name: 'Angular 17.2.4' },
				{ name: 'Angular CLI 17.2.3' },
				{ name: 'Angular SSR 17.2.3' },
				{ name: 'Bootstrap 5.3.3' },
				{ name: 'Font Awesome 6.5.1' },
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
				},
				{
					name: 'Routing',
					englishTutorial: 'https://www.escrivivir.co/tutorials/routing-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/routing-avec-angular',
				},
				{
					name: 'Lazy loading',
					englishTutorial: 'https://www.escrivivir.co/tutorials/lazy-loading-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/lazy-loading-avec-angular',
				},
				{
					name: 'Bootstrap',
					englishTutorial: 'https://www.escrivivir.co/tutorials/bootstrap-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/bootstrap-avec-angular',
				},
				{
					name: 'Server side Rendering',
					englishTutorial: 'https://www.escrivivir.co/tutorials/server-side-rendering-with-angular-universal',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/server-side-rendering-avec-angular-universal',
				},
				{
					name: 'HTTPClient',
					englishTutorial: 'https://www.escrivivir.co/tutorials/httpclient-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/httpclient-avec-angular',
				},
				{
					name: 'Transfer State',
					englishTutorial: 'https://www.escrivivir.co/tutorials/transfer-state-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/transfer-state-avec-angular',
				},
				{
					name: 'Progressive Web App',
					englishTutorial: 'https://www.escrivivir.co/tutorials/progressive-web-app-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/progressive-web-app-avec-angular',
				},
				{
					name: 'Search Engine optimization',
					englishTutorial: 'https://www.escrivivir.co/tutorials/search-engine-optimization-with-angular',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/search-engine-optimization-avec-angular',
				},
				{
					name: 'Components',
					englishTutorial: '',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/components-avec-angular',
				},
				{
					name: 'Services',
					englishTutorial: '',
					frenchTutorial: 'https://www.escrivivir.co/tutorials/services-avec-angular',
				},
			],
			apps: [
				{ name: 'Local JSON' },
				{ name: 'RESTFull API' },
				{ name: 'CRUD API' },
				{ name: 'Database Creation' },
				{ name: 'Data Import' },
				{ name: 'Data Export' },
			]
		};

		this.serverService.serverState$.subscribe(d => {

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
		});

		this.serverService.menuState$.subscribe(d => {

			this.features.apps = d;

			this.serviceApps.set(this.features.apps);

			// Update current
			if (this.currentApp()?.index != -1) {
				this.currentApp.set(this.features.apps[this.currentApp()?.index])
			}

		});

		this.serverService.chainState$.subscribe((d: RuntimeBlock) => {

			if (d.id != "FIA" && d.id != this.currentApp().name + "") {
				console.log("REFUSE TO LOG AS APP NAMES DONT MATCH", this.currentApp().name, d.id)
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

		});
	}

	onCheckboxChange(event: Event): void {

		const checkbox = event.target as HTMLInputElement;
		this.playStep = checkbox.checked;

	}

	sendSignal(signal: SignalEvent) {
		this.serverService.sendEngineAction(signal);
	}

	setCurrentApp(app: MenuState) {

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

}
