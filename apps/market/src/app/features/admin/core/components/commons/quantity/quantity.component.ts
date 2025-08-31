import { CustomValidators } from '@admin-core/validators';
import { NgClass } from '@angular/common';
import { Component, OnInit, Optional, Self, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { LongPressDirective } from '@market-commons';

@Component({
  selector: 'choose-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
  imports: [NgClass, FormsModule, ReactiveFormsModule, LongPressDirective],
  providers: []
})
export class QuantityComponent implements OnInit, ControlValueAccessor {
  readonly size = input<string>();
  readonly unit = input<string>();

  readonly isLoading = signal<boolean>(false);
  readonly disabled = signal<boolean>(false);

  onTouched!: (value: string) => void;
  onChanged!: () => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    ngControl && (ngControl.valueAccessor = this);
  }

  ngOnInit() {
    this.control.addValidators(CustomValidators.OnlyNumbers);
  }

  get control() {
    return this.ngControl.control as FormControl;
  }

  writeValue(value: any): void { }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Functions custom
  isWeight(): boolean {
    return ['KGR', 'GRM'].includes(this.unit());
  }

  getWeight(): void {
    this.isLoading.set(true);
    this.control.setValue(0);
  }

  incrementQty() {
    const value = +this.control.value + 1;
    this.control.setValue(value);
  }

  decrementQty() {
    let value = +this.control.value;
    if (value > 1) value--;
    this.control.setValue(value);
  }

}
