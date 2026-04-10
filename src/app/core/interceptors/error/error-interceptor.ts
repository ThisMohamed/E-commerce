import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../../services/toaster/toaster.service';
import { isPlatformBrowser } from '@angular/common';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toasterService = inject(ToasterService);
  const platformId = inject(PLATFORM_ID);
  return next(req).pipe(
    catchError((err) => {
      if (isPlatformBrowser(platformId)) {
        toasterService.error(err.error.message);
      }

      return throwError(() => err);
    }),
  );
};
