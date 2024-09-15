import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IMenuState } from '../../../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { IMundo } from '../../../../../../../alephscript/src/FIA/mundos/IMundo';
import { GenericMap } from '../../../../../../../ws-server/src/alephscript/GenericMap';
import { ChatRoomComponent } from '../chat/component';
import { LogLabel } from '../../../general/about/about.component';
import { LoggerComponent } from '../logger/logger';

@Component({
  standalone: true,
  selector: 'app-botonera',
  templateUrl: './botonera.html',
  styleUrls: ['./botonera.css'],
  imports: [CommonModule, DynamicFormComponent, ChatRoomComponent, LoggerComponent]
})
export class BotoneraComponent {

@Input()
	IDEapp: LogLabel[] = [];

	private m_currentApp: any// IMenuState;

@Input()
	get currentApp(): IMenuState {
		return this.m_currentApp;
	}
	set currentApp(value: IMenuState) {
		console.log("Set", value?.mundo?.modelo?.dominio?.base)
		this.m_currentApp = value;
	}


@Input()
	playStep: boolean = false;

	currentPopUp = signal<any>({
		value: ''
	});

@Output()
	handleSendSignal = new EventEmitter<{ name: string, value: any }>();
@Output() popUpEmiter = new EventEmitter<GenericMap>();

	onCheckboxChange(event: any) {
    	this.playStep = event.target.checked;
  	}

  	sendSignal(signal: any) {
		this.handleSendSignal.emit(signal)
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

	handleFormSubmit($event: { name: string; value: any; }) {
		console.log("Datos actualizados", $event)

		this.sendSignal({
			event: "SET_DOMAIN_BASE_DATA",
			data: {
				engine: this.m_currentApp.index,
				action: "SET_DATA",
				blob: $event
			}
		})
	}

	handleAccordionEmiter(state: GenericMap) {
		// console.log("State Accordion", state)
	}

	handlePopUpEvent($event: GenericMap, master: boolean) {

		// console.log("Set", $event, master)
		if (master) {
			this.currentPopUp.set({... $event  });
			this.popUpEmiter.emit($event)
		} else {
			this.currentPopUp.set({... $event  });
		}

	}
}
