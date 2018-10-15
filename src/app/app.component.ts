import { Component, ViewChild } from '@angular/core';
import { Options } from 'fullcalendar';
import { CalendarComponent } from 'ng-fullcalendar';
import * as $ from '../../node_modules/jquery/dist/jquery.js';
import { timeTableEvents } from './events/timeTableEvents.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isShowTimeTable: boolean;
  isShowPersonalClasses: boolean;

  time = {};
  day = {};

  eventsTimeTable = {};
  eventsPersonal = {};
  calendarOptionsTimeTable: Options;
  calendarOptionsPersonal: Options;
  @ViewChild(CalendarComponent) ucCalendarTimeTable: CalendarComponent;
  @ViewChild(CalendarComponent) ucCalendarPersonal: CalendarComponent;

  constructor(private modalService: NgbModal) {
  }

  isLoggedInAdmin(): boolean {
    return window.localStorage.getItem('credentials') === 'ADMIN';
  }

  logout(): void {
    window.localStorage.removeItem('credentials');
  }

  showTimeTable(): void {
    this.isShowTimeTable = true;
    this.isShowPersonalClasses = false;
  }

  showPersonalClasses(): void {
    this.isShowTimeTable = false;
    this.isShowPersonalClasses = true;
  }

  addEvent(content): void {
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop' }).result.then(() => {
      let endTime;
      if (this.time.minute <= 15) {
        endTime = this.time.hour + ':' + (this.time.minute + 45);
      } else {
        endTime = (this.time.hour + 1) + ':' + (this.time.minute - 15);
      }
      const event = [{
        id: 'extra',
        title: 'Eronleti Kittivel',
        start: this.time.hour + ':' + this.time.minute,
        end: endTime,
        dow: [this.day],
        color: '#be4a47',
        textColor: 'white'
      }];
      $('#time-personal-calendar').fullCalendar('renderEvents', event, true);
    });
  }

  removeEvent(): void {
    const event = ['extra'];
    $('#time-personal-calendar').fullCalendar('removeEvents', event);
  }

  ngOnInit() {
    this.calendarOptionsTimeTable = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      defaultView: 'agendaWeek',
      locale: 'hu',
      maxTime: '22:00',
      minTime: '15:00',
      weekends: false,
      contentHeight: 450,
      height: 500,
      events: timeTableEvents
    };

    this.calendarOptionsPersonal = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      defaultView: 'agendaWeek',
      locale: 'hu',
      maxTime: '22:00',
      minTime: '07:00',
      weekends: false,
      contentHeight: 450,
      height: 500,
      events: []
    };
  }
}
