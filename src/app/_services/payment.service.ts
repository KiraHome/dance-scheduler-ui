import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {
  }

  getPaymentTable(): Observable<any> {
    return this.http.get('payment');
  }

  setPayment(payment: { username: any; lastPaid: Date }): Observable<any> {
    return this.http.put('payment', payment);
  }
}
