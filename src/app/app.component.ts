import {Component, OnInit, ViewChild} from '@angular/core';
import {Options} from 'fullcalendar';
import {CalendarComponent} from 'ng-fullcalendar';
import * as $ from '../../node_modules/jquery/dist/jquery.js';
import * as moment from '../../node_modules/moment/';
import {timeTableEvents} from './events/timeTableEvents';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isShowTimeTable: boolean;
  isShowPersonalClasses: boolean;
  isShowPayments: boolean;

  time: any;
  day: any;

  eventsTimeTable: any;
  eventsPersonal: any;
  calendarOptionsTimeTable: Options;
  calendarOptionsPersonal: Options;
  @ViewChild(CalendarComponent) ucCalendarTimeTable: CalendarComponent;
  @ViewChild(CalendarComponent) ucCalendarPersonal: CalendarComponent;

  dates = this.enumerateDates(new Date('2018-10-01'), new Date('2019-06-01'));
  paymentTable = [
    ['Dansator #1', true, true, false, false, false, false, false, false],
    ['Dansator #2', true, false, false, false, false, false, false, false],
    ['Dansator #3', true, true, false, false, false, false, false, false],
    ['Dansator #4', false, false, false, false, false, false, false, false]
  ];

  constructor(private modalService: NgbModal) {
  }

  enumerateDates(startDate, endDate) {
    const dates = [moment(startDate).add(1, 'day').toDate()];

    const currDate = moment(startDate).startOf('month').add(1, 'day');

    const lastDate = moment(endDate).startOf('month').add(1, 'day');
    while (currDate.add(1, 'month').diff(lastDate) < 0) {

      dates.push(currDate.clone().toDate());
    }

    console.log(dates);

    return dates.map((e) => e.getFullYear() + '/' + (e.getMonth() + 1));
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
    this.isShowPayments = false;
  }

  showPersonalClasses(): void {
    this.isShowTimeTable = false;
    this.isShowPersonalClasses = true;
    this.isShowPayments = false;
  }

  showPayments(): void {
    this.isShowTimeTable = false;
    this.isShowPersonalClasses = false;
    this.isShowPayments = true;
  }

  addEvent(content): void {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'}).result.then(() => {
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

    this.calendarOptionsPersonal = {
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
      minTime: moment.duration(7, 'h'),
      weekends: true,
      contentHeight: 450,
      height: 500,
      events: []
    };
  }

}
