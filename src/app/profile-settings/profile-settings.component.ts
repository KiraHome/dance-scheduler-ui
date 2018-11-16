import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {catchError, map} from 'rxjs/internal/operators';
import {AuthService, FacebookLoginProvider} from 'angular-6-social-login';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';
import * as crypto from 'crypto-js';
import {AuthService as UserAuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  @Output()
  optionsSaved = new EventEmitter();
  @Output()
  profileDeleted = new EventEmitter();

  username: string;
  userpass: string;

  data: any;

  isFbLoggedIn: boolean;

  constructor(private http: HttpClient, private socialAuthService: AuthService, private modalService: NgbModal,
              private userAuthService: UserAuthService, private router: Router) {
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

  deleteProfile(content) {
    const headers = {
      username: this.username,
      pass: crypto.SHA256(this.userpass).toString(crypto.enc.Hex),
      uuid: ''
    };

    this.http.get('login', {headers: headers}).pipe(
      map(() => {
        this.userAuthService.getMe().pipe(map(
          (res) => {
            headers.uuid = res.uuid;
            this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'xl' as 'lg'}).result.then(() => {
              this.http.delete('login/me', {headers: headers}).pipe(map(
                () => {
                  window.localStorage.removeItem('user');
                  window.localStorage.removeItem('userId');
                  window.localStorage.removeItem('credentials');
                  this.profileDeleted.emit();
                  this.router.navigate(['login']);
                }), catchError((response: any) => this.handleError(response))
              ).subscribe();
            }).catch(() => {
            });
          }), catchError((response: any) => this.handleError(response))
        ).subscribe();
      }), catchError((response: any) => this.handleError(response))
    ).subscribe();
  }

  isDisabledDeleteProfile() {
    return !this.username || !this.userpass;
  }
}
