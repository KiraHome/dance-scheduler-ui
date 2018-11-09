import {Component, Input, OnInit} from '@angular/core';
import * as moment from '../../../node_modules/moment/';
import {PaymentService} from '../_services/payment.service';
import {map} from 'rxjs/internal/operators';
import {addMonths, addYears, startOfMonth, startOfYear, subYears} from 'date-fns';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @Input()
  isShow: boolean;

  day: any;

  dates = this.enumerateDates(addMonths(this.actualSchoolYear(), 9), addMonths(addYears(this.actualSchoolYear(), 1), 6));
  paymentTable = [[]];
  paymentTablePersonal = [];

  constructor(private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.paymentService.getPaymentTable().pipe(map(
      (res: any[]) => {
        res.forEach((element, index) => {
          const lastPaid = new Date(element.lastpaid);
          let paidMonthes = 0;
          if (lastPaid.getFullYear() > 2018) {
            paidMonthes = lastPaid.getMonth() + 4;
          } else {
            paidMonthes = lastPaid.getMonth() + 1;
          }

          paidMonthes -= 10;

          this.paymentTable[index][0] = element.username;
          for (let i = 1; i < 10; ++i) {
            if (i < paidMonthes) {
              this.paymentTable[index].push(true);
            } else {
              this.paymentTable[index].push(false);
            }
          }
        });
      }
    )).subscribe();
  }

  actualSchoolYear(): number {
    if (new Date().getMonth() <= 6) {
      return new Date().getFullYear() - 1;
    }
    return new Date().getFullYear();
  }

  enumerateDates(startDate, endDate): string[] {
    const dates = [moment(startDate).add(1, 'day').toDate()];

    const currDate = moment(startDate).startOf('month').add(1, 'day');

    const lastDate = moment(endDate).startOf('month').add(1, 'day');
    while (currDate.add(1, 'month').diff(lastDate) < 0) {

      dates.push(currDate.clone().toDate());
    }

    return dates.map((e) => e.getFullYear() + '/' + (e.getMonth() + 1));
  }
}
