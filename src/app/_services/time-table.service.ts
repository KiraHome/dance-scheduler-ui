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
}
