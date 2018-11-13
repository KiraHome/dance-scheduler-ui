import {Component, OnInit} from '@angular/core';
import {EventFlowService, FlowEvent} from '../_services/event-flow.service';
import {DateTimeFormatterPipe} from '../_pipes/date-time-formatter.pipe';
import {addMonths} from 'date-fns';
import {AuthService} from '../_services/auth.service';
import {map} from 'rxjs/internal/operators';

interface FacebookIcon {
  username: string;
  fb_id: string;
}

@Component({
  selector: 'app-event-flow',
  templateUrl: './event-flow.component.html',
  styleUrls: ['./event-flow.component.css']
})
export class EventFlowComponent implements OnInit {
  eventFlow: FlowEvent[];
  fbIcons: FacebookIcon[];

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
        return -1;
      } else {
        return 1;
      }
    }
  };

  constructor(private eventFlowService: EventFlowService, private authService: AuthService) {
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
      + (event.source.split(':')[1].trim() === 'Delete Class' ? ' TÖRÖLVE' : '');
  }

  getPriorityContent(event, source): string {
    const eventObject = JSON.parse(event);
    return eventObject.event + ' ' + new DateTimeFormatterPipe().transform(eventObject.date) + '-kor'
      + (source.split(':')[1].trim() === 'Remove Class' ? ' TÖRÖLVE' : '');
  }

  getProfileImage(username: string): string {
    const user = this.fbIcons.filter(icon => icon.username === username && icon.fb_id);
    if (user.length > 0) {
      return 'https://graph.facebook.com/' + user[0].fb_id + '/picture?type=normal';
    }
    return '';
  }

  ngOnInit() {
    this.fbIcons = [];

    this.eventFlowService.getEventFlow()
      .subscribe(res => this.eventFlow =
        res
          .filter(event => addMonths(event.timestamp, 1) >= new Date())
          .sort(this.eventComparators.compareDate).sort(this.eventComparators.comparePrior));

    this.authService.getFbIds().pipe(map(
      (res: any[]) => {
        res.forEach(element => {
          this.fbIcons.push({
            username: element.username,
            fb_id: element.fb_id
          });
        });
      }
    )).subscribe();
  }
}
