import { Component, Input, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { GenericMap } from '../../../../../../../../ws-server/src/alephscript/GenericMap';


@Component({
  standalone: true,
  selector: 'app-diapositiva',
  templateUrl: './diapositiva.html',
  styleUrls: ['./diapositiva.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class DiapositivaComponent extends DynamicFormComponent{
	data_x: number = 0;

	@Input()
	set dataX(value: number) {
		this.data_x = value;
		this.onInputChange(value);
	}
	get dataX(): number {
		return this.data_x;
	}

	constructor(
		@Inject(PLATFORM_ID) private platformId: object
	) {
		super();

	}

	ngAfterViewInit(): void {

		if (isPlatformBrowser(this.platformId)) {

		}
	}

	override ngOnChanges(changes: SimpleChanges): void {

		super.ngOnChanges(changes);

		if (changes['dataX'] /*&& this.accordState != changes['accordionState'].currentValue*/) {
			// console.log(this.level, "OnStateChange", changes['accordionState'], this.accordState, this.jsonObject)
		}
	}

	override saveAccordionState(key: string) {

		key = this.getKey(key);
		if (
			Object.keys(this.accordionState).find(k => k == key)
		) {
			this.accordionState[key] = !this.accordionState[key];
		} else {
			this.accordionState[key] = true;
		}
		this.accordionEmiter.emit(this.accordState)

	}

	override handleAccordionEmiter(state: GenericMap) {
		// console.log(this.level, "handleAccordionEmiter", this.accordState)
		super.handleAccordionEmiter(state);
		// console.log(Object.keys(this.jsonObject).join("/"), this.level);
	}

	override handlePopUpEvent(event: any) {
		const pathKey = Object.keys(event)[0];
		const currentKey = [...pathKey].pop();
		// console.log("Pop for", pathKey, "level", event.level, "currentKey", currentKey, event[pathKey]);
		super.handlePopUpEvent(event);
	}

}
