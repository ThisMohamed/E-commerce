import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorMessageAlertComponent } from '../../shared/components/error-message-alert/error-message-alert.component';
import { OrdersService } from '../../core/services/orders/orders.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../core/models/cart/icart.interface';
import { isPlatformBrowser } from '@angular/common';
import { ToasterService } from '../../core/services/toaster/toaster.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateCategoryPipe } from '../../shared/pipes/translate-category.pipe';
@Component({
  selector: 'app-checkout',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ErrorMessageAlertComponent,
    EmptyStateComponent,
    TranslatePipe,
    TranslateCategoryPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly toaster = inject(ToasterService);
  isLoadingCartDetails = signal<boolean>(true);
  isCheckOut = signal<boolean>(false);
  cartId: WritableSignal<string | null> = signal(null);
  cartDetails: WritableSignal<Icart | null> = signal(null);
  paymentMethod = signal<string>('cash');

  private readonly fb = inject(FormBuilder);
  checkoutForm: FormGroup = this.fb.group({
    details: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    this.getCartId();
    this.getUserCart();
  }

  getCartId() {
    this.activatedRoute.paramMap.subscribe({
      next: (urlPath) => {
        if (urlPath.get('cartId')) {
          this.cartId.set(urlPath.get('cartId'));
        }
      },
    });
  }

  getUserCart() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.isLoadingCartDetails.set(true);
        this.cartService.getLoggedUserCart().subscribe({
          next: (res) => {
            this.isLoadingCartDetails.set(false);
            this.cartDetails.set(res);
          },
          error: (err) => {
            this.isLoadingCartDetails.set(false);
          },
        });
      } else {
        this.isLoadingCartDetails.set(false);
      }
    }
  }

  checkout() {
    if (this.paymentMethod() == 'online') {
      this.checkoutSession();
    } else {
      this.createCashOrder();
    }
  }

  // pay with visa
  checkoutSession() {
    if (this.checkoutForm.valid) {
      const payload = {
        shippingAddress: this.checkoutForm.value,
      };
      this.isCheckOut.set(true);
      this.ordersService.checkoutSession(this.cartId(), payload).subscribe({
        next: (res) => {
          this.isCheckOut.set(false);
          if (res.status === 'success') {
            this.checkoutForm.reset();
            window.open(res.session.url, '_self');
          }
        },
        error: (err) => {
          this.isCheckOut.set(false);
        },
      });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  // pay cash
  createCashOrder() {
    if (this.checkoutForm.valid) {
      const payload = {
        shippingAddress: this.checkoutForm.value,
      };
      this.isCheckOut.set(true);
      this.ordersService.createCashOrder(this.cartId(), payload).subscribe({
        next: (res) => {
          this.isCheckOut.set(false);
          if (res.status === 'success') {
            this.toaster.success('toasts.orderPlaced');
            this.checkoutForm.reset();
            setTimeout(() => {
              this.router.navigate(['/allorders']);
            }, 2000);
          }
        },
        error: (err) => {
          this.isCheckOut.set(false);
        },
      });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
