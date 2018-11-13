import {Component, Input, OnInit} from '@angular/core';
import * as moment from '../../../node_modules/moment/';
import {PaymentService} from '../_services/payment.service';
import {catchError, map} from 'rxjs/internal/operators';
import {addMonths, addWeeks, addYears, startOfDay, startOfWeek, subMonths} from 'date-fns';
import {AuthService} from '../_services/auth.service';
import {Observable, Subject, throwError} from 'rxjs';
import {CalendarEventTimesChangedEvent} from 'angular-calendar';
import {PersonalClassService} from '../_services/personal-class.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @Input()
  isShow: boolean;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();

  day: any;

  dates = this.enumerateDates(
    addMonths(addYears(new Date(), this.actualSchoolYear() - 1), 10),
    addMonths(addYears(new Date(), this.actualSchoolYear()), 8));
  paymentTable = [];

  events: any[];
  actEvent: any;

  constructor(private paymentService: PaymentService, private authService: AuthService,
              private personalClassService: PersonalClassService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getPayments();

    this.getEvents();
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

  getLastUnpaidClasses(): any[] {
    if (!this.events) {
      return [];
    }
    return this.events
      .filter(event => (event.recurring && startOfWeek(event.lastPaidClass) < startOfWeek(new Date())) ||
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

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  eventClicked($event, content): void {
    console.log('Event clicked', $event);
    this.authService.isAdminLoggedIn().pipe(map(
      () => {
        this.actEvent = $event.event;
        this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(
          () => {
            const event = $event.event;
            event.lastPaidClass = $event.event.start;
            this.personalClassService.updateLastPaid(event).pipe(catchError(err => this.handleHttpError(err))).subscribe();
            event.start = addWeeks(event.start, 1);
            event.end = addWeeks(event.end, 1);
            this.events = this.getLastUnpaidClasses();
          });
      }
    ), catchError(err => this.handleHttpError(err))).subscribe();
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

  private handleHttpError(error: Response | any): Observable<any> {
    if (error.status !== 404) {
      console.error(error);
    }
    return throwError(error);
  }
}
