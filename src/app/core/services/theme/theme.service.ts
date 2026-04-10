import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        this.isDark.set(true);
      } else if (saved === null) {
        // Respect system preference if no saved theme
        this.isDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      this.applyTheme();
    }
  }

  toggleTheme(): void {
    this.isDark.set(!this.isDark());
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const html = document.documentElement;
      if (this.isDark()) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }
}
