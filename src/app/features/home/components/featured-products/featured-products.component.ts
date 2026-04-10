import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { ProductsService } from '../../../../core/services/products/products.service';
import { Iproduct } from '../../../../core/models/products/iproduct.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-products',
  imports: [SectionTitleComponent, ProductCardComponent, TranslatePipe],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productsList = signal<Iproduct[]>([]);

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productsList.set(res.data);
      },
    });
  }
}
