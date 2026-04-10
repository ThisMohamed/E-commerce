import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  numOfWishlistItems = signal<number>(0);
  wishlistProductIds: WritableSignal<string[]> = signal([]);

  getLoggedUserWishList(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  addProductToWishList(prodId: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId: prodId,
    });
  }

  removeProductFromWishList(prodId: any): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${prodId}`);
  }
}
