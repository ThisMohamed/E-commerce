import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ErrorMessageAlertComponent } from '../../../shared/components/error-message-alert/error-message-alert.component';
import { ToasterService } from '../../services/toaster/toaster.service';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ErrorMessageAlertComponent, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toasterService = inject(ToasterService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  isLoginLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
    rememberMe: [false],
  });

  login() {
    if (this.loginForm.valid) {
      this.isLoginLoading.set(true);
      const { rememberMe, ...data } = this.loginForm.value;
      this.authService.signIn(data).subscribe({
        next: (res) => {
          this.isLoginLoading.set(false);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.authService.isLogged.set(true);
          this.authService.loggedUser.set(res.user);
          this.getNumOfWishlistItems();
          this.getNumOfCartItems();
          this.toasterService.success('toasts.loginSuccess');
          this.loginForm.reset();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoginLoading.set(false);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  getNumOfWishlistItems() {
    this.wishlistService.getLoggedUserWishList().subscribe({
      next: (res) => {
        this.wishlistService.numOfWishlistItems.set(res.count);
        this.wishlistService.wishlistProductIds.set(res.data.map((product: any) => product._id));
      },
    });
  }

  getNumOfCartItems() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
      },
    });
  }
}
