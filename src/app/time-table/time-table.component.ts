import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {addDays, addHours, addMinutes, addWeeks, startOfDay, startOfWeek} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {CalendarEvent, CalendarEventTitleFormatter} from 'angular-calendar';
import {CustomEventTitleFormatter} from '../utils/custom-event-title-formatter';
import {TimeTableService} from '../_services/time-table.service';
import {map} from 'rxjs/internal/operators';
import {AuthService} from '../_services/auth.service';
import {EventFlowService, FlowEvent} from '../_services/event-flow.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class TimeTableComponent implements OnInit {
  @Input()
  isShow: boolean;
  viewDate: Date = new Date();

  excludedDays: number[] = [6, 0];

  trainerFormControl: FormGroup;

  refresh: Subject<any> = new Subject();

  events: any[];
  tempRemovedEvents: any;
  weeksAdded = 0;

  eventTitle: string;
  eventLength: number;
  actEventStart: Date;
  ctrl: any;

  isAddNewEvent: boolean;

  actEvent: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
              private timeTableService: TimeTableService, private authService: AuthService,
              private eventFlowService: EventFlowService) {
  }

  increment(): void {
    this.events.push.apply(this.events, this.tempRemovedEvents);
    this.tempRemovedEvents = [];
    this.changeDate(addWeeks(this.viewDate, 1));
    this.events.forEach(event => {
      if (event.recurring) {
        event.start = addWeeks(event.start, 1);
        event.end = addWeeks(event.end, 1);
      }
    });
    this.tempRemoveCollidingEvents();
    ++this.weeksAdded;
  }

  decrement(): void {
    this.events.push.apply(this.events, this.tempRemovedEvents);
    this.tempRemovedEvents = [];
    this.changeDate(addWeeks(this.viewDate, -1));
    this.events.forEach(event => {
      if (event.recurring) {
        event.start = addWeeks(event.start, -1);
        event.end = addWeeks(event.end, -1);
      }
    });
    this.tempRemoveCollidingEvents();
    --this.weeksAdded;
  }

  today(): void {
    this.events.push.apply(this.events, this.tempRemovedEvents);
    this.tempRemovedEvents = [];
    this.changeDate(new Date());
    this.events.forEach(event => {
      if (event.recurring) {
        event.start = addWeeks(event.start, -this.weeksAdded);
        event.end = addWeeks(event.end, -this.weeksAdded);
      }
    });
    this.tempRemoveCollidingEvents();
    this.weeksAdded = 0;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
  }

  eventClicked($event, content): void {
    console.log('Event clicked', $event);
    this.isAddNewEvent = false;
    this.actEvent = $event.event;
    this.authService.isAdminLoggedIn().pipe(map(
      () => {
        if (!$event.event.recurring) {
          this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(
            () => {
              if ($event.event.serial_id) {
                this.timeTableService.deleteTimeTableEvent($event.event).pipe(map(
                  () => {
                    this.events.splice(this.events.indexOf($event.event), 1);
                    this.events.push.apply(this.events, this.tempRemovedEvents);
                    this.tempRemovedEvents = [];
                    this.tempRemoveCollidingEvents();
                    this.saveToEventFlow($event.event, 'Remove Class');
                    this.refresh.next();
                  }
                )).subscribe();
              }
            });
        } else {
          this.segmentClicked({date: $event.event.start}, content);
        }
      }
    )).subscribe();
  }

  isValid(): boolean {
    const tomorrowMidnight = addDays(startOfDay(this.actEventStart), 1);
    const eventEndTime = addHours(this.actEventStart, this.eventLength);

    if (this.eventLength < 1) {
      this.ctrl = {
        valid: false,
        errors: {
          tooMuch: false,
          nonPositive: true
        }
      };
    } else if (tomorrowMidnight < eventEndTime) {
      this.ctrl = {
        valid: false,
        errors: {
          tooMuch: true,
          nonPositive: false
        }
      };
    } else {
      this.ctrl = {
        valid: true
      };
    }

    return this.ctrl.valid;
  }

  segmentClicked($event, content): void {
    console.log('Event clicked', $event);
    this.isAddNewEvent = true;
    this.actEventStart = $event.date;
    this.authService.isAdminLoggedIn().pipe(map(
      () => {
        this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(
          () => {
            const event = {
              start: $event.date,
              end: addHours($event.date, this.eventLength),
              title: this.eventTitle,
              color: {primary: '#1919c8', secondary: '#191970'},
              id: this.eventTitle + Math.random(),
              cssClass: 'special-event',
              recurring: false,
              serial_id: null
            };

            this.timeTableService.saveTimeTableEvent(event).pipe(map(
              (res) => {
                event.serial_id = res.serial_id;
                this.saveToEventFlow(event, 'New Class');
                this.events.push(event);
                this.tempRemoveCollidingEvents();
                this.refresh.next();
              }
            )).subscribe();
          });
      }
    )).subscribe();
  }

  private saveToEventFlow(event, method): void {
    const eventObject = {
      event: event.title,
      date: new Date()
    };
    const flowEvent: any = {
      source: 'Personal Class : ' + method,
      content: eventObject,
      priority: 2,
      timestamp: new Date(),
      username: window.localStorage.getItem('user')
    };
    this.eventFlowService.addEventToFlow(flowEvent).subscribe();
  }

  private mapEventValuesToUI(result): void {
    const option = {weekStartsOn: 1};
    this.events = result.map(event => {
      if (event.recurring) {
        const start = JSON.parse(event.start);
        const end = JSON.parse(event.end_);
        event.start =
          addMinutes(addHours(addDays(startOfWeek(startOfDay(new Date()), option), start[0]), start[1]), start[2]);
        event.end =
          addMinutes(addHours(addDays(startOfWeek(startOfDay(new Date()), option), end[0]), end[1]), end[2]);
        delete event.end_;
      } else {
        event.start = new Date(event.start);
        event.end = new Date(event.end_);
      }
      event.cssClass = {};
      event.cssClass = event.cssclass;
      event.color = JSON.parse(event.color);
      delete event.cssclass;
      return event;
    });
  }

  private tempRemoveCollidingEvents(): void {
    for (const a of this.events) {
      for (const b of this.events) {
        if (a.start.getDay() === b.start.getDay() &&
          a.start.getMonth() === b.start.getMonth() &&
          a.start.getYear() === b.start.getYear()) {
          if (a.start.getTime() <= b.start.getTime() && a.end.getTime() >= b.start.getTime() && b.start.getTime() !== a.end.getTime() ||
            b.start.getTime() <= a.start.getTime() && b.end.getTime() >= a.start.getTime() && a.start.getTime() !== b.end.getTime()) {
            if (a.recurring && !b.recurring) {
              this.tempRemovedEvents.push(a);
              this.events.splice(this.events.indexOf(a), 1);
            } else if (b.recurring && !a.recurring) {
              this.tempRemovedEvents.push(b);
              this.events.splice(this.events.indexOf(b), 1);
            }
          }
        }
      }
    }
  }

  isSaveDisabled() {
    return this.isAddNewEvent && !this.ctrl.valid;
  }

  ngOnInit(): void {
    this.tempRemovedEvents = [];
    this.timeTableService.getTimeTableData().pipe(
      map((result) => {
        if (result.length > 0) {
          this.mapEventValuesToUI(result);

          this.tempRemoveCollidingEvents();
        }
      })
    ).subscribe();

    this.trainerFormControl = this.formBuilder.group({'model': 0});
  }
}
