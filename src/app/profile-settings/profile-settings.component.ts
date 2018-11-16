import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {catchError, map} from 'rxjs/internal/operators';
import {AuthService, FacebookLoginProvider} from 'angular-6-social-login';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  @Output()
  optionsSaved = new EventEmitter();

  username: string;

  data: any;

  isFbLoggedIn: boolean;

  constructor(private http: HttpClient, private socialAuthService: AuthService) {
  }

  ngOnInit() {
    if (!window.localStorage.getItem('credentials').startsWith('Basic')) {
      this.isFbLoggedIn = true;
    }

    this.username = window.localStorage.getItem('user');
  }

  getUserName(): string {
    return window.localStorage.getItem('user');
  }

  settingsSave() {
    this.http.put('login/facebook', this.data)
      .pipe(
        map(res => {
          window.localStorage.setItem('credentials', res['token']);
          window.localStorage.setItem('user', this.data.userData.name);
          this.optionsSaved.emit();
        }),
        catchError((response: any) => this.handleError(response)))
      .subscribe();
  }

  closeSettings(): void {
    this.optionsSaved.emit();
  }

  public socialSignIn() {
    let socialPlatformProvider;
    socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        window.localStorage.setItem('userId', userData.id);
        this.data = {
          userData: userData,
          username: this.username
        };
        this.http.put('login/facebook', this.data)
          .pipe(
            map(res => {
              window.localStorage.setItem('credentials', res['token']);
              window.localStorage.setItem('user', userData.name);
              this.isFbLoggedIn = true;
            }),
            catchError((response: any) => this.handleError(response)))
          .subscribe();
      }
    );
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
