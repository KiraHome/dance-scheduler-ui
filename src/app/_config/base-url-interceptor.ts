import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const service_url = 'http://127.0.0.1:3001/';
    req = req.clone({
      url: service_url + req.url,
      headers: req.headers.append('Access-Control-Allow-Origin', '*')
    });
    return next.handle(req);
  }
}
