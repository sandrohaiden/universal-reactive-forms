import { AbstractControl, ValidationErrors } from "./AbstractControl";
import { FormType, Status } from "./FormEnuns";

export class FormArray extends AbstractControl {
  readonly type = FormType.ARRAY;

  private _formArray: AbstractControl[] = [];
  private _initialFormArray: AbstractControl[] = [];
  private _initialEnabled: boolean;
  private _touched: boolean = false;
  private _enabled: boolean;

  /**
   *
   * @param controls A vector of form items.
   * @param enabled Optional param that Indicate the firstly status of FormArray instance. The default value is true.
   */
  constructor(controls: AbstractControl[] = [], enabled: boolean = true) {
    super();
    this._initialFormArray.push(...controls.map((item) => item.getInitial()));
    this._enabled = enabled;
    this._initialEnabled = enabled;
    for (const item of controls) {
      if (!enabled) item.disable();
      this.push(item);
    }
  }

  get value(): any[] {
    return this._formArray
      .filter((control) => control.enabled)
      .map((control) => control.value);
  }

  get enabled() {
    return this._enabled;
  }

  get errorsMessages(): string[] {
    return Object.values(this.errors);
  }

  get firstErrorMessage() {
    return this.errorsMessages.length ? this.errorsMessages[0] : "";
  }

  get errors() {
    return this._formArray.reduce((acc, control) => {
      return { ...acc, ...control.errors };
    }, {});
  }

  get controls() {
    return this._formArray;
  }

  get status(): Status {
    const arrayOfStatus = [Status.PENDING, Status.INVALID];
    return this._formArray.reduce((acc: Status, control) => {
      if (arrayOfStatus.includes(acc)) return acc;
      if (arrayOfStatus.includes(control.status)) return control.status;

      return control.status;
    }, Status.VALID);
  }

  get touched() {
    return this._touched;
  }

  enable() {
    this._enabled = true;
    this._formArray.map((control) => control.enable());
  }

  disable() {
    this._enabled = false;
    this._formArray.map((control) => control.disable());
  }

  getInitial() {
    return new FormArray(this._initialFormArray, this._initialEnabled);
  }

  getRawValue() {
    return this._formArray.map((control) => control.value);
  }

  markAllAsTouched() {
    this._touched = true;
    this._formArray.map((control) => control.markAsTouched());
  }

  markAsTouched() {
    this.markAllAsTouched();
  }

  push(control: AbstractControl) {
    return this._formArray.push(control);
  }

  pop() {
    return this._formArray.pop();
  }

  insert(control: AbstractControl, index: number) {
    return this._formArray.splice(index, 0, control);
  }

  removeAt(index: number) {
    return this._formArray.splice(index, 1);
  }

  reset() {
    this._formArray = new FormArray(this._initialFormArray)._initialFormArray;
  }

  terminate() {
    this._formArray.forEach((control) => control.terminate());
  }

  validate() {
    this.controls.forEach((control) => {
      control.validate();
    });
  }

  setAsyncValidators(): void {
    throw Error(
      "This control is a FormArray. Async Validators is not Allowed in FormArray"
    );
  }

  setErrors(errors: ValidationErrors) {
    throw Error(
      "This control is a FormArray. FormArray not have a logic defined for setErrors method."
    );
  }

  setValidators(): void {
    throw Error(
      "This control is a FormArray. Validators is not Allowed in FormArray"
    );
  }

  get(): AbstractControl {
    throw Error(
      "This control is a FormArray. Get control is not Allowed in FormArray"
    );
  }
}
