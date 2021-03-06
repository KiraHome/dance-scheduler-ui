import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../_services/payment.service';
import {catchError, map} from 'rxjs/internal/operators';
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarYears,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths
} from 'date-fns';
import {AuthService} from '../_services/auth.service';
import {Observable, throwError} from 'rxjs';
import {PersonalClassService} from '../_services/personal-class.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AccountingService} from '../_services/accounting.service';
import * as Chart from '../../../node_modules/chart.js/';
import {ChartData, ChartOptions} from 'chart.js';


interface EventObject {
  start: Date;
  end: Date;
  lastPaidClass: Date;
  cssClass: string;
  color: string;
  recurring: boolean;
  title?: string;
}

interface PaymentObject {
  payTimestamp: Date;
  credit: number;
  type: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  @Input()
  isShow: boolean;

  dates = this.enumerateDates(
    addMonths(startOfYear(new Date()), 0),
    addMonths(startOfYear(new Date()), 9));
  paymentTable = [];

  events: EventObject[];
  actEvent: EventObject;

  accounting: PaymentObject[];

  chart: Chart;

  private colourSet: string[] = [
    'rgba(0, 152, 214, 0.8)',
    'rgba(15, 82, 186, 0.8)',
    'rgba(0, 49, 82, 0.8)',
    'rgba(115, 194, 251, 0.8)',
    'rgba(76, 81, 109, 0.8)',
    'rgba(106, 90, 205, 0.8)',
    'rgba(135, 206, 250, 0.8)',
    'rgba(70, 130, 180, 0.8)',
    'rgba(157, 193, 131, 0.8)',
    'rgba(0, 168, 107, 0.8)',
    'rgba(152, 251, 152, 0.8)',
    'rgba(80, 200, 120, 0.8)'
  ];

  constructor(private paymentService: PaymentService, private authService: AuthService,
              private personalClassService: PersonalClassService, private modalService: NgbModal,
              private accountingService: AccountingService) {
  }

  ngOnInit() {
    this.getPayments();

    this.getEvents();

    this.accounting = [];
    this.getAccountingList();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
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
    const dates = [];

    startDate = addDays(startDate, 15);

    while (startOfMonth(startDate) <= startOfMonth(endDate)) {
      dates.push(startDate);
      startDate = addMonths(startDate, 1);
    }

    return dates.map((e) => e.getFullYear() + '/' + (e.getMonth() + 1));
  }

  getPaymentList(lastPaid, event: EventObject): any[] {
    const weekList = [];
    while (startOfWeek(lastPaid) < startOfWeek(new Date())) {
      lastPaid = addWeeks(lastPaid, 1);
      weekList.push(
        lastPaid.getFullYear() + '-' + (lastPaid.getMonth() + 1) + '-' + lastPaid.getDate() +
        ' ' + event.start.getHours() + ':' + event.start.getMinutes()
      );
    }
    return weekList;
  }

  payClass(event: EventObject, content): void {
    this.actEvent = event;
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(
      () => {
        event.lastPaidClass = addWeeks(event.lastPaidClass, 1);
        this.personalClassService.updateLastPaid(event).subscribe();
      }
    ).catch(() => {
    });
  }

  getLastUnpaidClasses(): any[] {
    if (!this.events) {
      return [];
    }
    return this.events
      .filter(event => (event.recurring && startOfWeek(event.lastPaidClass) < startOfWeek(new Date())) ||
        (event.recurring && differenceInCalendarYears(event.lastPaidClass, new Date()) < 0) ||
        (!event.recurring && event.lastPaidClass === null) ||
        (!event.recurring && event.lastPaidClass && startOfDay(event.lastPaidClass) < startOfDay(event.start)))
      .map(event => {
        const weekDiff = startOfDay(event.lastPaidClass) <= startOfDay(new Date());
        if (event.recurring && event.lastPaidClass && weekDiff) {
          while (startOfWeek(event.start) <= startOfWeek(event.lastPaidClass)) {
            event.start = addWeeks(event.start, 1);
            event.end = addWeeks(event.end, 1);
          }
        }
        return event;
      });
  }

  getEvents(): void {
    this.personalClassService.getPersonalClassEvents().pipe(map((result) => {
      if (result.length > 0) {
        this.events = result.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end_);
          if (event.last_paid_class) {
            event.lastPaidClass = new Date(event.last_paid_class);
          } else {
            event.lastPaidClass = null;
          }
          delete event.last_paid_class;
          delete event.end_;
          event.cssClass = event.cssclass;
          event.color = JSON.parse(event.color);
          delete event.cssclass;
          return event;
        });
      }
      this.events = result;
      this.events = this.getLastUnpaidClasses();
    }), catchError(err => this.handleHttpError(err))).subscribe();
  }

  getPayments(): void {
    this.paymentService.getPaymentTable().pipe(map(
      (res: any[]) => {
        res.forEach((element, index) => {
          const lastPaid = new Date(element.lastpaid);
          const paidMonthes = lastPaid.getMonth();

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

  private getAccountingList() {
    this.accountingService.getAccountingList().pipe(map(
      (res: any) => {
        this.accounting = res.map(el => {
          return {
            payTimestamp: new Date(el.pay_timestamp),
            credit: el.credit,
            type: el.type
          };
        });
      }), catchError(err => this.handleHttpError(err))).subscribe();
  }

  getAccountingSum(): number {
    if (!this.chart) {
      this.createChart();
    }

    if (this.accounting.length > 0) {
      return this.accounting.map(a => a.credit).reduce((a, b) => a + b, 0);
    }
    return 0;
  }

  createPaymentDistributionForChart(): number[] {
    const retVal = [];
    this.dates.forEach(date => {
      const monthlySum = this.accounting.filter(payment => {
        return payment.payTimestamp.getFullYear() === parseInt(date.split('/')[0], null) &&
          payment.payTimestamp.getMonth() + 1 === parseInt(date.split('/')[1], null);
      }).map(el => el.credit).reduce((a, b) => a + b, 0);

      if (monthlySum) {
        retVal.push(monthlySum);
      } else {
        retVal.push(0);
      }
    });
    return retVal;
  }

  createChart(): void {
    const options: ChartOptions = {
      legend: {display: false},
      title: {
        display: true,
        text: 'Befizetések eloszlása a tanévben',
      }
    };

    const data: ChartData = {
      labels: this.dates,
      datasets: [{
        label: 'Befizetésel eloszlása',
        backgroundColor: this.colourSet,
        data: this.createPaymentDistributionForChart()
      }]
    };

    this.chart = new Chart(document.getElementById('bar-chart'), {
      type: 'bar',
      data: data,
      options: options
    });
  }

  private handleHttpError(error: Response | any): Observable<any> {
    if (error.status !== 404) {
      console.error(error);
    }
    return throwError(error);
  }
}
