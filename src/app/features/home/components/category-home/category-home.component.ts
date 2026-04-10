import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { Icategory } from '../../../../core/models/categories/icategory.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateCategoryPipe } from '../../../../shared/pipes/translate-category.pipe';

@Component({
  selector: 'app-category-home',
  imports: [SectionTitleComponent, RouterLink, TranslatePipe, TranslateCategoryPipe],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  categoriesList = signal<Icategory[]>([]);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
    });
  }
}
