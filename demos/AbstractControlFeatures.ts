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