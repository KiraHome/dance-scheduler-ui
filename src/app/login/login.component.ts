import {Component, OnInit} from '@angular/core';
import {throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/internal/operators';
import * as crypto from 'crypto-js';
import {AuthService, FacebookLoginProvider} from 'angular-6-social-login';


interface LoginData {
  username: string;
  userpass: string;
  email: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registration: boolean;

  loginName: string;
  loginPass: string;

  wasError: boolean;
  wrongEmailError: boolean;

  data: LoginData;

  private resolvedCaptcha: boolean;

  constructor(private http: HttpClient, private socialAuthService: AuthService) {
  }

  ngOnInit() {
    this.registration = false;
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
        this.wasError = false;
      }),
      catchError((response: any) => this.handleError(response))
    ).subscribe();
  }

  public socialSignIn() {
    let socialPlatformProvider;
    socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        window.localStorage.setItem('userId', userData.id);
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

  register(): void {
    this.data = {
      username: null,
      userpass: null,
      email: null
    };
    this.registration = true;
  }

  sendRegistration(data: LoginData): void {
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    const body = {
      userName: data.username,
      password: crypto.SHA256(data.userpass).toString(crypto.enc.Hex),
      originalPass: data.userpass,
      email: data.email,
      uuid: guid()
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(data.username + ':' + data.userpass)
      })
    };

    if (this.resolvedCaptcha) {
      this.http.post('register', body, httpOptions)
        .pipe(
          map(res => {
            window.localStorage.setItem('credentials', res['basic']);
            window.localStorage.setItem('user', data.username);
            this.wasError = false;
            this.closeRegistration();
          }),
          catchError((response: any) => this.handleError(response)))
        .subscribe();
    }
  }

  closeRegistration(): void {
    this.registration = false;
  }

  resolved(captchaResponse: string) {
    if (captchaResponse) {
      this.resolvedCaptcha = true;
    }
  }

  private handleError(error: Response | any) {
    let message;
    if (error.status === 403) {
      message = 'Unauthorized access';
      this.wasError = true;
    } else if (error.status === 400) {
      message = 'User already exists';
      this.wasError = true;
    } else {
      message = 'Wrong user name or password';
    }

    return throwError(message);
  }

  isDisabledRegistration(data: LoginData) {
    return !data || !data.email || !data.email.match('.{1,255}@.{1,15}\..{1,7}');
  }
}
