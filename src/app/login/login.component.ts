import {Component, OnInit} from '@angular/core';
import {ShareButtons} from '@ngx-share/core';
import {throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginName: string;
  loginPass: string;

  constructor(public share: ShareButtons, private http: HttpClient) {
  }

  ngOnInit() {
  }


  login() {
    if (this.loginName === 'tanc' && this.loginPass === 'tanc') {
      window.localStorage.setItem('basic_auth', 'ADMIN');
    }
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
