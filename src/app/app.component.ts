import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isShowPersonalSettings: boolean;
  isShowUsers: boolean;

  constructor() {
  }

  isLoggedIn(): boolean {
    return !!window.localStorage.getItem('credentials');
  }

  logout(): void {
    window.localStorage.removeItem('credentials');
  }

  ngOnInit() {
    this.isShowPersonalSettings = false;
  }

  openUsers(): void {
    this.isShowUsers = true;
  }

  openPersonalSettings(): void {
    this.isShowPersonalSettings = true;
  }

  closePersonalSettings(): void {
    this.isShowPersonalSettings = false;
  }

  optionsSaved($event): void {
    this.closePersonalSettings();
  }

  isShowMainPage(): boolean {
    return this.isLoggedIn() && !this.isShowPersonalSettings && !this.isShowUsers;
  }

  usersClosed() {
    this.isShowUsers = false;
  }
}
