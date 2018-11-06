import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  isLoggedIn(): boolean {
    return !!window.localStorage.getItem('credentials');
  }

  logout(): void {
    window.localStorage.removeItem('credentials');
  }

  getPic(): string {
    return window.localStorage.getItem('userPicUrl');
  }

  ngOnInit() {
  }
}
