import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMenuState } from '../../../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { IMundo } from '../../../../../../../alephscript/src/FIA/mundos/IMundo';
import { GenericMap } from '../../../../../../../ws-server/src/alephscript/GenericMap';

@Component({
  standalone: true,
  selector: 'app-botonera',
  templateUrl: './botonera.html',
  styleUrls: ['./botonera.css'],
  imports: [CommonModule, DynamicFormComponent]
})
export class BotoneraComponent {

@Input()
	currentApp!: IMenuState;
@Input()
	playStep: boolean = false;

@Output() handleSendSignal = new EventEmitter<{ name: string, value: any }>();

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
		console.log("Datos actualizados")
	}

	handleAccordionEmiter(state: GenericMap) {
		// console.log("State Accordion", state)
	}
}
