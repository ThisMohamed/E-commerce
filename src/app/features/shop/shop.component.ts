import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductsService } from '../../core/services/products/products.service';
import { Iproduct } from '../../core/models/products/iproduct.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop',
  imports: [
    NgxPaginationModule,
    ProductCardComponent,
    RouterLink,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TranslatePipe,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly brandsService = inject(BrandsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  productsList = signal<Iproduct[]>([]);
  pageSize = signal<number>(0);
  currPage = signal<number>(0);
  total = signal<number>(0);
  isLoadingProducts = signal<boolean>(true);
  currentFilters = signal<any>({});
  headerData = signal<any>({ title: '', subtitle: '', image: '' });
  breadcrumb = signal<any[]>([]);
  private langSubscription!: Subscription;

  ngOnInit(): void {
    this.getProductsFiltersFromRoutePath();
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.handleHeader(this.currentFilters());
    });
  }

  getProductsFiltersFromRoutePath() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const filters: any = {};
      ['subcategory', 'brand', 'category', 'sort'].forEach((key) => {
        const value = params.get(key);
        if (value) {
          filters[key] = value;
        }
      });
      this.currentFilters.set(filters);
      this.setDefaultHeader(); //initially
      this.handleHeader(filters);
      this.getProductsData(1);
    });
  }

  getProductsData(pageNum: number) {
    this.isLoadingProducts.set(true);
    this.productsService.getAllProductsWithFilters(this.currentFilters(), pageNum).subscribe({
      next: (res) => {
        this.isLoadingProducts.set(false);
        this.currPage.set(res.metadata.currentPage);
        this.pageSize.set(res.metadata.limit);
        this.total.set(res.results);
        this.productsList.set(res.data);
      },
      error: (err) => {
        this.isLoadingProducts.set(false);
      },
    });
  }

  handleHeader(filters: any) {
    if (filters.brand) {
      this.loadBrand(filters.brand);
    } else if (filters.subcategory) {
      this.loadSubCategory(filters.subcategory);
    } else if (filters.category) {
      this.loadCategory(filters.category);
    } else {
      this.setDefaultHeader();
    }
  }

  loadBrand(id: string) {
    this.brandsService.getSpecificBrand(id).subscribe((res) => {
      const name = res.data.name;
      this.headerData.set({
        title: name,
        subtitle: this.translate.instant('shop.shopBrand', { name }),
        image: res.data.image,
      });
      this.breadcrumb.set([
        { label: this.translate.instant('shop.brands'), link: '/brands' },
        { label: name },
      ]);
    });
  }

  loadCategory(id: string) {
    this.categoriesService.getSpecificCategory(id).subscribe((res) => {
      const name = res.data.name;
      this.headerData.set({
        title: name,
        subtitle: this.translate.instant('shop.browseCategory', { name }),
        image: res.data.image,
      });
      this.breadcrumb.set([
        { label: this.translate.instant('shop.categories'), link: '/categories' },
        { label: name, link: `/categories/${res.data._id}` },
        { label: name },
      ]);
    });
  }

  loadSubCategory(id: string) {
    this.categoriesService.getspecificSubCategory(id).subscribe((res) => {
      const subName = res.data.name;
      this.headerData.set({
        title: subName,
        subtitle: this.translate.instant('shop.browseSub', { name: subName }),
        image: '',
      });
      this.breadcrumb.set([
        { label: this.translate.instant('shop.categories'), link: '/categories' },
        { label: subName },
      ]);
    });
  }

  setDefaultHeader() {
    const title = this.translate.instant('shop.allProducts');
    this.headerData.set({
      title: title,
      subtitle: this.translate.instant('shop.explore'),
      image: '',
    });
    this.breadcrumb.set([{ label: title }]);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
