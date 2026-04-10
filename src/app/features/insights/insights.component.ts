import { Component, inject, computed, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InsightsService } from '../../core/services/insights/insights.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css',
})
export class InsightsComponent {
  private readonly insightsService = inject(InsightsService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly totalViews = this.insightsService.totalProductsViewed;
  readonly uniqueViews = this.insightsService.uniqueProductsViewed;
  readonly streak = this.insightsService.currentStreak;
  readonly cartCount = this.insightsService.addToCartCount;
  readonly wishlistCount = this.insightsService.addToWishlistCount;
  readonly topCategories = this.insightsService.topCategories;
  readonly recentlyViewed = this.insightsService.recentlyViewed;
  readonly topSearches = this.insightsService.topSearches;

  readonly hasData = computed(
    () => this.totalViews() > 0 || this.cartCount() > 0 || this.wishlistCount() > 0,
  );

  readonly maxCategoryCount = computed(() => {
    const cats = this.topCategories();
    return cats.length > 0 ? cats[0].count : 1;
  });

  showClearConfirm = signal(false);

  private readonly barColors = [
    'bg-primary-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  barColor(index: number): string {
    return this.barColors[index % this.barColors.length];
  }

  clearAll() {
    this.insightsService.clearInsights();
    this.showClearConfirm.set(false);
  }
}
