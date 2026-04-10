import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastModule } from 'primeng/toast';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from './core/services/myTranslate/my-translate.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('e-commerace');

  private readonly platformId = inject(PLATFORM_ID);

  private readonly translateService = inject(TranslateService);

  private readonly myTranslate = inject(MyTranslateService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // set default language
      this.translateService.setFallbackLang('en');

      // get language from localstorage

      let savedLang = localStorage.getItem('lang');
      // use language
      if (savedLang) {
        this.translateService.use(savedLang);
      }

      this.myTranslate.changeDirection();
    }
  }
}
