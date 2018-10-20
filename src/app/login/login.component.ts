import {Component, OnInit} from '@angular/core';
import {ShareButtons} from '@ngx-share/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginName: string;
  loginPass: string;

  constructor(public share: ShareButtons) {
  }

  ngOnInit() {
  }

  login(): void {
    if (this.loginName === 'tanc' && this.loginPass === 'tanc') {
      window.localStorage.setItem('credentials', 'ADMIN');
    }
  }

  register(): void {
  }
}
