import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserCredentialService {

  private isAdmin: boolean;
  private userName: string;
  private basicAuth: string;

  constructor(private router: Router) {
    const storedBasicAuth = JSON.parse(localStorage.getItem('basic_auth'));
    if (storedBasicAuth) {
      const diffInOurs: number = (Date.now() - storedBasicAuth.createdTime) / 1000 / 60 / 60 ;
      if (diffInOurs > 10) {
        this.router.navigate(['login']);
      } else {
        this.basicAuth = storedBasicAuth.encodedAuth;
        this.isAdmin = true;
      }
    }
  }

  storeCredential(username: string, password: string): boolean {
    this.basicAuth = btoa(username + ':' + password);
    localStorage.setItem('basic_auth', JSON.stringify({encodedAuth: this.basicAuth, createdTime: Date.now()}));
    this.isAdmin = true;
    this.userName = username;
    return true;
  }

  isAdminUser(): boolean {
    return this.isAdmin;
  }

  getBasicAuth(): string {
    return this.basicAuth;
  }


}
