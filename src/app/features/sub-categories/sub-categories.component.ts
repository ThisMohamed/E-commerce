import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategory } from '../../core/models/categories/icategory.interface';
import { SubCategory } from '../../core/models/sub-category/sub-category.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sub-categories',
  imports: [
    RouterLink,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TranslatePipe,
  ],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css',
})
export class SubCategoriesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoriesService = inject(CategoriesService);
  categoryDetails: WritableSignal<Icategory | null> = signal(null);
  subCategoryList: WritableSignal<SubCategory[]> = signal([]);
  categoryId: WritableSignal<string | null> = signal('');
  isLoadingSubCategories = signal(false);
  isLoadingCategory = signal<boolean>(false);

  ngOnInit(): void {
    this.getCategoryIdFromRout();
  }

  getCategoryIdFromRout() {
    this.activatedRoute.paramMap.subscribe((url) => {
      if (url.get('categoryId')) {
        this.categoryId.set(url.get('categoryId'));
        this.getSpecificCategory();
        this.getAllSubCategoriesOnCategory();
      }
    });
  }

  getSpecificCategory() {
    this.isLoadingCategory.set(true);
    this.categoriesService.getSpecificCategory(this.categoryId()).subscribe({
      next: (res) => {
        this.isLoadingCategory.set(false);
        this.categoryDetails.set(res.data);
      },
      error: (err) => {
        this.isLoadingCategory.set(false);
      },
    });
  }

  getAllSubCategoriesOnCategory() {
    this.isLoadingSubCategories.set(true);
    this.categoriesService.getAllSubCategoriesOnCategory(this.categoryId()).subscribe({
      next: (res) => {
        this.isLoadingSubCategories.set(false);
        this.subCategoryList.set(res.data);
      },
      error: (err) => {
        this.isLoadingSubCategories.set(false);
      },
    });
  }
}
