import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(value: string) {
    return value === 'PEN' ? 'S/' : value;
  }

}