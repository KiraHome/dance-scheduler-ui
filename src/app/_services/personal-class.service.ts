import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CalendarEvent} from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class PersonalClassService {

  constructor(private http: HttpClient) {
  }

  savePersonalClassEvent(eventObject: CalendarEvent): Observable<any> {
    return this.http.put('event', eventObject);
  }

  getPersonalClassEvents(): Observable<any> {
    return this.http.get('event');
  }
}
