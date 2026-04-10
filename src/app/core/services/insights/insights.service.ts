import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ProductView {
  productId: string;
  title: string;
  category: string;
  categoryId: string;
  imageCover: string;
  price: number;
  timestamp: number;
}

export interface InsightsData {
  productViews: ProductView[];
  visitDays: string[];
  addToCartCount: number;
  addToWishlistCount: number;
  searchQueries: string[];
}

const STORAGE_KEY = 'freshcart_insights';
const MAX_VIEWS = 50;
const MAX_SEARCHES = 30;

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private data = signal<InsightsData>(this.load());

  readonly productViews = computed(() => this.data().productViews);
  readonly visitDays = computed(() => this.data().visitDays);
  readonly addToCartCount = computed(() => this.data().addToCartCount);
  readonly addToWishlistCount = computed(() => this.data().addToWishlistCount);
  readonly searchQueries = computed(() => this.data().searchQueries);

  readonly totalProductsViewed = computed(() => this.data().productViews.length);

  readonly uniqueProductsViewed = computed(() => {
    const ids = new Set(this.data().productViews.map((v) => v.productId));
    return ids.size;
  });

  readonly currentStreak = computed(() => {
    const days = [...this.data().visitDays].sort().reverse();
    if (days.length === 0) return 0;

    let streak = 0;
    const today = this.todayStr();
    const yesterday = this.dateStr(new Date(Date.now() - 86400000));

    if (days[0] !== today && days[0] !== yesterday) return 0;

    for (let i = 0; i < days.length; i++) {
      const expected = this.dateStr(new Date(Date.now() - i * 86400000));
      if (days[i] === expected) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  });

  readonly topCategories = computed(() => {
    const counts: Record<string, { name: string; id: string; count: number }> = {};
    for (const v of this.data().productViews) {
      if (!counts[v.categoryId]) {
        counts[v.categoryId] = { name: v.category, id: v.categoryId, count: 0 };
      }
      counts[v.categoryId].count++;
    }
    return Object.values(counts).sort((a, b) => b.count - a.count);
  });

  readonly recentlyViewed = computed(() => {
    const seen = new Set<string>();
    const result: ProductView[] = [];
    const views = [...this.data().productViews].reverse();
    for (const v of views) {
      if (!seen.has(v.productId)) {
        seen.add(v.productId);
        result.push(v);
      }
      if (result.length >= 8) break;
    }
    return result;
  });

  readonly topSearches = computed(() => {
    const counts: Record<string, number> = {};
    for (const q of this.data().searchQueries) {
      const key = q.toLowerCase().trim();
      if (key) counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));
  });

  constructor() {
    this.recordVisit();
  }

  trackProductView(product: {
    _id: string;
    title: string;
    category: { _id: string; name: string };
    imageCover: string;
    price: number;
  }) {
    this.update((d) => {
      d.productViews.push({
        productId: product._id,
        title: product.title,
        category: product.category.name,
        categoryId: product.category._id,
        imageCover: product.imageCover,
        price: product.price,
        timestamp: Date.now(),
      });
      if (d.productViews.length > MAX_VIEWS) {
        d.productViews = d.productViews.slice(-MAX_VIEWS);
      }
    });
  }

  trackAddToCart() {
    this.update((d) => d.addToCartCount++);
  }

  trackAddToWishlist() {
    this.update((d) => d.addToWishlistCount++);
  }

  trackSearch(query: string) {
    if (!query.trim()) return;
    this.update((d) => {
      d.searchQueries.push(query.trim());
      if (d.searchQueries.length > MAX_SEARCHES) {
        d.searchQueries = d.searchQueries.slice(-MAX_SEARCHES);
      }
    });
  }

  clearInsights() {
    const empty = this.defaultData();
    this.data.set(empty);
    this.save(empty);
  }

  private recordVisit() {
    const today = this.todayStr();
    const current = this.data();
    if (!current.visitDays.includes(today)) {
      this.update((d) => d.visitDays.push(today));
    }
  }

  private update(fn: (data: InsightsData) => void) {
    const copy: InsightsData = JSON.parse(JSON.stringify(this.data()));
    fn(copy);
    this.data.set(copy);
    this.save(copy);
  }

  private load(): InsightsData {
    if (!this.isBrowser) return this.defaultData();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.defaultData();
      return JSON.parse(raw) as InsightsData;
    } catch {
      return this.defaultData();
    }
  }

  private save(data: InsightsData) {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private defaultData(): InsightsData {
    return {
      productViews: [],
      visitDays: [],
      addToCartCount: 0,
      addToWishlistCount: 0,
      searchQueries: [],
    };
  }

  private todayStr(): string {
    return this.dateStr(new Date());
  }

  private dateStr(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
