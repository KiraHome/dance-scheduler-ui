import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {UserCredentialService} from '../_services/user-credential.service';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private userCredentialService: UserCredentialService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const basicAuth = this.userCredentialService.getBasicAuth();
    if (basicAuth) {
      const authSting = 'Basic ' + basicAuth;
      req = req.clone({
        setHeaders: {
          Authorization: `${authSting}`
        }
      });
    }

    return next.handle(req);
  }
}
