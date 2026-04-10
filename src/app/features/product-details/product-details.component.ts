import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { register } from 'swiper/element/bundle';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ToasterService } from '../../core/services/toaster/toaster.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProductDetails } from '../../core/models/product-details/iproduct-details.interface';
import { Iproduct } from '../../core/models/products/iproduct.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { MyTranslateService } from '../../core/services/myTranslate/my-translate.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateCategoryPipe } from '../../shared/pipes/translate-category.pipe';
import { ImageMagnifierComponent } from '../../shared/components/image-magnifier/image-magnifier.component';
import { InsightsService } from '../../core/services/insights/insights.service';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, ProductCardComponent, TranslatePipe, TranslateCategoryPipe, ImageMagnifierComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly myTranslate = inject(MyTranslateService);
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly toaster = inject(ToasterService);
  private readonly insightsService = inject(InsightsService);
  productDetails: WritableSignal<IProductDetails | null> = signal(null);
  likedProductsLst: WritableSignal<Iproduct[]> = signal([]);
  productId: WritableSignal<string | null> = signal('');
  isBrowser = signal(false);
  isLoadingDetails = signal<boolean>(false);
  isAddingProductToWishlist = signal<boolean>(false);
  isRemovingProductFromWishlist = signal<boolean>(false);
  isAddingProductToCart = signal<boolean>(false);
  wishlistProductIds = computed(() => this.wishlistService.wishlistProductIds());
  activeTab = signal<string>('details');
  direction = computed(() => this.myTranslate.direction());
  stars = signal<number[]>([1, 2, 3, 4, 5]);
  quantity = signal<number>(1);

  ngOnInit(): void {
    this.getProductIdFromRout();
    if (isPlatformBrowser(this.platformId)) {
      register();
      this.isBrowser.set(true);
    }
  }

  getProductIdFromRout() {
    this.activatedRoute.paramMap.subscribe((url) => {
      if (url.get('productId')) {
        this.productId.set(url.get('productId'));
        this.getProductDetails();
      }
    });
  }

  getProductDetails() {
    this.isLoadingDetails.set(true);
    this.productsService.getSpecificProduct(this.productId()).subscribe({
      next: (res) => {
        this.isLoadingDetails.set(false);
        this.productDetails.set(res.data);
        this.insightsService.trackProductView(res.data);
        this.getLikedProducts(this.productDetails()!.category._id);
      },
      error: (err) => {
        this.isLoadingDetails.set(false);
      },
    });
  }

  calcDiscountPercentage(oldPrice: number, newPrice: number) {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
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

  increment(available: number) {
    if (this.quantity() < available) {
      this.quantity.update((value) => value + 1);
    }
  }

  decrement() {
    if (this.quantity() > 1) {
      this.quantity.update((value) => value - 1);
    }
  }
  onInputChange(event: Event, available: number) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);
    if (!value || value < 1) {
      this.quantity.set(1);
      return;
    }
    if (value > available) {
      this.quantity.set(available);
      return;
    }
    this.quantity.set(value);
  }

  ratingDistribution = computed(() => {
    const reviews = this.productDetails()?.reviews || [];
    const total = reviews.length;
    const stars = [5, 4, 3, 2, 1];
    return stars.map((star) => {
      const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        star,
        count,
        percentage,
      };
    });
  });

  getLikedProducts(categoryId: string) {
    const filter = {
      category: categoryId,
    };

    this.productsService.getAllProductsWithFilters(filter).subscribe({
      next: (res) => {
        const filteredProducts = res.data.filter(
          (product: any) => product._id !== this.productDetails()?._id,
        );
        this.likedProductsLst.set(filteredProducts);
      },
    });
  }
}
