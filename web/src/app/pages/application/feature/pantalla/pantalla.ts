import { Component, Input } from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DiapositivaComponent } from './diapositiva/diapositiva';
import { GenericMap } from '../../../../../../../ws-server/src/alephscript/GenericMap';
import { parse } from 'path';


declare var impress: any;

@Component({
  standalone: true,
  selector: 'app-pantalla',
  templateUrl: './pantalla.html',
  styleUrls: ['./pantalla.css'],
  imports: [CommonModule, ReactiveFormsModule, DiapositivaComponent]
})
export class PantallaComponent extends DynamicFormComponent{

	sliders: any[] = []
	constructor(
		@Inject(PLATFORM_ID) private platformId: object
	) {
		super();

	}

	ngAfterViewInit(): void {

		if (isPlatformBrowser(this.platformId)) {
			impress().init();
			   // Re-enable scrollbars after impress.js initialization
			   document.body.style.overflow = 'auto'; // Restore scrollbars for the body
			   document.documentElement.style.overflow = 'auto'; // Restore scrollbars for the html element
			   document.body.style.height = 'auto'; // Set height back to auto
			   document.documentElement.style.height = 'auto'; // Set height back to auto
		}
	}

	override handleAccordionEmiter(state: GenericMap) {
		// console.log(this.level, "handleAccordionEmiter", this.accordState)
		super.handleAccordionEmiter(state);
		// console.log(Object.keys(this.jsonObject).join("/"), this.level, state);
	}

	parseInt(x: string): number {
		return this.parseInt(x);
	}

	override handlePopUpEvent(event: any) {
		const pathKey = Object.keys(event)[0];
		const currentKey = [...pathKey].pop();
		console.log("Set new slider for", pathKey, "level", event.level, "currentKey", currentKey, event[pathKey]);
		const slider = {
			key: pathKey,
			datax: -500,
			datay: event.level * 500,
			level: event.level,
			jsonObject: event[pathKey]
		}
		this.sliders.push(slider);
		// console.log(this.sliders)
		super.handlePopUpEvent(event);
	}
}
