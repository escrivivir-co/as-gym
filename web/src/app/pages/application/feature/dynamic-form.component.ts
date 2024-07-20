import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class DynamicFormComponent implements OnInit {
  @Input() jsonObject: any;
  @Output() formSubmit = new EventEmitter<{ name: string, value: any }>();

  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.form = this.createFormGroup(this.jsonObject);
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

  updateJsonObject(original: any, keyPath: string, updated: any) {
	console.log(this.jsonObject, name, updated)
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
