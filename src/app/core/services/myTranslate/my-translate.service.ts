import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  private readonly platformId = inject(PLATFORM_ID);
  direction = signal<string>('ltr');
  currentLang = signal<string>(isPlatformBrowser(inject(PLATFORM_ID)) ? (localStorage.getItem('lang') ?? 'en') : 'en');
  private readonly translateService = inject(TranslateService);

  changeDirection() {
    if (localStorage.getItem('lang') === 'en') {
      document.documentElement.dir = 'ltr';
      this.direction.set('ltr');
    } else if (localStorage.getItem('lang') === 'ar') {
      document.documentElement.dir = 'rtl';
      this.direction.set('rtl');
    }
  }
  changeLanguage(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
    this.currentLang.set(lang);
    this.translateService.use(lang);
    this.changeDirection();
  }
}
