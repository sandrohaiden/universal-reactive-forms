# Universal Reactive Forms

Forms management library powered by RxJs, strongly inspired by Angular's Reactive Forms.


# Instalation

```sh
npm install universal-reactive-forms
```

## Why?

The existing solutions for managing forms for the Vue framework (and other libs / frameworks javascript in general) known to the author, do not fully meet the expectations of functionalities, especially when complex validation is necessary and there may be the possibility of interaction of several fields.

A great example of forms management are the impressive reactive forms of Angular, which is the basis of inspiration for the construction of this library.

## Usage

The universal-reactive-forms provides three types of form items, which are **FormGroup**, **FormArray** and **FormControl**:

    import { FormControl, FormArray, FormGroup } from "universal-reactive-forms";
    class RegisterClass {
      addressForm = new FormGroup({
        street: new FormControl("Canudeiro"),
        houseNumber: new FormControl("31"),
      });
    
      myFormArray = new FormArray([
        new FormControl("111-1111111"),
        new FormControl("222-2222222"),
        new FormControl("555-5555555"),
      ]);
    
      myForm = new FormGroup({
        name: new FormControl("Sandro"),
        lastName: new FormControl("Haiden"),
        contactNumbers: this.myFormArray,
        address: this.addressForm,
      });
    }
   
   All types of form items extend the AbstractControl class, so they have properties and methods in common:
   

        import { FormArray, FormControl, FormGroup } from "universal-reactive-forms";
    
    export class Features {
        formGroup = new FormGroup({});
        formArray = new FormArray([]);
        formControl = new FormControl('first value');
        constructor() {
            console.log(this.formGroup.type);
            console.log(this.formArray.type);
            console.log(this.formControl.type);
            
            console.log(this.formGroup.errors);
            console.log(this.formArray.errors);
            console.log(this.formControl.errors);
            
            console.log(this.formGroup.errorsMessages);
            console.log(this.formArray.errorsMessages);
            console.log(this.formControl.errorsMessages);
            
            console.log(this.formGroup.status);
            console.log(this.formArray.status);
            console.log(this.formControl.status);
            
            console.log(this.formGroup.valid);
            console.log(this.formArray.valid);
            console.log(this.formControl.valid);
            
            console.log(this.formGroup.value);
            console.log(this.formArray.value);
            console.log(this.formControl.value);
            
            console.log(this.formGroup.enabled);
            console.log(this.formArray.enabled);
            console.log(this.formControl.enabled);
            
            this.formGroup.disable();
            this.formArray.disable();
            this.formControl.disable();
            
            console.log(this.formGroup.getRawValue());
            console.log(this.formArray.getRawValue());
            console.log(this.formControl.getRawValue());
            
            this.formGroup.enable();
            this.formArray.enable();
            this.formControl.enable();
        }
    }
   **FormControl** occupies a prominent role, as it is the one that has support for synchronous and asynchronous validators, besides to notifying about its changes through the `valueChanges` property, which is an observable:
   

    import { Observable } from "rxjs";
    import { debounceTime, map } from "rxjs/operators";
    import { FormControl, Validators } from "universal-reactive-forms";
    
    export class ControlExample {
        customAsyncValidator = () => {
            return (source$: Observable<string>) =>
              source$.pipe(
                debounceTime(3500),
                map((value) =>
                  value.length > 8 && value.includes("valid")
                  ? null : { notValid: "Some message error" }
                )
              );
          };
        
          syncValidators = [Validators.required("Custom Message")];
          asyncValidators = [this.customAsyncValidator];
        
          control = new FormControl('', this.syncValidators, this.asyncValidators)
        
          constructor() {
              this.control.valueChanges
                .subscribe()
          }
    }
    
   To change the value of a **FormControl**, the new value can be directly assigned to the **value** property:

    formControl.value = "My new Value";
    
  To assign a new value to a FormControl, the `setValue()`  method can also be used, this method is especially useful when it is necessary that the value change is not notified, for that, it is only necessary to pass as a second argument a false Boolean:

    formControl.setValue("new value", false);
 
Each type of form item has the `reset()` method, this method will reset the form item to its initial state at the time it was created, included its values and validators.

If you need the value set in the FormControl to be converted in some way, a parsing function can be specified within an object that must be passed as the last argument in the FormControl constructor:

    const control = new FormControl(21, null, null, {
      enabled: true,
      valueSetter: (value: any) => Number(value),
    });

The status of form item groupers (**FormGroup** and **FormArray**) is based on its internal items (**FormGroup**, **FormArray** and **FormControl**). From the beginning, the Status is already calculated, but errors in **FormControls** are only released when the internal touched property is true.

Therefore, when submitting, it is always a good idea, in case the form has errors, use the `markAllAsTouched()` method, in order to release **FormControls** errors in which there was no interaction or change in value:

    submit() {
      if (this.myForm.valid) {
        console.log("all fine");
      } else {
        this.myForm.markAllAsTouched();
        console.log("Nope");
      }
    }

Definitions of common methods among Form Items:

	export abstract class AbstractControl {
      abstract readonly type: FormType;

      readonly id: string = nanoid();

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

   
## WIP
- Better documentation :point_right::point_left:.
- Tests :point_right::point_left:.
- Possible bug fixes  :point_right::point_left:.
- Demo (with Vue and Vuetify :smirk:).
- Possible new features.
- More sync validators. 