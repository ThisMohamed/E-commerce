import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToasterService } from '../../services/toaster/toaster.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const pLATFORM_ID = inject(PLATFORM_ID);
  const toaster = inject(ToasterService);

  if (isPlatformBrowser(pLATFORM_ID)) {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      toaster.warning('Please Login First To Access This Page');
      return router.parseUrl('/login');
    }
  } else {
    return true;
  }
};
