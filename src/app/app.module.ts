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
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {BasicAuthInterceptor} from './_config/authentication-service-interceptor';
import {ServiceInterceptor} from './_config/service-interceptor';
import {EmbedVideo} from 'ngx-embed-video/dist';
import { VideoEmbedderComponent } from './video-embedder/video-embedder.component';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TimeTableComponent,
    PaymentsComponent,
    AlternativeCalendarComponent,
    VideoEmbedderComponent
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
    EmbedVideo.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ServiceInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
