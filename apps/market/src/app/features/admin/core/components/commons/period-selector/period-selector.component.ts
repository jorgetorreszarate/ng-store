import { BsDatepickerConfigureModule } from '@admin-core/config';
import { bsDatepickerOptions } from '@admin-core/constants';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Optional, Self, model } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

type QuickType = 'day' | 'week' | 'month' | 'year' | 'custom' | string;

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
  imports: [DatePipe, BsDatepickerConfigureModule]
})
export class PeriodSelectorComponent implements OnInit, ControlValueAccessor {
  readonly quick = model<QuickType>();
  bsValue: Date[];
  periods: any[] = [];
  disabled: boolean;

  bsConfig = bsDatepickerOptions;

  onTouched!: (value: string) => void;
  onChanged!: () => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this
    } else {
      throw new Error('No se ha especificado un valor al formControl del componente period-selector');
    }
  }

  ngOnInit(): void {
    this.setQuickValue(this.quick());
  }

  get control() {
    return this.ngControl.control as FormControl;
  }

  writeValue(values?: Date[]): void {
    this.bsValue = values || [new Date(), new Date()];
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  addDaysTo(days: number, date?: Date): Date {
    let time = new Date(date?.getTime() || Date.now()).setHours(0, 0, 0);
    return new Date(time + days * 24 * 60 * 60 * 1000);
  }

  setQuickValue(value: QuickType): void {
    this.quick.set(value);
    this.changePeriod([new Date(), new Date()]);
  }

  changePeriod(period: Date[]): void {
    this.bsValue = period;
    this.quickSearchChanges(this.quick());
  }

  quickSearchChanges(quickValue: QuickType): void {
    let [start, end] = this.bsValue;

    if (!start || !end) {
      return;
    }

    switch (quickValue) {
      case 'day':
        this.periods = [
          [this.addDaysTo(-1, start), this.addDaysTo(-1, start)],
          [start, end],
          [this.addDaysTo(1, start), this.addDaysTo(1, start)],
        ];

        break;
      case 'week':
        const dayOfWeek = start.getDay();
        start = this.addDaysTo(-dayOfWeek, start);
        end = this.addDaysTo(6, start);

        this.periods = [
          [this.addDaysTo(-7, start), this.addDaysTo(-1, start)],
          [start, end],
          [this.addDaysTo(1, end), this.addDaysTo(7, end)],
        ];

        break;
      case 'month':
        const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
        start = new Date(start.getFullYear(), start.getMonth(), 1);
        end = this.addDaysTo(daysInMonth - 1, start);

        const endDateBeforeMonth = this.addDaysTo(-1, start);
        const firstDateBeforeMonth = new Date(endDateBeforeMonth.getFullYear(), endDateBeforeMonth.getMonth(), 1);

        const firstDateNextMonth = this.addDaysTo(1, end);
        const daysInNextMonth = new Date(firstDateNextMonth.getFullYear(), firstDateNextMonth.getMonth() + 1, 0).getDate();
        const lastDateNextMonth = this.addDaysTo(daysInNextMonth - 1, firstDateNextMonth);

        this.periods = [
          [firstDateBeforeMonth, endDateBeforeMonth],
          [start, end],
          [firstDateNextMonth, lastDateNextMonth],
        ];

        break;
      case 'year':
        start = new Date(start.getFullYear(), 0, 1);
        end = new Date(end.getFullYear(), 11, 31);

        this.periods = [
          [new Date(start.getFullYear() - 1, 0, 1), new Date(end.getFullYear() - 1, 11, 31)],
          [start, end],
          [new Date(start.getFullYear() + 1, 0, 1), new Date(end.getFullYear() + 1, 11, 31)],
        ];

        break;
    }

    this.bsValue = [start, end];
  }

  setRangePicker(event: Date[]): void {
    this.bsValue = event;
    this.updateValue();
  }

  updateValue(): void {
    // Para que actualice el formControl debe llamarse a onChange, pero en este caso referencia a self control
    setTimeout(() => {
      this.control.setValue(this.bsValue);
    }, 1);
  }

}
