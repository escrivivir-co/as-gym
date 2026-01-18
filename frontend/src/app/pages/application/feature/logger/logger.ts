import { Component,  Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PrettyJsonPipeV2 } from '../../example-prettyjson/pretty-json.pipe';
import { LogLabel } from '../../../general/about/about.component';

@Component({
  standalone: true,
  selector: 'app-logger',
  templateUrl: './logger.html',
  styleUrls: ['./logger.css'],
  imports: [CommonModule, PrettyJsonPipeV2]
})
export class LoggerComponent implements OnChanges {

	newData: boolean = false;

	lastCount = 0;

	private m_IDEapp: LogLabel[]  = []

@Input()
	set IDEapp(value: LogLabel[]) {
		this.m_IDEapp = value;
	}
	get accordionState(): LogLabel[] {
		return this.m_IDEapp;
	}

@Input()
	filterKey: string = "";

	loggerState: { [key: string]: boolean } = {};

	constructor(private sanitizer: DomSanitizer) {

	}

	saveLoggerState(title: string): void {
		this.loggerState[title] = !this.loggerState[title];
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

	sanitize(value: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(value);
	}

	get(): LogLabel[] {

		if (this.filterKey) {
			return (this.m_IDEapp || [])
				.filter(d => (d.title).toUpperCase()
				.includes(this.filterKey.toUpperCase()))
		} else {
			return this.m_IDEapp;
		}


	}

	rowsState = {};

	ngOnChanges(changes: SimpleChanges) {

		if (changes["IDEapp"] && changes["IDEapp"].currentValue) {

			const rows = this.get();

		if (this.lastCount == 0 && rows.length == 0) {
				this.newData = false;
			} else {
				this.lastCount = rows.length;
				this.blink();
			}


		}
	}
	blink(){
		// this.newData = true;
		// setTimeout(() => this.newData = false, 250)
	}

}


