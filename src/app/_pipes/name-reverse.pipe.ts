import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nameReverse'
})
export class NameReversePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    return value.split(' ').reverse().join(' ');
  }
}
