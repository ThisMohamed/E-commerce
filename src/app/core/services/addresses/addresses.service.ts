import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private readonly httpClient = inject(HttpClient);

  getLoggedUserAddresses(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/addresses`);
  }

  addUserAddress(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/addresses`, data);
  }

  removeUserAddress(addressId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/addresses/${addressId}`);
  }
}
