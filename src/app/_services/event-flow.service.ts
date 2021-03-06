import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface FlowEvent {
  source: string;
  timestamp: Date;
  priority: number;
  content: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventFlowService {

  constructor(private http: HttpClient) {
  }

  getEventFlow(): Observable<any> {
    return this.http.get('event-flow');
  }

  addEventToFlow(event: any): Observable<any> {
    event.timestamp = event.timestamp.toString().split('GMT')[0] + 'UTC';
    return this.http.post('event-flow', event);
  }
}
