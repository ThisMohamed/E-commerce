import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(pageNum: number = 1): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands?page=${pageNum}`);
  }

  getSpecificBrand(brandId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands/${brandId}`);
  }
}
