import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  standalone: true
})
export class DropdownComponent implements ControlValueAccessor {
  // Estructura de los items: {id: any, name: string, description: string}
  readonly items = input<any[]>([]);
  readonly value = signal<any>(null);
  readonly disabled = signal<boolean>(false);

  onChange: (value: string) => void;
  onTouch: () => void;

  updateValue(): void {
    // Para que actualice el formControl debe llamarse a onChange
    if (this.onChange) {
      this.onChange(this.value());
    }
  }

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selected(item: any): void {
    this.value.set(item.id);

    this.updateValue();
  }

  get itemSelected() {
    return this.items().find(item => item.id == this.value()) || {} as any;
  }

}
