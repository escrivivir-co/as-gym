import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericMap } from '../../../../../../../ws-server/src/alephscript/GenericMap';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class DynamicFormComponent implements OnInit {

@Output() accordionEmiter = new EventEmitter<GenericMap>();
@Output() formSubmit = new EventEmitter<{ name: string, value: any }>();

	form: FormGroup = new FormGroup({});
	jsonObject: any;
	accordState: GenericMap = {};

@Input()
	set accordionState(value: object) {
		this.accordState = value;
		this.onInputChange(value);
	}
	get accordionState(): GenericMap {
		return this.accordState;
	}

@Input() id: string = "";
@Input() level: number = 0;
@Input()
	set dataInput(value: object) {
		this.jsonObject = value;
		this.onInputChange(value);
	}
	get dataInput(): string {
		return this.jsonObject;
	}

	getStateSize() {
		return Object.keys(this.accordState).length
	}

	ngOnChanges(changes: SimpleChanges): void {

		if (changes['dataInput']) {
			this.form = this.createFormGroup(changes['dataInput'].currentValue);
			this.onInputChange(changes['dataInput'].currentValue);
		}

		if (changes['accordionState'] /*&& this.accordState != changes['accordionState'].currentValue*/) {
			// console.log(this.level, "OnStateChange", changes['accordionState'], this.accordState, this.jsonObject)
		}
	}

	onInputChange(value: any) {
		const dia = value?.mundo?.modelo?.dia;
		// if (dia) console.log(this.level, 'Input value changed in child:', value?.mundo?.modelo?.dia);
	}

	ngOnInit(): void {
		this.form = this.createFormGroup(this.jsonObject);
	}

	getKey(key: string) {
		return  "_" + this.level + key
	}

	saveAccordionState(key: string) {

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

	createFormGroup(jsonObject: any): FormGroup {
	const group: any = {};
	for (const key of Object.keys(jsonObject)) {
		const value = jsonObject[key];
		if (typeof value === 'boolean') {
		group[key] = new FormControl(value, Validators.required);
		} else if (typeof value === 'number') {
		group[key] = new FormControl(value, [Validators.required, Validators.pattern("^[0-9]*$")]);
		} else if (typeof value === 'string') {
		group[key] = new FormControl(value, Validators.required);
		} else if (Array.isArray(value)) {
		group[key] = new FormArray(value.map(v => this.createFormGroup(v)));
		} else if (typeof value === 'object' && value !== null) {
		group[key] = this.createFormGroup(value);
		}
	}
	return new FormGroup(group);
	}

	getInputType(value: any): string {
	if (typeof value === 'boolean') {
		return 'checkbox';
	} else if (typeof value === 'number') {
		return 'number';
	} else if (typeof value === 'string') {
		return 'text';
	}
	return 'text';
	}

	isFormControl(control: AbstractControl | null): control is FormControl {
	return control instanceof FormControl;
	}

	isFormGroup(control: AbstractControl | null): control is FormGroup {
	return control instanceof FormGroup;
	}

	isFormArray(control: AbstractControl | null): control is FormArray {
	return control instanceof FormArray;
	}

	getFormArrayControls(control: AbstractControl | null): AbstractControl[] {
	return this.isFormArray(control) ? control.controls : [];
	}

	onSubmit() {
		this.formSubmit.emit({ name: '', value: this.form.getRawValue() });
	}

	handleNestedSubmit(event: { name: string, value: any }) {
		const { name, value } = event;
		this.updateJsonObject(this.jsonObject, name, value);
		this.formSubmit.emit({ name, value: this.jsonObject });
	}

	handleAccordionEmiter(state: GenericMap) {
		// console.log(this.level, "handleAccordionEmiter", this.accordState)
		this.accordionEmiter.emit(state);
	}

	updateJsonObject(original: any, keyPath: string, updated: any) {
		console.log("Propagando cambios nested", "Nivel", this.level/*, this.jsonObject, name, updated*/)
		if (keyPath.includes("ARRAY")){
			const field = keyPath.split("ARRAY")[0]
			const i = keyPath.split("ARRAY")[1]
			this.jsonObject[field][i] = updated
		} else {
			this.jsonObject[keyPath] = updated
		}
	}

	updateJsonObject2(original: any, keyPath: string, updated: any) {
		const keys = keyPath.split('ARRAY');
		let current = original;
		for (let i = 0; i < keys.length - 1; i++) {
			current = current[keys[i]];
		}
		const lastKey = keys[keys.length - 1];
		if (updated instanceof Array && current[lastKey] instanceof Array) {
			for (let i = 0; i < updated.length; i++) {
			if (typeof updated[i] === 'object' && updated[i] !== null) {
				this.updateJsonObject(current[lastKey][i], '', updated[i]);
			} else {
				current[lastKey][i] = updated[i];
			}
			}
		} else if (typeof updated === 'object' && updated !== null) {
			this.updateJsonObject(current[lastKey], '', updated);
		} else {
			current[lastKey] = updated;
		}
	}

	getObject(key: any, i: number) {
		try {
			return this.jsonObject[key.key][i];
		} catch (ex) {
			console.log(ex);
			return {
			error: "ex"
			};
		}
	}

}
