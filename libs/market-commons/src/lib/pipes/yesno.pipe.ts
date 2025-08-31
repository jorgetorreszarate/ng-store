import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesno',
  standalone: true
})
export class YesnoPipe implements PipeTransform {

  transform(value: any, yes: string = 'Si', no: string = 'No'): any {
    return value ? yes : no;
  }

}
