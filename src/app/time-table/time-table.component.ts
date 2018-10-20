import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import * as moment from '../../../node_modules/moment/';
import {timeTableEvents} from '../events/timeTableEvents';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
  @Input()
  isShow: boolean;

  eventsTimeTable: any;
  calendarOptionsTimeTable: Options;
  @ViewChild(CalendarComponent) ucCalendarTimeTable: CalendarComponent;

  constructor() { }

  ngOnInit() {
    this.calendarOptionsTimeTable = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: 'ma'
      },
      defaultView: 'agendaWeek',
      locale: 'hu',
      maxTime: moment.duration(22, 'h'),
      minTime: moment.duration(15, 'h'),
      weekends: false,
      contentHeight: 450,
      height: 500,
      events: timeTableEvents
    };
  }
}
