import {Component, OnInit, ViewChild} from '@angular/core';
import {Options} from 'fullcalendar';
import {CalendarComponent} from 'ng-fullcalendar';
import * as moment from '../../node_modules/moment/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isShowTimeTable: boolean;
  isShowPersonalClasses: boolean;
  isShowPayments: boolean;

  day: any;

  dates = this.enumerateDates(new Date('2018-10-01'), new Date('2019-06-01'));
  paymentTable = [
    ['Dansator #1', true, true, false, false, false, false, false, false],
    ['Dansator #2', true, false, false, false, false, false, false, false],
    ['Dansator #3', true, true, false, false, false, false, false, false],
    ['Dansator #4', false, false, false, false, false, false, false, false]
  ];

  constructor() {
  }

  enumerateDates(startDate, endDate) {
    const dates = [moment(startDate).add(1, 'day').toDate()];

    const currDate = moment(startDate).startOf('month').add(1, 'day');

    const lastDate = moment(endDate).startOf('month').add(1, 'day');
    while (currDate.add(1, 'month').diff(lastDate) < 0) {

      dates.push(currDate.clone().toDate());
    }

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

  ngOnInit() {
  }
}
