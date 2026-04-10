import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../core/models/cart/icart.interface';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslateCategoryPipe } from '../../shared/pipes/translate-category.pipe';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, LoadingSpinnerComponent, EmptyStateComponent, TranslatePipe, TranslateCategoryPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  updatingItemId = signal<string | null>(null);
  cartDetails: WritableSignal<Icart | null> = signal(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.getLoggedUserCart();
  }

  getLoggedUserCart() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.isLoading.set(true);
        this.cartService.getLoggedUserCart().subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.cartDetails.set(res);
          },
          error: (err) => {
            this.isLoading.set(false);
          },
        });
      } else {
        this.isLoading.set(false);
      }
    }
  }

  removeItemFromCart(id: string) {
    this.updatingItemId.set(id);
    this.cartService.removeItemFromCart(id).subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
        this.updatingItemId.set(null);
        this.cartDetails.set(res);
      },
      error: (err) => {
        this.updatingItemId.set(null);
      },
    });
  }

  clearUserCart() {
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        this.clearCartSuccessAlert();
        this.cartService.numOfCartItems.set(0);
        setTimeout(() => {
          this.cartDetails.set(null);
        }, 3000);
      },
    });
  }

  updateCartProductQuantity(id: string, newCount: number) {
    this.updatingItemId.set(id);
    this.cartService.updateCartProductQuantity(id, newCount).subscribe({
      next: (res) => {
        this.updatingItemId.set(null);
        this.cartService.numOfCartItems.set(res.numOfCartItems);
        this.cartDetails.set(res);
      },
      error: (err) => {
        this.updatingItemId.set(null);
      },
    });
  }

  private readonly translateService = inject(TranslateService);

  onConfirmRemoveItem(id: string, productTitle: string) {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const title = this.translateService.instant('cart.dialog.removeTitle');
      const confirmBtn = this.translateService.instant('cart.dialog.confirmBtn');
      const cancelBtn = this.translateService.instant('cart.dialog.cancelBtn');
      const messagePart1 = this.translateService.instant('cart.dialog.removeMessagePart1');
      const messagePart2 = this.translateService.instant('cart.dialog.removeMessagePart2');

      Swal.fire({
        html: `
        <div class="py-2">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">${title}</h3>
          <p class="text-gray-500 text-sm">
            ${messagePart1} <span class="font-semibold text-gray-700">${productTitle}</span> ${messagePart2}
          </p>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: confirmBtn,
        cancelButtonText: cancelBtn,
        reverseButtons: true,
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl p-6 shadow-2xl border-0',
          confirmButton:
            'bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all ms-3',
          cancelButton:
            'bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeItemFromCart(id);
        }
      });
    }
  }

  onClearUserCart() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const title = this.translateService.instant('cart.clearDialog.title');
      const message = this.translateService.instant('cart.clearDialog.message');
      const confirmBtn = this.translateService.instant('cart.clearDialog.confirmBtn');
      const cancelBtn = this.translateService.instant('cart.clearDialog.cancelBtn');

      Swal.fire({
        html: `
        <div class="py-2">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">${title}</h3>
          <p class="text-gray-500 text-sm">
            ${message}
          </p>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: confirmBtn,
        cancelButtonText: cancelBtn,
        reverseButtons: true,
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl p-6 shadow-2xl border-0',
          confirmButton:
            'bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all ms-3',
          cancelButton:
            'bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.clearUserCart();
        }
      });
    }
  }

  clearCartSuccessAlert() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const title = this.translateService.instant('cart.successDialog.title');
      const message = this.translateService.instant('cart.successDialog.message');
      const confirmBtn = this.translateService.instant('cart.successDialog.confirmBtn');

      Swal.fire({
        html: `
        <div class="py-2">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">${title}</h3>
          <p class="text-gray-500 text-sm mb-2">${message}</p>
        </div>
      `,
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
        confirmButtonText: confirmBtn,
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl p-6 shadow-2xl border-0',
          confirmButton:
            'bg-[#198754] cursor-pointer hover:bg-[#157347] text-white font-semibold py-3 px-10 rounded-xl transition-all w-full mt-4',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/home']);
        }
      });
    }
  }
}
