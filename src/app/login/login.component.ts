import {Component, OnInit} from '@angular/core';
import {ShareButtons} from '@ngx-share/core';
import {throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/internal/operators';
import * as crypto from 'crypto-js';
import {AuthService, FacebookLoginProvider} from 'angular-6-social-login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginName: string;
  loginPass: string;

  constructor(public share: ShareButtons, private http: HttpClient, private socialAuthService: AuthService) {
  }

  ngOnInit() {
  }


  login() {
    const headers = {
      username: this.loginName,
      pass: crypto.SHA256(this.loginPass).toString(crypto.enc.Hex)
    };
    this.http.get('login', {headers: headers}).pipe(
      map((res) => {
        window.localStorage.setItem('credentials', res['basic']);
        window.localStorage.setItem('user', this.loginName);
      }),
      catchError((response: any) => this.handleError(response))
    ).subscribe();
  }

  public socialSignIn() {
    let socialPlatformProvider;
    socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log('facebook sign in data : ', userData);
        window.localStorage.setItem('userPicUrl', 'https://graph.facebook.com/2229075060496563/picture?type=normal');
        this.http.post('login/facebook', userData)
          .pipe(
            map(res => {
              window.localStorage.setItem('credentials', res['token']);
              window.localStorage.setItem('user', userData.name);
            }),
            catchError((response: any) => this.handleError(response)))
          .subscribe();
      }
    );
  }

  register(username: string, password: string): void {
    const body = {
      userName: username,
      password: crypto.SHA256(password).toString(crypto.enc.Hex)
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      })
    };

    this.http.post('register', body, httpOptions)
      .pipe(
        map(res => {
          window.localStorage.setItem('credentials', res['basic']);
          window.localStorage.setItem('user', this.loginName);
        }),
        catchError((response: any) => this.handleError(response)))
      .subscribe();
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
