import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { hasStoredToken } from './auth-token';

export const redirectAuthenticatedToDashboard: CanActivateFn = () => {
  const router = inject(Router);
  return hasStoredToken() ? router.parseUrl('/app/dashboard') : true;
};

