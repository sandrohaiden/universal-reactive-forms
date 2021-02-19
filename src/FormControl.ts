import { combineLatest, Observable, Subject } from "rxjs";
import { Observables, observe } from "rxjs-observe";
import { tap } from "rxjs/internal/operators/tap";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { filter } from "rxjs/internal/operators/filter";
import { AbstractControl } from "./AbstractControl";
import { FormType, Status } from "./FormEnuns";
import { v4 } from "uuid";
import { skip } from "rxjs/internal/operators/skip";
import { first } from "rxjs/internal/operators/first";
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import { AsyncValidator, SyncValidator } from "./Validators";

type ValueSetter = ((value: any) => any) | null | undefined;

export interface FormControlOptions {
  enabled: boolean;
  valueSetter?: ValueSetter;
}

export class FormControl extends AbstractControl {
  readonly type = FormType.CONTROL;

  private _observables: Observables<{ value: any }>;
  private _proxy: { value: any };
  private _enabled = true;
  private _validators: any[] = [];
  private _asyncValidators: any[] = [];
  private _asyncErrors: { [key: string]: any } = {};
  private _errors: { [key: string]: any } = {};

  private _initialValue: any;
  private _initialEnabled: boolean;
  private _touched: boolean = false;
  private _valueSetter: ValueSetter = null;

  private unsubscribe$: Subject<any> = new Subject();
  private unsubscribeSync$: Subject<any> = new Subject();
  private unsubscribeAsync$: Subject<any> = new Subject();
  private pendingAsyncValidatorsRegister: { [key: string]: boolean } = {};
  private pendingValidatorsRegister: boolean = false;
  private emitEvent: boolean = true;

  /**
   *
   * @param initialValue value for `FormControl`.
   *
   * @param validators Array with initial sync Validators.
   * @param asyncValidators Array with initial async Validators.
   * @param opts Object of options to `FormControl`
   */
  constructor(
    initialValue: any,
    validators?: SyncValidator[],
    asyncValidators?: AsyncValidator[],
    opts?: FormControlOptions
  ) {
    super();
    const { observables, proxy } = observe<{ value: any }, any>({
      value: initialValue,
    });
    this._proxy = proxy;
    this._observables = observables;
    this._initialValue = initialValue;

    if (!opts) {
      opts = {
        enabled: true,
        valueSetter: null,
      };
    }

    this._enabled = opts.enabled;
    this._initialEnabled = opts.enabled;
    this._valueSetter = opts.valueSetter;

    if (validators) {
      this._validators = [...validators];
      this.setValidators(validators);
    }

    if (asyncValidators) {
      this._asyncValidators = [...asyncValidators];
      this.setAsyncValidators(asyncValidators);
    }

    this.subscriberTouched();
  }

  getInitial() {
    const control = new FormControl(
      this._initialValue,
      [...this._validators],
      this._asyncValidators,
      {
        enabled: this._initialEnabled,
        valueSetter: this._valueSetter,
      }
    );

    return control;
  }

  getRawValue() {
    return this.value;
  }

  setAsyncValidators(asyncValidators: AsyncValidator[]) {
    this.unsubscribeAsync$.next();
    const observables: Observable<any>[] = [];
    asyncValidators.forEach((validator) => {
      const id = v4();
      const observable = this._changesForValidators.pipe(
        takeUntil(this.unsubscribeAsync$),
        tap(() => (this.pendingAsyncValidatorsRegister[id] = true)),
        validator(),
        tap(() => (this.pendingAsyncValidatorsRegister[id] = false))
      );

      observables.push(observable);
    });

    combineLatest(observables)
      .pipe(takeUntil(this.unsubscribeAsync$))
      .subscribe((res: any) => {
        this._asyncErrors = {};
        res
          .filter((err: any) => err)
          .forEach((result: any) => {
            this._asyncErrors = { ...this._asyncErrors, ...result };
          });
      });
  }

  setValidators(validators: SyncValidator[]) {
    this._changesForValidators
      .pipe(
        takeUntil(this.unsubscribeSync$),
        tap(() => (this.pendingValidatorsRegister = true))
      )
      .subscribe((value) => {
        this._errors = {};
        validators.forEach((validator) => {
          const validation = validator(value);
          if (validation) this._errors = { ...this._errors, ...validation };
        });
      });
  }

  setValue(value: any, emitEvent: boolean = true) {
    this.emitEvent = emitEvent;
    this.value = value;
    this.emitEvent = true;
  }

  reset() {
    this.terminate();
    this._touched = false;

    this.value = this._initialValue;

    this.subscriberTouched();

    this.setValidators(this._validators);
    this.setAsyncValidators(this._asyncValidators);
  }

  enable() {
    this._enabled = true;
  }

  disable() {
    this._enabled = false;
  }

  markAsTouched() {
    this._touched = true;
  }

  markAllAsTouched() {
    this.markAsTouched();
  }

  subscriberTouched() {
    (this._observables.value as Observable<any>)
      .pipe(
        skip(1),
        debounceTime(400),
        tap(() => (this._touched = true)),
        first()
      )
      .subscribe();
  }

  terminate() {
    this.unsubscribe$.next();
    this.unsubscribeSync$.next();
    this.unsubscribeAsync$.next();
  }

  validate() {
    const cache = this.value;
    this.value = cache;
  }

  private get _changesForValidators() {
    return this._observables.value as Observable<any>;
  }

  get valid() {
    return this.status == Status.VALID;
  }

  get errors() {
    return this._touched ? { ...this._errors, ...(this.pending ? {} : this._asyncErrors) } : {};
  }

  get errorsMessages() {
    return this._touched ? Object.values(this.errors) : [];
  }

  get firstErrorMessage() {
    return this.errorsMessages.length ? this.errorsMessages[0] : "";
  }

  get touched() {
    return this._touched;
  }

  get value() {
    return this._proxy.value;
  }

  set value(value: any) {
    if (this._valueSetter) value = this._valueSetter(value);
    this._proxy.value = value;
  }

  get valueChanges(): Observable<any> {
    return (this._observables.value as Observable<any>).pipe(
      filter(() => this.emitEvent)
    );
  }

  get enabled() {
    return this._enabled;
  }

  get status() {
    if (
      Object.values({
        ...this.pendingAsyncValidatorsRegister,
      }).filter((item) => item).length &&
      this.pendingValidatorsRegister
    )
      return Status.PENDING;

    return Object.values({...this._errors, ...this._asyncErrors}).length ? Status.INVALID : Status.VALID;
  }

  get(control: string): AbstractControl {
    throw Error(
      "This control is a FormControl. Is not possible get another control in FormControl"
    );
  }
}
