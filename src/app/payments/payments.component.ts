import {Component, Input, OnInit} from '@angular/core';
import * as moment from '../../../node_modules/moment/';
import {PaymentService} from '../_services/payment.service';
import {map} from 'rxjs/internal/operators';
import {addMonths, addYears, subMonths} from 'date-fns';
import {AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @Input()
  isShow: boolean;

  day: any;

  dates = this.enumerateDates(
    addMonths(addYears(new Date(), this.actualSchoolYear() - 1), 10),
    addMonths(addYears(new Date(), this.actualSchoolYear()), 8));
  paymentTable = [];
  paymentTablePersonal = [];

  constructor(private paymentService: PaymentService, private authService: AuthService) {
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
            paidMonthes = lastPaid.getMonth() - 8;
          }

          this.paymentTable[index] = [];
          this.paymentTable[index][0] = element.username;
          for (let i = 1; i < 11; ++i) {
            if (i - 1 <= paidMonthes) {
              this.paymentTable[index].push(true);
            } else {
              this.paymentTable[index].push(false);
            }
          }
        });

        function paymentComparator(a: any[], b: any[]): number {
          const splitA = a[0].split(' ');
          const splitB = b[0].split(' ');
          const lastA = splitA[splitA.length - 1];
          const lastB = splitB[splitB.length - 1];

          if (lastA < lastB) {
            return -1;
          }
          if (lastA > lastB) {
            return 1;
          }
          return 0;
        }

        this.paymentTable.sort(paymentComparator);
      }
    )).subscribe();
  }

  actualSchoolYear(): number {
    if (new Date().getMonth() <= 6) {
      return -1;
    }
    return 0;
  }

  paymentDone(d, index): void {
    const payment = {
      username: d,
      lastPaid: new Date(this.dates[index] + ' 10:00')
    };

    this.authService.isAdminLoggedIn().pipe(map(
      () => {
        this.paymentService.setPayment(payment).pipe(map(
          () => {
            if (this.paymentTable.filter(user => user[0] === payment.username)[0][index] !== false) {
              this.paymentTable.filter(user => user[0] === payment.username)[0][index + 1] = true;
            }
          }
        )).subscribe();
      }
    )).subscribe();
  }

  decreasePaymentDate(d): void {
    const payment = {
      username: d,
      lastPaid: null
    };

    this.authService.isAdminLoggedIn().pipe(map(
      () => {
        this.paymentService.getPaymentTable().pipe(map(
          (res: any[]) => {
            const lastPaid = new Date(res.filter(element => element.username === payment.username)[0].lastpaid);
            payment.lastPaid = subMonths(lastPaid, 1);
            this.paymentService.setPayment(payment).pipe(map(
              () => {
                this.ngOnInit();
              }
            )).subscribe();
          }
        )).subscribe();
      }
    )).subscribe();
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
