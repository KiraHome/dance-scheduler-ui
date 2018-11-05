import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ShareButtonModule} from '@ngx-share/button';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TimeTableComponent,
    PaymentsComponent,
    AlternativeCalendarComponent,
    VideoEmbedderComponent,
    CommentsComponent,
    DateTimeFormatterPipe
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ShareButtonModule.forRoot(),
    CommonModule,
    HttpModule,
    YoutubePlayerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true},
    {provide: MOMENT, useValue: moment}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
