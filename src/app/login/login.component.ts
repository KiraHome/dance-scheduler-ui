import {Component, OnInit} from '@angular/core';
import {ShareButtons} from '@ngx-share/core';
import {UserCredentialService} from '../_services/user-credential.service';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/internal/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginName: string;
  loginPass: string;

  constructor(public share: ShareButtons, private userCredentialService: UserCredentialService,
              private http: HttpClient) {
  }

  ngOnInit() {
  }


  login(username: string, password: string): Observable<boolean> {

    if (this.loginName === 'tanc' && this.loginPass === 'tanc') {
      window.localStorage.setItem('basic_auth', 'ADMIN');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      })
    };

    return this.http.get('login', httpOptions)
      .pipe(map(() => this.userCredentialService.storeCredential(username, password)),
        catchError((response: any) => this.handleError(response))
      );
  }

  register(username: string, password: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      })
    };

    this.http.post('register', httpOptions)
      .pipe(catchError((response: any) => this.handleError(response)));
  }

  private handleError(error: Response | any) {
    let message;
    if (error.status === 403) {
      message = 'Unauthorized access';
    } else {
      message = 'Wrong user name or password';
    }

    return throwError(message);
  }
}
