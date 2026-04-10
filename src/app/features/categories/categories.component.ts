import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { RouterLink } from '@angular/router';
import { Icategory } from '../../core/models/categories/icategory.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateCategoryPipe } from '../../shared/pipes/translate-category.pipe';

@Component({
  selector: 'app-categories',
  imports: [
    RouterLink,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TranslatePipe,
    TranslateCategoryPipe,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  categoriesList: WritableSignal<Icategory[]> = signal([]);
  isLoadingCategories = signal<boolean>(false);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.isLoadingCategories.set(true);
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.isLoadingCategories.set(false);
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        this.isLoadingCategories.set(false);
      },
    });
  }
}
