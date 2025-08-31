import { Component, Self, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@market-commons';

@Component({
  selector: 'app-currency-amount',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './currency-amount.component.html',
  styleUrl: './currency-amount.component.scss'
})
export class CurrencyAmountComponent implements ControlValueAccessor {
  readonly currency = input.required<string>();
  readonly size = input<string>();
  readonly disabled = signal<boolean>(false);

  onTouched!: (value: string) => void;
  onChanged!: () => void;

  constructor(@Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  writeValue(value: any): void { }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

}
