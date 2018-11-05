import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  isLoggedInAdmin(): boolean {
    return window.localStorage.getItem('credentials') === 'ADMIN';
  }

  logout(): void {
    window.localStorage.removeItem('credentials');
  }

  ngOnInit() {
  }
}
