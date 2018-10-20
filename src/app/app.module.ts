import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {FullCalendarModule} from 'ng-fullcalendar';
import {ModalComponent} from './modal/modal.component';
import {HttpClientModule} from '@angular/common/http';
import { ShareButtonModule } from '@ngx-share/button';


import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
const shareProp = {
  facebook: {
    icon: faFacebookSquare
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ShareButtonModule.forRoot({ prop: shareProp })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
