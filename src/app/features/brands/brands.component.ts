import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Ibrand } from '../../core/models/brands/ibrand.interface';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-brands',
  imports: [
    RouterLink,
    PageHeaderComponent,
    NgxPaginationModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TranslatePipe,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  isLoadingBrands = signal<boolean>(false);
  brandsList: WritableSignal<Ibrand[]> = signal([]);
  pageSize = signal<number>(0);
  currPage = signal<number>(0);
  total = signal<number>(0);

  ngOnInit(): void {
    this.getAllBrands(1);
  }

  getAllBrands(pageNum: number) {
    this.isLoadingBrands.set(true);
    this.brandsService.getAllBrands(pageNum).subscribe({
      next: (res) => {
        this.isLoadingBrands.set(false);
        this.brandsList.set(res.data);
        this.currPage.set(res.metadata.currentPage);
        this.pageSize.set(res.metadata.limit);
        this.total.set(res.results);
      },
      error: (err) => {
        this.isLoadingBrands.set(false);
      },
    });
  }
}
