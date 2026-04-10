import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Iuser } from '../../models/user/iuser.interface';
import { WishlistService } from '../wishlist/wishlist.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly wishlistService = inject(WishlistService);
  isLogged = signal<boolean>(false);
  loggedUser = signal<Iuser | null>(null);

  signUp(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data);
  }

  signIn(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  verifyResetCode(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data);
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.wishlistService.wishlistProductIds.set([]);
    this.isLogged.set(false);
    this.loggedUser.set(null);
    this.router.navigate(['/login']);
  }

  getLoggedUserData(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/users/getMe`);
  }

  updateLoggedUserData(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/users/updateMe/`, data);
  }

  updateLoggedUserPassword(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/users/changeMyPassword`, data);
  }
}
