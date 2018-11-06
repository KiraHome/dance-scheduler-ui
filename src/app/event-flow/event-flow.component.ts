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
    return title + ' ' + new DateTimeFormatterPipe().transform(start) + '-kor' + (event.source.split(':')[1].trim() === 'Delete Class' ? ' törölve' : '');
  }

  ngOnInit() {
    function comparePrior(a, b) {
      if (a.priority < b.priority) {
        return 1;
      } else if (b.priority < a.priority) {
        return -1;
      } else {
        return 0;
      }
    }

    function compareDate(a, b) {
      if (a.timestamp > b.timestamp) {
        return 1;
      } else if (b.timestamp > a.timestamp) {
        return -1;
      } else {
        return 0;
      }
    }

    this.eventFlowService.getEventFlow()
      .subscribe(res => this.eventFlow =
        res
          .filter(event => addMonths(event.timestamp, 1) >= new Date())
          .sort(compareDate).sort(comparePrior));
  }
}
