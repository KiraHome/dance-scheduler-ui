import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isShowTimeTable: boolean;
  isShowPersonalClasses: boolean;
  isShowPayments: boolean;

  constructor() {
  }

  isLoggedInAdmin(): boolean {
    return window.localStorage.getItem('credentials') === 'ADMIN';
  }

  logout(): void {
    window.localStorage.removeItem('credentials');
  }

  showTimeTable(): void {
    this.isShowTimeTable = true;
    this.isShowPersonalClasses = false;
    this.isShowPayments = false;
  }

  showPersonalClasses(): void {
    this.isShowTimeTable = false;
    this.isShowPersonalClasses = true;
    this.isShowPayments = false;
  }

  showPayments(): void {
    this.isShowTimeTable = false;
    this.isShowPersonalClasses = false;
    this.isShowPayments = true;
  }

  ngOnInit() {
  }
}
