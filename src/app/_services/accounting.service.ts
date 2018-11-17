import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface PaymentObject {
  payTimestamp: Date;
  credit: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  constructor(private http: HttpClient) {
  }

  getAccountingList(): Observable<any> {
    const headers = {
      username: window.localStorage.getItem('user'),
      token: window.localStorage.getItem('credentials')
    };

    return this.http.get('accounting', {headers: headers});
  }

  savePayment(payment: PaymentObject): Observable<any> {
    const headers = {
      username: window.localStorage.getItem('user'),
      token: window.localStorage.getItem('credentials')
    };

    return this.http.put('accounting', payment, {headers: headers});
  }
}
