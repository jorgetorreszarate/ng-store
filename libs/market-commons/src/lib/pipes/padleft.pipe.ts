import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padleft',
  standalone: true
})
export class PadLeftPipe implements PipeTransform {

  transform(value: any, n: number): string {
    return value?.toString().length < n ? (String('0').repeat(n) + value).substr((n * -1), n) : value;
  }

}
