import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {addDays, addHours, addMinutes, addWeeks, startOfDay, startOfISOWeek} from 'date-fns';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, throwError} from 'rxjs';
import {PersonalClassService} from '../_services/personal-class.service';
import {catchError, map} from 'rxjs/internal/operators';

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

  time: any;
  day = 0;
  who: string;
  whom: string;

  isValidTime: boolean;

  ctrl: FormControl;
  trainerFormControl: FormGroup;
  trainer = 0;

  refresh: Subject<any> = new Subject();

  private colourSet = [
    'rgba(0, 152, 214, 0.2)',
    'rgba(15, 82, 186, 0.2)',
    'rgba(0, 49, 82, 0.2)',
    'rgba(115, 194, 251, 0.2)',
    'rgba(76, 81, 109, 0.2)',
    'rgba(70, 130, 180, 0.2)'
  ];

  private globalActions = [
    {
      label: '<img class="svg-tool-icon" src="../../assets/svg/si-glyph-pencil.svg">',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.removeEvent(event);
      }
    },
    {
      label: '<img class="svg-tool-icon" src="../../assets/svg/si-glyph-trash.svg">',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.removeEvent(event);
      }
    }
  ];

  newEvents: CalendarEvent[] = [];
  originalEvents: CalendarEvent[] = [];
  events: CalendarEvent[] = [
    {
      start: addHours(startOfDay(new Date()), 5),
      end: addHours(startOfDay(new Date()), 17),
      title: 'Event 1',
      color: {primary: this.colourSet[3], secondary: this.colourSet[0]},
      actions: this.globalActions,
      id: 1 + ' Event 1' + Math.random(),
      draggable: true
    },
    {
      start: addHours(startOfDay(addDays(new Date(), -1)), 9),
      end: addHours(startOfDay(addDays(new Date(), -1)), 18),
      title: 'Event 2',
      color: {primary: this.colourSet[3], secondary: this.colourSet[4]},
      actions: this.globalActions,
      id: 2 + ' Event 2' + Math.random(),
      draggable: true
    },
    {
      start: addHours(startOfDay(new Date()), 8),
      title: 'Event 3',
      color: {primary: this.colourSet[3], secondary: this.colourSet[5]},
      actions: this.globalActions,
      id: 3 + ' Event 3' + Math.random(),
      draggable: true
    }
  ];

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
              private personalClassService: PersonalClassService) {
  }

  addNewEvent(content): void {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(() => {
      if (this.validateName()) {
        const event: CalendarEvent = {
          draggable: true,
          start: addMinutes(addHours(addDays(startOfISOWeek(startOfDay(new Date())), this.day), this.time.hour), this.time.minute),
          end: addMinutes(addHours(addDays(startOfISOWeek(startOfDay(new Date())), this.day), this.time.hour), this.time.minute + 45),
          title: this.who + ' órázik ' + this.whom + 'nál',
          color: {primary: this.colourSet[3], secondary: this.colourSet[5]},
          actions: this.globalActions
        };
        this.events.push(event);
        this.originalEvents.push(event);
        this.newEvents.push(event);
        this.refresh.next();
      }
    });
  }

  removeEvent(event): void {
    this.events = this.events.filter(iEvent => iEvent !== event);
  }

  increment(): void {
    this.changeDate(addWeeks(this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(addWeeks(this.viewDate, -1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  changeDate(date: Date): void {
    this.viewDate = date;
  }


  eventClicked({event}: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }

  validateName(): boolean {
    return this.who && this.whom && this.isValidTime;
  }

  filterByTrainer(trainer: number): void {
    if (trainer === 0) {
      this.events = this.originalEvents;
      return;
    }
    this.events = this.originalEvents.filter(event => event.id.toString().startsWith(trainer.toString()));
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  getEvents(): void {
    this.personalClassService.getPersonalClassEvents().pipe(map((result: CalendarEvent[]) => {
      this.events = result;
      this.originalEvents = result;
    }), catchError(err => this.handleHttpError(err)));
  }

  saveEvents(): void {
    this.newEvents.forEach(event => {
      console.log('Event saved: ' + event.title);
      this.personalClassService.savePersonalClassEvent(event).pipe(map(() => {
        this.newEvents = [];
      }), catchError(err => this.handleHttpError(err)));
    });
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

    this.originalEvents = this.events.slice();
  }
}
