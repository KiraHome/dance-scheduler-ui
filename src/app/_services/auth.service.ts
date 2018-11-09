import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  isAdminLoggedIn(): Observable<any> {
    const headers = {
      username: window.localStorage.getItem('user'),
      token: window.localStorage.getItem('credentials')
    };

    return this.http.get('login/is-admin', {headers: headers});
  }

  getFbIds(): Observable<any> {
    const headers = {
      username: window.localStorage.getItem('user'),
      token: window.localStorage.getItem('credentials')
    };

    return this.http.get('login/fb-ids', {headers: headers});
  }
}
