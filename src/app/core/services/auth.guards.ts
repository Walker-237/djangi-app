import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

export const redirectAuthenticatedToDashboard = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  return tokenService.isAuthenticated() ? router.createUrlTree(['/app/dashboard']) : true;
};
