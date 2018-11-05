import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {addDays, addHours, addMinutes, addWeeks, startOfDay, startOfWeek} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {CalendarEvent, CalendarEventTitleFormatter} from 'angular-calendar';
import {CustomEventTitleFormatter} from '../utils/custom-event-title-formatter';
import {TimeTableService} from '../_services/time-table.service';
import {map} from 'rxjs/internal/operators';

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

  events: CalendarEvent[];
  weeksAdded = 0;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
              private timeTableService: TimeTableService) {
  }

  increment(): void {
    this.changeDate(addWeeks(this.viewDate, 1));
    this.events.forEach(event => {
      event.start = addWeeks(event.start, 1);
      event.end = addWeeks(event.end, 1);
    });
    ++this.weeksAdded;
  }

  decrement(): void {
    this.changeDate(addWeeks(this.viewDate, -1));
    this.events.forEach(event => {
      event.start = addWeeks(event.start, -1);
      event.end = addWeeks(event.end, -1);
    });
    --this.weeksAdded;
  }

  today(): void {
    this.changeDate(new Date());
    this.events.forEach(event => {
      event.start = addWeeks(event.start, -this.weeksAdded);
      event.end = addWeeks(event.end, -this.weeksAdded);
    });
    this.weeksAdded = 0;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
  }

  ngOnInit(): void {
    this.timeTableService.getTimeTableData().pipe(
      map((result) => {
        const option = {weekStartsOn: 1};
        if (result.length > 0) {
          this.events = result.map(event => {
            const start = JSON.parse(event.start);
            event.start =
              addMinutes(addHours(addDays(startOfWeek(startOfDay(new Date()), option), start[0]), start[1]), start[2]);
            const end = JSON.parse(event.end_);
            event.end = {};
            event.end =
              addMinutes(addHours(addDays(startOfWeek(startOfDay(new Date()), option), end[0]), end[1]), end[2]);
            delete event.end_;
            event.cssClass = {};
            event.cssClass = event.cssclass;
            event.color = JSON.parse(event.color);
            delete event.cssclass;
            return event;
          });
        }
      })
    ).subscribe();

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
  }
}
