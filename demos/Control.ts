import { Observable } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { FormControl, Validators } from "universal-reactive-forms";

export class ControlExample {
    customAsyncValidator = () => {
        return (source$: Observable<string>) =>
          source$.pipe(
            debounceTime(3500),
            map((value) =>
              value.length > 8 && value.includes("valid") ? null : { notValid: "Some message error" }
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