import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TelemetryMonitorComponent } from '../telemetry-monitor/telemetry-monitor.component';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';
import { RuleListComponent } from '../rule-list/rule-list.component';
import { ChatBuilderComponent, CodeContainer } from '../../chat-builder/chat-builder.component';
import { IMenuState } from '../../../../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
import { PrologService } from '../../../../../services/logic/prolog.service';

@Component({
	standalone: true,
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	imports: [TelemetryMonitorComponent, RuleEditorComponent,
		RuleListComponent, ChatBuilderComponent]
})
export class DashboardComponent {

@Input() theApp: any = { app: '' }; // Input value from the parent component

	private m_currentApp: any// IMenuState;
	rules: any[] = [];

	public theAppCode: CodeContainer = { content: {
		rules: [],
		raw: ""
	}}// IMenuState;


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

	constructor(private prologService: PrologService) {

	}

	ngOnChanges(changes: SimpleChanges) {
		// Check if inputValue has changed
		if (changes['theApp'] && !changes['theApp'].isFirstChange()) {
			console.log("Refresh for AAddddd", this.theApp)
			this.loadRules(this.theApp.app); // Trigger load function when inputValue changes
		}

	}

	sendSignal(signal: any) {
		console.log("send", signal)
		this.handleSendSignal.emit(signal)
	}

	onRuleSaved(rule: any) {
		// Trigger a refresh of the rule list
		console.log("On saved", rule)
		this.refreshRuleList(rule?.app);
	}

	appSelected(app: string) {
		// Trigger a refresh of the rule list
		console.log("On appSelected", app)
		this.refreshRuleList(app);
		this.loadRules(app)
	}

	refreshRuleList(app: string) {
		this.theApp = {
			app
		};
	}

	loadRules(app: string) {

		if (!app) {
			this.rules = [];
			return;
		}

		/*this.prologService.getRules(app).subscribe(
		(rules) => {
			console.log("Refresh for AA", this.theApp, rules)
			this.rules = rules;
			this.theAppCode = this.rules;
		},
		(error) => {
			console.error('Error loading rules:', error);
		}
		);*/

		this.prologService.getTemplateContent(app).subscribe(
			(response) => {

				const data = (response as unknown as  CodeContainer).content;
				this.rules = data.rules;
				console.log("Refresh for AA", this.theApp, this.rules.length)
				this.theAppCode = (response as unknown as  CodeContainer);
			},
			(error) => {
				console.error('Error loading rules:', error);
			});
	}

}
