import { Component, inject, OnInit, signal } from '@angular/core';

import { FeatureName } from '../../general/about/feature';
import { LogLabel } from '../../general/about/about.component';
import { IServerService } from '../../../services/socketio/server.service';
import { IRuntimeBlock } from '../../../../../../ws-server/src/alephscript/IUserDetails';

export interface LogData {
	title: string,
	data: any
};

@Component({
	selector: 'alephas-feature',
	templateUrl: './component.html',
	styleUrls: ['./component.css'],
	standalone: true
})
export class FeatureComponent implements OnInit {

	// fases = Object.keys(CKFases2).map((k: any) => (CKFases2 as any)[k])
	filtro = signal<LogLabel[]>([{
		title: "Esperando",
		logs: []
	}]);

	logs = signal<LogData[]>([{
		title: "Esperando",
		data: {}
	}]);

	serviceModules = signal<FeatureName[]>([]);

	selected: LogData = {
		title: "Esperando",
		data: {}
	};
	selectedFiltro: LogLabel = {
		title: "Esperando",
		logs: []
	};

	serverService = inject(ServerService);

	constructor() {

		this.serverService.web.io.emit("CLIENT_SUSCRIBE", { room: "IDE-app" });

		this.serverService.chainState$.subscribe((d: IRuntimeBlock) => {

			this.filtro.set([]);

			const keys = Object.keys(d?.estado || {});
			const fs: LogLabel[] = []
			const data = keys.map((k: string) => {

				fs.push({
					title: k,
					logs: d.estado[k].map((e: any) => { return { title: e.estado.substring(0, 50) } })
				});
			});

			this.filtro().push(...fs);

			if (keys.length > 0 && this.selectedFiltro.title === "Esperando") {
				const defaultFiltro = { target: { value: keys[0] } }
				this.onChangeFiltro(defaultFiltro);
			}

		});
	}

	ngOnInit(): void {

	}

	select(log: LogData): void {
		this.selected = log;
		console.log("the log", log)
	}

	onChangeFiltro($event: any): void {

		const f = this.filtro().find(f => f.title === $event.target.value);
		if (f) {
			console.log("ApplyFilter", f.title)
			this.selectedFiltro = f;
			this.logs.set(this.selectedFiltro.logs);
		}

	}

}
