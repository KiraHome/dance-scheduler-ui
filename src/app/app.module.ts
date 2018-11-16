import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TimeTableComponent} from './time-table/time-table.component';
import {PaymentsComponent} from './payments/payments.component';
import {AlternativeCalendarComponent} from './alternative-calendar/alternative-calendar.component';
import {CommonModule} from '@angular/common';
import {CalendarModule, DateAdapter, MOMENT} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import moment from 'moment-timezone';
import {VideoEmbedderComponent} from './video-embedder/video-embedder.component';
import {HttpModule} from '@angular/http';
import {CommentsComponent} from './comments/comments.component';
import {DateTimeFormatterPipe} from './_pipes/date-time-formatter.pipe';
import {BaseUrlInterceptor} from './_config/base-url-interceptor';
import {YoutubePlayerModule} from 'ngx-youtube-player';
import {BasicAuthInterceptor} from './_config/basic-auth-interceptor';
import {EventFlowComponent} from './event-flow/event-flow.component';
import {AuthServiceConfig, FacebookLoginProvider, SocialLoginModule} from 'angular-6-social-login';
import {NameReversePipe} from './_pipes/name-reverse.pipe';
import {GalleryComponent} from './gallery/gallery.component';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {ProfileSettingsComponent} from './profile-settings/profile-settings.component';
import {UsersComponent} from './users/users.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {routing} from './app.routing';


export function getAuthServiceConfigs() {
  return new AuthServiceConfig(
    [{
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('1771148716341703')
    }]
  );
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TimeTableComponent,
    PaymentsComponent,
    AlternativeCalendarComponent,
    VideoEmbedderComponent,
    CommentsComponent,
    DateTimeFormatterPipe,
    NameReversePipe,
    EventFlowComponent,
    GalleryComponent,
    ProfileSettingsComponent,
    UsersComponent
  ],
  imports: [
    routing,
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    CommonModule,
    HttpModule,
    YoutubePlayerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgxHmCarouselModule,
    RecaptchaModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    {provide: MOMENT, useValue: moment},
    {provide: AuthServiceConfig, useFactory: getAuthServiceConfigs},
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
