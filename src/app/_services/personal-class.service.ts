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
    return this.http.put('personal-class', eventObject);
  }

  getPersonalClassEvents(): Observable<any> {
    return this.http.get('personal-class');
  }

  deletePersonalClassEvent(eventObject: any) {
    return this.http.delete('personal-class/' + eventObject.serial_id);
  }

  updateLastPaid(event: any) {
    return this.http.put('personal-class/pay', event);
  }
}
