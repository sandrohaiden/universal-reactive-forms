import { FormType, Status } from "./FormEnuns";
import { AsyncValidator, SyncValidator } from "./Validators";
import { v4 } from "uuid";

export type ValidationErrors = { [key: string]: string }

export abstract class AbstractControl {
  abstract readonly type: FormType;

  readonly id: string = v4();

  /**
   * If this form is enabled, `true` will be returned, in the case of disabled,` false` will be returned.
   */
  abstract get enabled(): boolean;

  /**
   * Return a object with error keys and your message.
   */
  abstract get errors(): ValidationErrors;

  /**
   * Return a array of error`s messages.
   */
  abstract get errorsMessages(): string[];

  /**
   * If the actual status is `INVALID`, `true` will be returned.
   */
  get invalid(): boolean {
    return this.status == Status.INVALID;
  }

  /**
   * If there are any error messages, the first in the queue will be returned, if there is no empty string it will be returned.
   */
  abstract get firstErrorMessage(): string;

  /**
   * If the actual status is `PENDING`, `true` will be returned.
   */
  get pending(): boolean {
    return this.status == Status.PENDING;
  }

  /**
   * Return the actual status.
   */
  abstract get status(): Status;

  /**
   * Return the actual status of touched.
   */
  abstract get touched(): boolean;

  /**
   * If the actual status is `VALID`, `true` will be returned.
   */
  get valid(): boolean {
    return this.status == Status.VALID;
  }

  /**
   * Return the current value of your item and all child form items (if enabled).
   */
  abstract get value(): any;

  abstract set value(value: any);

  /**
   * Set this form to state disabled.
   */
  abstract disable(): void;

  /**
   * Set this form to state enabled.
   */
  abstract enable(): void;

  /**
   * This method return a Abstract control with name that was passed in param.
   *
   * @param control Name of control that want return.
   *
   */
  abstract get(control: string): AbstractControl;

  /**
   * Return the initial value that this control was created.
   */
  abstract getInitial(): any;

  /**
   * Get all the real value of this form item and all of your enabled and disabled children.
   */
  abstract getRawValue(): any;

  /**
   * Marks the control and all its descendant controls as touched.
   */
  abstract markAllAsTouched(): void;

  /**
   * Marks the control as touched.
   */
  abstract markAsTouched(): void;

  /**
   * If this Form Item is a FormControl, this method  will be set async Validators.
   * @param asyncValidators Array of AsyncValidators.
   */
  abstract setAsyncValidators(asyncValidators: AsyncValidator[]): void;

  /**
   * If this Form Item is a FormControl, this method will set one primary error manually. If a change in value is detected,
   * these errors will be discarted.
   * @param errors Object with one Key and message string as value.
   */
  abstract setErrors(errors: ValidationErrors): void;

  /**
   * If this Form Item is a FormControl, this method  will be set sync Validators.
   * @param validator Array of Validators.
   */
  abstract setValidators(validators: SyncValidator[]): void;

  /**
   * Force validation in this Form Item and its all child.
   */
  abstract validate(): void;

  /**
   * Auxiliary method to finalize all internal Observables of form items.
   * It should only be used when the form will no longer be used.
   */
  abstract terminate(): void;
}
