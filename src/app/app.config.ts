import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { errorInterceptor } from './core/interceptors/error/error-interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { headerInterceptor } from './core/interceptors/header/header-interceptor';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json',
      }),
    }),
    provideSweetAlert2(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    MessageService,
    importProvidersFrom(NgxSpinnerModule),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withViewTransitions(),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor, headerInterceptor])),
  ],
};
