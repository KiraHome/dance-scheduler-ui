import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginName: string;
  loginPass: string;

  constructor() {}

  ngOnInit() {}

  login(): void {
    console.log('Login name: ' + this.loginName + ', pass: ' + this.loginPass);
  }

  register(): void {}
}
