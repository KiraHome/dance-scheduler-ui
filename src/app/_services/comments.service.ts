import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EventFlowService, FlowEvent} from './event-flow.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient, private eventFlowService: EventFlowService) {
  }

  saveComment(commentObject: any): Observable<any> {
    return this.http.put('comment', commentObject);
  }

  getComments(): Observable<any> {
    return this.http.get('comment');
  }
}
