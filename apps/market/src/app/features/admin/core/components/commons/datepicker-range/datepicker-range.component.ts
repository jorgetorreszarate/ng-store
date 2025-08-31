import { BsDatepickerConfigureModule } from '@admin-core/config';
import { bsDatepickerOptions } from '@admin-core/constants';
import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, Optional, Self, input } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-datepicker-range',
  templateUrl: './datepicker-range.component.html',
  styleUrl: './datepicker-range.component.scss',
  imports: [NgClass, DatePipe, BsDatepickerConfigureModule],
})
export class DatepickerRangeComponent implements OnInit, ControlValueAccessor {
  options = input<Partial<BsDatepickerConfig>>();
  bsConfig!: Partial<BsDatepickerConfig>;
  bsValue: Date[];
  disabled: boolean;

  onTouched!: (value: string) => void;
  onChanged!: () => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this
    } else {
      throw new Error('No se ha definido un FormControl válido para el componente');
    };
  }

  ngOnInit(): void {
    this.bsConfig = Object.assign({}, bsDatepickerOptions, this.options());
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  writeValue(values?: Date[]): void {
    this.bsValue = values;// || [new Date(), new Date()];
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setRangePicker(event: Date[]): void {
    this.bsValue = event;
    this.updateValue();
  }

  updateValue(): void {
    // Para que actualice el formControl debe llamarse a onChange, pero en este caso referencia a self control
    setTimeout(() => {
      this.control.setValue(this.bsValue);
    });
  }
}
