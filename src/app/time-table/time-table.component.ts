import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {addWeeks} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {CalendarEvent, CalendarEventTitleFormatter} from 'angular-calendar';
import {timeTableEvents} from '../events/timeTableEvents';
import {CustomEventTitleFormatter} from '../utils/custom-event-title-formatter';

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
  isValidTime: boolean;

  ctrl: FormControl;
  trainerFormControl: FormGroup;

  refresh: Subject<any> = new Subject();

  originalEvents: CalendarEvent[];
  events: CalendarEvent[] = timeTableEvents;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {
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
