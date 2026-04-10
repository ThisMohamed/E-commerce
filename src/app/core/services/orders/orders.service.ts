import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);

  checkoutSession(cartId: any, data: any): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
      data,
    );
  }

  createCashOrder(cartId: any, data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`, data);
  }

  getuserOrders(userId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`);
  }
}
