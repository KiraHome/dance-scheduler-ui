import {Component, Input, OnInit} from '@angular/core';
import * as moment from '../../../node_modules/moment/';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @Input()
  isShow: boolean;

  day: any;

  dates = this.enumerateDates(new Date('2018-10-01'), new Date('2019-06-01'));
  paymentTable = [
    ['Dansator #1', true, true, false, false, false, false, false, false],
    ['Dansator #2', true, false, false, false, false, false, false, false],
    ['Dansator #3', true, true, false, false, false, false, false, false],
    ['Dansator #4', false, false, false, false, false, false, false, false]
  ];
  paymentTablePersonal = [];

  constructor() {
  }

  ngOnInit() {
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
}
