import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {addDays, addHours, addMinutes, addWeeks, startOfDay, startOfISOWeek} from 'date-fns';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, throwError} from 'rxjs';
import {PersonalClassService} from '../_services/personal-class.service';
import {catchError, map} from 'rxjs/internal/operators';
import {EventFlowService, FlowEvent} from '../_services/event-flow.service';
import {NameReversePipe} from '../_pipes/name-reverse.pipe';

@Component({
  selector: 'app-alternative-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'alternative-calendar.component.html',
  styleUrls: ['alternative-calendar.component.css']
})
export class AlternativeCalendarComponent implements OnInit {
  @Input()
  isShow: boolean;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();

  time: { hour: number, minute: number };
  day = 0;
  who: string;
  whom = {
    name: 'Válassz',
    id: undefined
  };

  weekly: boolean;

  weeksAdded: number;

  fbLoggedIn: boolean;

  isValidTime: boolean;
  ctrl: FormControl;
  trainerFormControl: FormGroup;

  trainer: number;

  private colourSet = [
    'rgba(0, 152, 214, 0.8)',
    'rgba(15, 82, 186, 0.8)',
    'rgba(0, 49, 82, 0.8)',
    'rgba(115, 194, 251, 0.8)',
    'rgba(76, 81, 109, 0.8)',
    'rgba(70, 130, 180, 0.8)'
  ];

  private globalActions = [
    {
      label: '<img class="svg-tool-icon" src="../../assets/svg/si-glyph-trash.svg">',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.removeEvent(event);
      }
    }
  ];

  newEvents: CalendarEvent[] = [];
  originalEvents: CalendarEvent[] = [];
  events: any[];

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
              private personalClassService: PersonalClassService, private eventFlowService: EventFlowService) {
  }

  addNewEvent(content): void {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(() => {
      if (this.validateModal()) {
        const trainerName = this.whom.name === 'Anita' ? 'Anitá' : this.whom.name;
        const event: any = {
          start: addMinutes(addHours(addDays(startOfISOWeek(startOfDay(new Date())), this.day), this.time.hour), this.time.minute),
          end: addMinutes(addHours(addDays(startOfISOWeek(startOfDay(new Date())), this.day), this.time.hour), this.time.minute + 45),
          title: this.who + ' órázik ' + trainerName + 'nál',
          color: {primary: this.colourSet[Math.ceil(Math.random() * 5)], secondary: this.colourSet[Math.ceil(Math.random() * 5)]},
          actions: this.globalActions,
          id: this.whom.id + ' ' + this.who + ' ' + trainerName + ' ' + Math.random(),
          recurring: this.weekly,
          cssClass: ''
        };

        this.events.push(event);
        this.originalEvents.push(event);
        this.newEvents.push(event);

        this.events = Array.from(new Set(this.events));
        this.originalEvents = Array.from(new Set(this.originalEvents));
        this.newEvents = Array.from(new Set(this.newEvents));
        this.refresh.next();

        this.filterByTrainer(this.trainer);

        this.saveEvents();
      }
    }).catch(() => {
    });
  }

  removeEvent(event): void {
    if (!event.serial_id) {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.newEvents = this.newEvents.filter(iEvent => iEvent !== event);
      this.originalEvents = this.events.slice();
      return;
    }

    this.personalClassService.deletePersonalClassEvent(event).pipe(map(() => {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.newEvents = this.newEvents.filter(iEvent => iEvent !== event);
      this.originalEvents = this.events.slice();
      this.saveToEventFlow(event, 'Delete Class');
    }), catchError(err => this.handleHttpError(err))).subscribe();
  }

  increment(): void {
    this.changeDate(addWeeks(this.viewDate, 1));
    this.events.forEach(event => {
      if (event.recurring) {
        event.start = addWeeks(event.start, 1);
        event.end = addWeeks(event.end, 1);
      }
    });
    ++this.weeksAdded;
  }

  decrement(): void {
    this.changeDate(addWeeks(this.viewDate, -1));
    this.events.forEach(event => {
      if (event.recurring) {
        event.start = addWeeks(event.start, -1);
        event.end = addWeeks(event.end, -1);
      }
    });
    --this.weeksAdded;
  }

  today(): void {
    this.changeDate(new Date());
    this.events.forEach(event => {
      if (event.recurring) {
        event.start = addWeeks(event.start, -this.weeksAdded);
        event.end = addWeeks(event.end, -this.weeksAdded);
      }
    });
    this.weeksAdded = 0;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
  }

  validateModal(): boolean {
    return this.who && this.whom.id && this.isValidTime;
  }

  filterByTrainer(trainer: number): void {
    if (trainer === 0) {
      this.events = this.originalEvents;
      return;
    }
    this.events = this.originalEvents.filter(event => event.id.toString().startsWith(trainer.toString()));
  }

  setTrainer(name, id) {
    this.whom = {
      name: name,
      id: id
    };
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  getEvents(): void {
    this.personalClassService.getPersonalClassEvents().pipe(map((result) => {
      if (result.length > 0) {
        this.events = result.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end_);
          delete event.end_;
          event.cssClass = event.cssclass;
          event.color = JSON.parse(event.color);
          event.actions = this.globalActions;
          delete event.cssclass;
          return event;
        });
      }
      this.events = result;
      this.originalEvents = this.events.slice();
      document.getElementById('defaultTrainer').click();
    }), catchError(err => this.handleHttpError(err))).subscribe();
  }

  saveEvents(): void {
    this.newEvents.forEach(event => {
      event.id = ('' + event.id).charAt(0);
      this.personalClassService.savePersonalClassEvent(event).pipe(map((result) => {
        this.newEvents.splice(this.newEvents.indexOf(event), 1);
        this.events[this.events.indexOf(event)].serial_id = result.serial_id;

        this.saveToEventFlow(event, 'New Class');
      }), catchError(err => this.handleHttpError(err))).subscribe();
    });
  }

  private saveToEventFlow(eventObject, method): void {
    const event: FlowEvent = {
      source: 'Personal Class : ' + method,
      content: eventObject,
      priority: 1,
      timestamp: new Date(),
      username: window.localStorage.getItem('user')
    };
    this.eventFlowService.addEventToFlow(event).subscribe();
  }

  private handleHttpError(error: Response | any): Observable<any> {
    if (error.status !== 404) {
      console.error(error);
    }
    return throwError(error);
  }

  ngOnInit(): void {
    this.ctrl = new FormControl('', (control: FormControl) => {
      const value = control.value;

      this.isValidTime = false;
      if (!value) {
        return {required: true};
      } else if (value.hour < 7) {
        return {tooEarly: true};
      } else if (value.hour >= 21 && value.minute > 15) {
        return {tooLate: true};
      }
      this.isValidTime = true;

      return null;
    });

    this.trainerFormControl = this.formBuilder.group({'model': 0});
    this.trainer = 0;

    this.fbLoggedIn = false;
    if (window.localStorage.getItem('user')) {
      this.fbLoggedIn = true;
      this.who = new NameReversePipe().transform(window.localStorage.getItem('user'));
    }

    this.weeksAdded = 0;
    this.getEvents();
  }
}
