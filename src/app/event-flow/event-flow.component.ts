import {Component, OnInit} from '@angular/core';
import {EventFlowService, FlowEvent} from '../_services/event-flow.service';
import {DateTimeFormatterPipe} from '../_pipes/date-time-formatter.pipe';
import {addMonths} from 'date-fns';

@Component({
  selector: 'app-event-flow',
  templateUrl: './event-flow.component.html',
  styleUrls: ['./event-flow.component.css']
})
export class EventFlowComponent implements OnInit {
  eventFlow: FlowEvent[];

  eventComparators = {
    compareDate: function (a, b) {
      const aDate = new Date(a.timestamp);
      const bDate = new Date(b.timestamp);
      if (aDate > bDate) {
        return -1;
      } else if (bDate > aDate) {
        return 1;
      } else {
        return 0;
      }
    },
    comparePrior: function (a) {
      if (a.priority !== 2) {
        return 0;
      }

      const aDate = new Date(JSON.parse(a.content).date);
      const now = new Date();
      if (aDate > now) {
        return 1;
      } else {
        return -1;
      }
    }
  };

  constructor(private eventFlowService: EventFlowService) {
  }

  getColourClass(priority: number): string {
    if (priority === 0) {
      return 'blue';
    } else if (priority === 1) {
      return 'green';
    } else {
      return 'red';
    }
  }

  getContentOfPersonalClass(event: any): string {
    const title = JSON.parse(event.content).title;
    const start = JSON.parse(event.content).start;
    return title + ' ' + new DateTimeFormatterPipe().transform(start) + '-kor'
      + (event.source.split(':')[1].trim() === 'Delete Class' ? ' törölve' : '');
  }

  getPriorityContent(event): string {
    const eventObject = JSON.parse(event);
    return eventObject.event + ' ' + new DateTimeFormatterPipe().transform(eventObject.date) + '-kor';
  }

  ngOnInit() {
    this.eventFlowService.getEventFlow()
      .subscribe(res => this.eventFlow =
        res
          .filter(event => addMonths(event.timestamp, 1) >= new Date())
          .sort(this.eventComparators.compareDate).sort(this.eventComparators.comparePrior));
  }
}
