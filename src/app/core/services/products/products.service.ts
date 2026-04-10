import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`);
  }
  getSpecificProduct(productId: string | null): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${productId}`);
  }

  getAllProductsWithFilters(filters: any = {}, pageNum: number = 1): Observable<any> {
    let params = new HttpParams().set('page', pageNum.toString());
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, { params });
  }

  getProductsOnSearch(params: any, pageNum: number = 1, limit: number = 12): Observable<any> {
    const { q, ...rest } = params;
    return this.httpClient
      .get(`${environment.baseUrl}/api/v1/products`, {
        params: { ...rest, limit: 100 },
      })
      .pipe(
        map((res: any) => {
          let filtered = res.data ?? [];
          if (q?.trim()) {
            const keyword = q.trim().toLowerCase();
            filtered = filtered.filter((p: any) =>
              p.title?.toLowerCase().includes(keyword)
            );
          }
          const start = (pageNum - 1) * limit;
          return {
            ...res,
            data: filtered.slice(start, start + limit),
            results: filtered.length,
            metadata: { currentPage: pageNum, limit },
          };
        })
      );
  }
}
