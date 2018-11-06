import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const basicAuth = window.localStorage.getItem('credentials');
    if (basicAuth) {
      req = req.clone({
        setHeaders: {
          Authorization: `${basicAuth}`
        }
      });
    }
    return next.handle(req);
  }
}
