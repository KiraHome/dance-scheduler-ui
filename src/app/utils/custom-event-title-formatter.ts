import {Inject, LOCALE_ID} from '@angular/core';
import {CalendarEvent, CalendarEventTitleFormatter} from 'angular-calendar';
import {DatePipe} from '@angular/common';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  month(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )} - ${new DatePipe(this.locale).transform(
      event.end,
      'HH:mm',
      this.locale
    )}</b> ${event.title}`;
  }

  week(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )} - ${new DatePipe(this.locale).transform(
      event.end,
      'HH:mm',
      this.locale
    )}</b> ${event.title}`;
  }

  day(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )} - ${new DatePipe(this.locale).transform(
      event.end,
      'HH:mm',
      this.locale
    )}</b> ${event.title}`;
  }
}
