import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }

  getSpecificCategory(categoryId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories/${categoryId}`);
  }

  getAllSubCategoriesOnCategory(categoryId: any): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/categories/${categoryId}/subcategories`,
    );
  }

  getspecificSubCategory(subCategoryId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/subcategories/${subCategoryId}`);
  }
}
