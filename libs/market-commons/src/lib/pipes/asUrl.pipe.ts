import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asUrl',
  standalone: true
})
export class AsUrlPipe implements PipeTransform {

  transform(value: string): string {
    return value ? `url("${value}")` : '';
  }

}
