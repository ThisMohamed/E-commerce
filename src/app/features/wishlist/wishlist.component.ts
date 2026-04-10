import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';
import { Iproduct } from '../../core/models/products/iproduct.interface';
import { ToasterService } from '../../core/services/toaster/toaster.service';
import { CartService } from '../../core/services/cart/cart.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateCategoryPipe } from '../../shared/pipes/translate-category.pipe';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, LoadingSpinnerComponent, EmptyStateComponent, TranslatePipe, TranslateCategoryPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly toasterService = inject(ToasterService);
  wishList: WritableSignal<Iproduct[]> = signal([]);
  isLoadingWishlist = signal<boolean>(true);
  cartProductIds: WritableSignal<string[]> = signal([]);
  removingProductId = signal<string | null>(null);
  productIdAddToCart = signal<string>('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.getLoggedUserWishList();
        this.getLoggedUserCart();
      } else {
        this.isLoadingWishlist.set(false);
      }
    }
  }

  getLoggedUserWishList() {
    this.isLoadingWishlist.set(true);
    this.wishlistService.getLoggedUserWishList().subscribe({
      next: (res) => {
        this.isLoadingWishlist.set(false);
        this.wishList.set(res.data);
      },
      error: (err) => {
        this.isLoadingWishlist.set(false);
      },
    });
  }

  removeProductFromWishList(prodId: string) {
    this.removingProductId.set(prodId);
    this.wishlistService.removeProductFromWishList(prodId).subscribe({
      next: (res) => {
        this.removingProductId.set(null);
        if (res.status == 'success') {
          this.wishlistService.numOfWishlistItems.set(res.data.length);
          this.wishlistService.wishlistProductIds.set(res.data);
          this.toasterService.success('toasts.removedFromWishlist');
          this.wishList.update((oldWishList) => oldWishList.filter((item) => item._id !== prodId));
        }
      },
      error: (err) => {
        this.removingProductId.set(null);
      },
    });
  }

  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartProductIds.set(res.data.products.map((item: any) => item.product._id));
      },
    });
  }

  isInCart(productId: string): boolean {
    return this.cartProductIds().includes(productId);
  }

  addProductToCart(prodId: string) {
    this.productIdAddToCart.set(prodId);
    this.cartService.addProductToCart(prodId).subscribe({
      next: (res) => {
        this.productIdAddToCart.set('');
        this.cartService.numOfCartItems.set(res.numOfCartItems);
        this.toasterService.success(res.message);
        this.cartProductIds.update((cartIds) => [...cartIds, prodId]);
      },
      error: (err) => {
        this.productIdAddToCart.set('');
      },
    });
  }
}
