import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {

  constructor(private http: HttpClient) {
  }

  getTimeTableData(): Observable<any> {
    return this.http.get('time-table');
  }

  saveTimeTableEvent(event: any): Observable<any> {
    return this.http.put('time-table', event);
  }

  deleteTimeTableEvent(event: any): Observable<any> {
    return this.http.delete('time-table/' + event.serial_id);
  }
}
