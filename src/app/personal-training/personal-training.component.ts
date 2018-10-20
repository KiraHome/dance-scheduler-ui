import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import * as $ from '../../../node_modules/jquery/dist/jquery.js';
import * as moment from '../../../node_modules/moment/';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-personal-training',
  templateUrl: './personal-training.component.html',
  styleUrls: ['./personal-training.component.css']
})
export class PersonalTrainingComponent implements OnInit {
  @Input()
  public isShow: boolean;

  time: any;
  day = 1;
  who: string;
  whom: string;

  isValidTime: boolean;

  ctrl: FormControl;

  eventsPersonal: any;
  calendarOptionsPersonal: Options;
  @ViewChild(CalendarComponent) ucCalendarPersonal: CalendarComponent;

  selectedEvent: string;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.calendarOptionsPersonal = {
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: 'ma'
      },
      defaultView: 'agendaWeek',
      locale: 'hu',
      maxTime: moment.duration(22, 'h'),
      minTime: moment.duration(7, 'h'),
      weekends: true,
      contentHeight: 450,
      height: 500,
      events: []
    };

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
  }

  addEvent(content): void {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(() => {
      if (this.validateName()) {
        let endTime;
        if (this.time.minute <= 15) {
          endTime = this.time.hour + ':' + (this.time.minute + 45);
        } else {
          endTime = (this.time.hour + 1) + ':' + (this.time.minute - 15);
        }
        const event = [{
          id: this.who + this.whom + this.day + this.time.hour + this.time.minute,
          title: this.who + ' órázik ' + this.whom + 'nál',
          start: this.time.hour + ':' + this.time.minute,
          end: endTime,
          dow: [this.day],
          color: '#be4a47',
          textColor: 'white'
        }];
        $('#time-personal-calendar').fullCalendar('renderEvents', event, true);
      }
    });
  }

  removeEvent(): void {
    if (this.selectedEvent) {
      const event = this.selectedEvent;
      $('#time-personal-calendar').fullCalendar('removeEvents', event);
    }
  }

  validateName(): boolean {
    return this.who && this.whom && this.isValidTime;
  }

  eventClick($event) {
    this.selectedEvent = $event.event.id;
    this.ucCalendarPersonal.fullCalendar('rerenderEvents');
    $(this).css('border-color', 'red');
  }
}
