import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMenuState } from '../../../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
export interface CodeContainer { content: { rules: any[], raw: string } }

@Component({
	standalone: true,
	selector: 'app-chat-builder',
	templateUrl: './chat-builder.component.html',
	styleUrls: ['./chat-builder.component.css'],
	imports: [FormsModule, CommonModule]
})
export class ChatBuilderComponent {
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

@Input() theApp: any = { app: '' }; // Input value from the parent component

	editor1Content: string = '';
	editor2Content: string = '';
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
		// Check if inputValue has changed
		if (changes['theAppCode'] && !changes['theAppCode'].isFirstChange()) {
			const content = (changes['theAppCode'].currentValue as CodeContainer)?.content;
			this.mergedContent = content?.raw;
			this.m_theAppCode.content.rules = (content?.rules && Array.isArray(content.rules))
				? content.rules : [];
		}

	}

	// Save the current content of Editor 1
	saveEditor1Content() {
		localStorage.setItem('editor1Content', this.editor1Content);
		console.log('Editor 1 content saved!');
		this.sendSignal({
			event: "SET_DOMAIN_LOGIC_DATA",
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
		localStorage.setItem('editor2Content', this.editor2Content);
		alert('Editor 2 content saved!');
	}

	// Reset Editor 2 content to the saved value
	resetEditor2Content() {
		this.editor2Content = localStorage.getItem('editor2Content') || '';
		alert('Editor 2 content reset!');
	}

	// Merge the contents of both editors
	mergeContents() {
		if (confirm('Do you want to merge Editor 1 and Editor 2 content?')) {
			this.mergedContent = `${this.editor1Content}\n\n${this.editor2Content}`;
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
			this.editor2Content = editor2Update;
			this.mergeContents();
		} else {
			alert('External update discarded.');
		}
	}
}


