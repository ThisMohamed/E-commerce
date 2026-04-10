import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Icategory } from '../../core/models/categories/icategory.interface';
import { Ibrand } from '../../core/models/brands/ibrand.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { Iproduct } from '../../core/models/products/iproduct.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-search',
  imports: [
    RouterLink,
    ProductCardComponent,
    NgxPaginationModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TranslatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  isLoadingProducts = signal<boolean>(false);
  searchQuery: WritableSignal<string> = signal('');
  private readonly categoriesService = inject(CategoriesService);
  private readonly brandsService = inject(BrandsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  categoriesList: WritableSignal<Icategory[]> = signal([]);
  brandsList: WritableSignal<Ibrand[]> = signal([]);
  selectedCategories: WritableSignal<string[]> = signal([]);
  selectedBrands: WritableSignal<string[]> = signal([]);
  minPrice: WritableSignal<number | null> = signal(null);
  maxPrice: WritableSignal<number | null> = signal(null);
  sort: WritableSignal<string | null> = signal(null);
  pageSize = signal<number>(0);
  currPage = signal<number>(0);
  total = signal<number>(0);
  queryParmeters = signal({});
  productsList: WritableSignal<Iproduct[]> = signal([]);
  isMenuOpen = signal(false);
  viewType = signal<string>('grid');

  ngOnInit(): void {
    this.getAllCategories();
    this.getBrands();
    this.getQueryParamsFromRoute();
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
    });
  }

  getBrands() {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
      },
    });
  }

  getQueryParamsFromRoute() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchQuery.set(params['q'] || '');
      this.selectedCategories.set(params['category'] ? [].concat(params['category']) : []);
      this.selectedBrands.set(params['brand'] ? [].concat(params['brand']) : []);
      this.minPrice.set(params['minPrice'] ? +params['minPrice'] : null);
      this.maxPrice.set(params['maxPrice'] ? +params['maxPrice'] : null);
      this.sort.set(params['sort'] || null);
      this.queryParmeters.set(params);
      this.fetchProducts(1);
    });
  }

  onMinPriceChange(value: string) {
    this.minPrice.set(value ? +value : null);
    this.updateFilters();
  }

  onMaxPriceChange(value: string) {
    this.maxPrice.set(value ? +value : null);
    this.updateFilters();
  }

  setMaxPrice(value: number) {
    this.maxPrice.set(value);
    this.updateFilters();
  }

  clearPrice() {
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.updateFilters();
  }

  onSortChange(value: string) {
    this.sort.set(value || null);
    this.updateFilters();
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    this.updateFilters();
  }

  onSearchSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.updateFilters();
  }
  updateFilters() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        q: this.searchQuery()?.trim() ? this.searchQuery()?.trim() : null,
        category: this.selectedCategories(),
        brand: this.selectedBrands(),
        minPrice: this.minPrice(),
        maxPrice: this.maxPrice(),
        sort: this.sort(),
      },
      queryParamsHandling: 'merge',
    });
  }

  removeSearchQuery() {
    this.searchQuery.set('');
    this.updateFilters();
  }

  toggleCategory(id: string) {
    const current = this.selectedCategories();
    if (current.includes(id)) {
      this.selectedCategories.set(current.filter((c) => c !== id));
    } else {
      this.selectedCategories.set([...current, id]);
    }
    this.updateFilters();
  }

  fetchProducts(pageNum: number) {
    this.isLoadingProducts.set(true);
    this.productsService.getProductsOnSearch(this.queryParmeters(), pageNum, 12).subscribe({
      next: (res: any) => {
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

  toggleBrand(id: string) {
    const current = this.selectedBrands();
    if (current.includes(id)) {
      this.selectedBrands.set(current.filter((b) => b !== id));
    } else {
      this.selectedBrands.set([...current, id]);
    }
    this.updateFilters();
  }

  removeCategory(id: string) {
    this.selectedCategories.set(this.selectedCategories().filter((c) => c !== id));
    this.updateFilters();
  }

  removeBrand(id: string) {
    this.selectedBrands.set(this.selectedBrands().filter((b) => b !== id));
    this.updateFilters();
  }

  changeViewType(value: string) {
    this.viewType.set(value);
  }

  openFilters() {
    this.isMenuOpen.set(true);
  }

  closeFilters() {
    this.isMenuOpen.set(false);
  }
}
