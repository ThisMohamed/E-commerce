import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);

  numOfCartItems = signal<number>(0);

  addProductToCart(prodId: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId: prodId,
    });
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`);
  }

  removeItemFromCart(itemId: any): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${itemId}`);
  }

  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`);
  }

  updateCartProductQuantity(productId: any, productCount: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${productId}`, {
      count: productCount,
    });
  }
}
