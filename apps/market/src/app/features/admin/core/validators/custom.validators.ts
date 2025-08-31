import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { GlobalPatterns } from "./patterns";

export namespace CustomValidators {
  export const OnlyNumbers = Validators.pattern(GlobalPatterns.Numbers);
  export const DNI = Validators.pattern(GlobalPatterns.DNI);
  export const RUC = Validators.pattern(GlobalPatterns.RUC);
  export const PlacaVehiculo = Validators.pattern(GlobalPatterns.PlacaVehiculo);
  export const greaterThan = (value: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      return +control.value > value ? null : { greaterThan: true };
    }
  }
}