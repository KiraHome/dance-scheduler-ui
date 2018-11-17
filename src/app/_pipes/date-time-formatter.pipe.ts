import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateTimeFormatter'
})
export class DateTimeFormatterPipe implements PipeTransform {

  transform(value: any, args?: any): string {
    const dateValue = new Date(value);
    const days = Math.floor(dateValue.getTime() / 1000 / 60 / 60 / 24);
    const daysUntilNow = Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24);
    if (args && args === 'dateOnly') {
      return dateValue.toLocaleDateString('hu-HU');
    }

    if (days === daysUntilNow) {
      return 'ma ' + dateValue.toLocaleTimeString('hu-HU');
    } else if (dateValue.getDay() === daysUntilNow - 1) {
      return 'tegnap ' + dateValue.toLocaleTimeString('hu-HU');
    } else {
      return dateValue.toLocaleDateString('hu-HU') + ' ' + dateValue.toLocaleTimeString('hu-HU');
    }
  }
}
