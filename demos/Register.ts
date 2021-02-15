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
