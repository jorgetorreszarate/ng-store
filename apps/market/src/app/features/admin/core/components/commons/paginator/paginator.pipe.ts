import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginator',
  standalone: true
})
export class PaginatorPipe implements PipeTransform {

  transform(data: any[], pagination?: any): any {
    const start = pagination?.start || 1;
    const end = pagination?.end || data.length;
    return data.slice(start - 1, end);
  }

}
