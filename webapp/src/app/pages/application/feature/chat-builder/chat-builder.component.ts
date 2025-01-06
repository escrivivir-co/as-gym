import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMenuState } from '../../../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
import { Completion } from '../../../../../../../alephscript/src/FIA/aplicaciones/iot-logic-engine/Completion';
import { ServerService } from '../../../../services/socketio/server.service';


export interface CodeContainer { content: { rules: any[], raw: string } }

@Component({
	standalone: true,
	selector: 'app-chat-builder',
	templateUrl: './chat-builder.component.html',
	styleUrls: ['./chat-builder.component.css'],
	imports: [FormsModule, CommonModule]
})
export class ChatBuilderComponent {


@Input() theApp: any = { app: '' }; // Input value from the parent component

	editor1Content: string = '';
	editor2ContentA: string = '';
	editor2ContentB: string = '';
	editor2ContentC: string = '';
	editor2ContentD: string = '';
	mergedContent: string = '';

  	private m_currentApp: any// IMenuState;
	private m_theAppCode: CodeContainer = { content: {
		rules: [],
		raw: ""
	}}

@Input()
	get theAppCode(): CodeContainer {
		return this.m_theAppCode;
	}
	set theAppCode(value: CodeContainer) {
		this.m_theAppCode = value;
	}

@Input()
	  get currentApp(): IMenuState {
		  return this.m_currentApp;
	  }
	  set currentApp(value: IMenuState) {
		  console.log("Set", value?.mundo?.modelo?.dominio?.base)
		  this.m_currentApp = value;
	  }

@Output()
	handleSendSignal = new EventEmitter<{ name: string, value: any }>();

	ngOnChanges(changes: SimpleChanges) {

		if (changes['currentApp'] && !changes['currentApp'].isFirstChange()) { 
			this.sendSignal({
				event: "CLIENT_SUSCRIBE",
				room: this.currentApp.mundo.nombre
			})
		}

		// Check if inputValue has changed
		if (changes['theAppCode'] && !changes['theAppCode'].isFirstChange()) {
			const content = (changes['theAppCode'].currentValue as CodeContainer)?.content;
			this.mergedContent = content?.raw;
			this.m_theAppCode.content.rules = (content?.rules && Array.isArray(content.rules))
				? content.rules : [];
		}

	}

	serverService = inject(ServerService);

	constructor() {

		this.serverService.IAresponses$.asObservable().subscribe(d => {
			console.log("IA", d)

			let dd: Completion;
			try {
				const first = Array.isArray(d) && d.length > 0 ? d[0] : {ram: {}, request: "", response: "", code: "", analytics: ""};
				dd = JSON.parse(first?.data?.text?.value);
			} catch(ex) {
				const first = Array.isArray(d) && d.length > 0 ? d[0] : {ram: {}, request: "", response: "", code: "", analytics: ""};
				dd = JSON.parse(first?.data?.text?.value);
			}

			if (typeof d.response == "string") {
				this.editor2ContentA = dd.response;
			} else {
				this.editor2ContentA = JSON.stringify(dd.response);
			}
			this.editor2ContentB = Array.isArray(dd.code) && d.length > 0 ? dd.code[0] : (dd.code + "");
			this.editor2ContentB = JSON.stringify(dd.ram);
			this.editor2ContentB = JSON.stringify(dd.analytics);

			/*"{
				"ram": {
					"data": "El usuario ha solicitado un programa básico en Prolog que defina sensores y actuadores.",
					"index": ["sensores", "actuadores", "monitorización", "activación"]
				},
				"request": "Crea un programa básico, 'app.pl', que defina un par de sensores y otro par de actuadores. El módulo exportará todos los métodos necesarios para: a) Monitorizar el estado de los sensores, b) Activar un valor en algún actuador.",
				"response": {
					"code": [
						"module(app).",
						"",
						"% Definición de sensores",
						"sensor(temperatura).",
						"sensor(humedad).",
						"",
						"% Definición de actuadores",
						"actuador(ventilador).",
						"actuador(calefactor).",
						"",
						"% Monitorizar el estado de los sensores",
						"monitorizar(Sensor, Estado) :-",
						"    sensor(Sensor),",
						"    obtener_estado(Sensor, Estado).",
						"",
						"% Activar un actuador",
						"activar(Actuador, Valor) :-",
						"    actuador(Actuador),",
						"    establecer_valor(Actuador, Valor).",
						"",
						"% Simulación de obtener estado de un sensor",
						"obtener_estado(temperatura, 25).",
						"obtener_estado(humedad, 60).",
						"",
						"% Simulación de establecer valor en un actuador",
						"establecer_valor(ventilador, encendido).",
						"establecer_valor(calefactor, apagado)."
					]
				},
				"code": "app.pl",
				"analytics": {
					"metrics": [
						"Solicitudes de creación de módulos Prolog",
						"Interacción con sensores y actuadores"
					]
				}
			}"*/
		});
	}

	kitSave(_t31: any,$event: MouseEvent) {
		throw new Error('Method not implemented.');
	}
	kitRun(_t31: any,$event: MouseEvent) {
	throw new Error('Method not implemented.');
	}
	kitDelete(_t31: any,$event: MouseEvent) {
	throw new Error('Method not implemented.');
	}
	onSubmit(_t31: any,$event: SubmitEvent) {
	throw new Error('Method not implemented.');
	}

	// Save the current content of Editor 1
	saveEditor1Content() {
		localStorage.setItem('editor1Content', this.editor1Content);
		console.log('Editor 1 content saved!');
		this.sendSignal({
			event: "GET_DOMAIN_LOGIC_DATA",
			room: this.currentApp.mundo.nombre,
			data: {
				engine: this.m_currentApp.index,
				action: "SET_DATA",
				blob: {
					message: this.editor1Content
				}
			}
		})
	}

	sendSignal(signal: any) {
		this.handleSendSignal.emit(signal)
	}

	// Reset Editor 1 content to the saved value
	resetEditor1Content() {
		this.editor1Content = localStorage.getItem('editor1Content') || '';
		alert('Editor 1 content reset!');
	}

	// Save the current content of Editor 2
	saveEditor2Content() {
		localStorage.setItem('editor2Content', this.editor2ContentA);
		alert('Editor 2 content saved!');
	}

	// Reset Editor 2 content to the saved value
	resetEditor2Content() {
		this.editor2ContentA = localStorage.getItem('editor2Content') || '';
		alert('Editor 2 content reset!');
	}

	// Merge the contents of both editors
	mergeContents() {
		if (confirm('Do you want to merge Editor 1 and Editor 2 content?')) {
			this.mergedContent = `${this.editor1Content}\n\n${this.editor2ContentA}`;
			alert('Content merged!');
		}
	}

	// Discard the merged content
	discardMerge() {
		this.mergedContent = '';
		alert('Merged content discarded.');
	}

	// Optionally, you can expose a method to handle external updates.
	externalUpdate(editor1Update: string, editor2Update: string) {
		if (confirm('External update detected. Do you want to merge the new content?')) {
			this.editor1Content = editor1Update;
			this.editor2ContentA = editor2Update;
			this.mergeContents();
		} else {
			alert('External update discarded.');
		}
	}
}
