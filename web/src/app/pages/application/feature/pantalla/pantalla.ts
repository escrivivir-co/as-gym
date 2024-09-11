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


		const off = this.getOffset(event.dir, event.origin_datax, event.origin_datay);

		const slider = {
			key: pathKey,
			datax: off.datax,
			datay: off.datay,
			level: event.level,
			jsonObject: event[pathKey]
		}
		console.log("Set new slider for", pathKey, "level", event.level,
			"from",event.origin_datax, "/", event.origin_datay,  "direction",
			event.dir, " at", slider.datax, "/", slider.datay);
		this.sliders.push(slider);
		impress().init();
		console.log("Number of sliders", this.sliders.length, "Impress refreshed")
		super.handlePopUpEvent(event);
	}

	getOffset(dir: number, odatax: number, odatay: number): { datax: number, datay: number } {

		let datax: number = odatax;
		let datay: number = odatay;

		const offset = 1000;
		switch(dir) {
			case 0: //left
				datax = odatax - offset;
				break;
			case 1: //down
				datay = odatay + offset;
				break;
			case 2: //up
				datay = odatay - offset;
				break;
			case 3: //right
				datax = odatax + offset;
				break
		}

		return {
			datax,
			datay
		}
	}
}
