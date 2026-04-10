import { Component, computed, inject, input, InputSignal, signal } from '@angular/core';
import { Iproduct } from '../../../core/models/products/iproduct.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { ToasterService } from '../../../core/services/toaster/toaster.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateCategoryPipe } from '../../pipes/translate-category.pipe';
import { InsightsService } from '../../../core/services/insights/insights.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, TranslatePipe, TranslateCategoryPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product: InputSignal<Iproduct> = input.required<Iproduct>();
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toaster = inject(ToasterService);
  private readonly insightsService = inject(InsightsService);
  isAddingProductToWishlist = signal<boolean>(false);
  isAddingProductToCart = signal<boolean>(false);
  isRemovingProductFromWishlist = signal<boolean>(false);
  wishlistProductIds = computed(() => this.wishlistService.wishlistProductIds());
  stars = signal<number[]>([1, 2, 3, 4, 5]);

  calcDiscountPercentage() {
    const oldPrice = this.product().price;
    const newPrice = this.product().priceAfterDiscount;
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100 * -1);
    return discount;
  }

  addProductToCart(prodId: string) {
    if (localStorage.getItem('token')) {
      this.isAddingProductToCart.set(true);
      this.cartService.addProductToCart(prodId).subscribe({
        next: (res) => {
          this.isAddingProductToCart.set(false);
          this.cartService.numOfCartItems.set(res.numOfCartItems);
          this.insightsService.trackAddToCart();
          this.toaster.success(res.message);
        },
        error: (err) => {
          this.isAddingProductToCart.set(false);
        },
      });
    } else {
      this.toaster.warning('toasts.loginToAddCart');
    }
  }

  addProductToWishlist(prodId: string) {
    if (localStorage.getItem('token')) {
      this.isAddingProductToWishlist.set(true);
      this.wishlistService.addProductToWishList(prodId).subscribe({
        next: (res) => {
          this.isAddingProductToWishlist.set(false);
          this.wishlistService.numOfWishlistItems.set(res.data.length);
          this.wishlistService.wishlistProductIds.set(res.data);
          this.insightsService.trackAddToWishlist();
          this.toaster.success(res.message);
        },
        error: (err) => {
          this.isAddingProductToWishlist.set(false);
        },
      });
    } else {
      this.toaster.warning('toasts.loginToAddWishlist');
    }
  }

  isInWishList(productId: string): boolean {
    return this.wishlistProductIds().includes(productId);
  }

  removeProductFromWishlist(prodId: string) {
    if (localStorage.getItem('token')) {
      this.isRemovingProductFromWishlist.set(true);
      this.wishlistService.removeProductFromWishList(prodId).subscribe({
        next: (res) => {
          this.isRemovingProductFromWishlist.set(false);
          this.wishlistService.numOfWishlistItems.set(res.data.length);
          this.wishlistService.wishlistProductIds.set(res.data);
          this.toaster.success('toasts.removedFromWishlist');
        },
        error: (err) => {
          this.isRemovingProductFromWishlist.set(false);
        },
      });
    } else {
      this.toaster.warning('toasts.loginToRemoveWishlist');
    }
  }
}
