import { Observable } from "rxjs";

export type AsyncValidator = () => (
  source$: Observable<any>
) => Observable<any>;

export type SyncValidator = (value: any) => { [key: string]: string } | null;

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

export const Validators = {
  required: (message: string = "This field is required"): SyncValidator => {
    return (value: any) => {
      return isEmptyInputValue(value) ? { required: message } : null;
    };
  },
};
