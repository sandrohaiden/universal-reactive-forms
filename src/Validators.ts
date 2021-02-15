import { Observable } from "rxjs";

export type AsyncValidator = () => (
  source$: Observable<any>
) => Observable<any>;

export type SyncValidator = (value: any) => { [key: string]: string } | null;

export class Validators {
  static required(message: string = "This field is required"): SyncValidator {
    return (value: any) => (value ? null : { required: message });
  }
}
