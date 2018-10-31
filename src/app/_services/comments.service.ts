import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  saveComment(commentObject: any): Observable<any> {
    return this.http.put('comment', commentObject);
  }

  getComments(): Observable<any> {
    return this.http.get('comment');
  }
}
