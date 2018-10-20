import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {FullCalendarModule} from 'ng-fullcalendar';
import {ModalComponent} from './modal/modal.component';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonModule} from '@ngx-share/button';
import {PersonalTrainingComponent} from './personal-training/personal-training.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ModalComponent,
    PersonalTrainingComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    ShareButtonModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
