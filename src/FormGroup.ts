import { AbstractControl } from "./AbstractControl";
import { FormType, Status } from "./FormEnuns";

export type Form = { [key: string]: AbstractControl };

export class FormGroup extends AbstractControl {
  private _form: Form;
  private _initialValue: Form;
  private _enabled: boolean;
  private _touched: boolean = false;
  readonly type: FormType = FormType.GROUP;

  reseting = false;

  /**
   * Creates a new `FormGroup` instance.
   *
   * @param form A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param enabled Optional param that Indicate the firstly status of FormGroup instance. The default value is true.
   *
   */
  constructor(form: Form, enabled: boolean = true) {
    super();
    this._initialValue = this._getInitiaValue(form);
    if(!enabled) {
      Object.values(form).forEach(control => control.disable())
    }
    this._form = form;
    this._enabled = enabled;
  }

  get controls() {
    return this._form;
  }

  get enabled() {
    return this._enabled;
  }

  get errors() {
    return Object.values(this._form).reduce<any>((acc, control) => {
      return { ...acc, ...control.errors };
    }, {});
  }

  get errorsMessages(): string[] {
    return this._getErrorsMessages(this._form);
  }

  get firstErrorMessage() {
    return this.errorsMessages.length ? this.errorsMessages[0] : "";
  }

  get status() {
    return this._getStatus(this._form);
  }

  get touched() {
    return this._touched;
  }

  get valid() {
    return this.status == Status.VALID;
  }

  get value() {
    return this._getValues(this._form);
  }

  disable() {
    this._enabled = false;
    Object.values(this._form).forEach((control) => control.disable());
  }

  enable() {
    this._enabled = true;
    Object.values(this._form).forEach((control) => control.enable());
  }

  get(control: string) {
    return this._form[control];
  }

  getInitial() {
    const form = new FormGroup(this._initialValue);
    return form;
  }

  getRawValue() {
    return this._getValues(this._form, false);
  }

  private _getStatus(form: Form): Status {
    const arrayOfStatus = [Status.PENDING, Status.INVALID];
    return Object.values(form).reduce<Status>((acc, control) => {
      if (arrayOfStatus.includes(acc)) return acc;
      if (arrayOfStatus.includes(control.status)) return control.status;

      if (control.type == FormType.GROUP) {
        const localControl = (control as any) as FormGroup;
        return this._getStatus(localControl._form);
      }

      return control.status;
    }, Status.VALID);
  }

  private _getEntries(form: Form, onlyEnabled: boolean = true) {
    return onlyEnabled
      ? Object.entries(form).filter(([key, control]) => control.enabled)
      : Object.entries(form);
  }

  private _getValues(form: Form, onlyEnabled: boolean = true) {
    const entries = this._getEntries(form, onlyEnabled);
    const response: { [key: string]: any } = {};

    entries.forEach(([key, control]) => {
      if (control.type == FormType.GROUP) {
        const localControl = (control as any) as FormGroup;
        response[key] = this._getValues(localControl._form, onlyEnabled);
      }

      response[key] = onlyEnabled ? control.value : control.getRawValue();
    });

    return response;
  }

  private _getInitiaValue(form: Form) {
    const entries = Object.entries(form);
    const response: { [key: string]: any } = {};

    entries.forEach(([key, control]) => {
      response[key] = control.getInitial();
    });

    return response;
  }

  private _getErrorsMessages(form: Form): string[] {
    const contriols = Object.values(form);
    return contriols.reduce<string[]>((acc, control) => {
      return [...acc, ...control.errorsMessages];
    }, []);
  }

  markAllAsTouched() {
    Object.values(this._form).forEach((control) => control.markAsTouched());
  }

  markAsTouched() {
    this.markAllAsTouched();
  }

  reset() {
    this.reseting = true;
    this._form = this._getInitiaValue(this._initialValue);
    this.reseting = false;
  }

  terminate() {
    Object.values(this._form).forEach((control) => control.terminate());
  }

  validate() {
    Object.values(this._form).forEach((control) => control.validate());
  }

  setAsyncValidators() {
    throw Error(
      "This control is a FormGroup. Async Validators is not Allowed in FormGroup"
    );
  }

  setValidators() {
    throw Error(
      "This control is a FormGroup. Validators is not Allowed in FormGroup"
    );
  }
}
