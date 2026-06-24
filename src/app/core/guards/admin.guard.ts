import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  if (!tokenService.isAuthenticated()) return router.createUrlTree(['/auth/login']);
  return tokenService.isAdmin() ? true : router.createUrlTree(['/app/dashboard']);
};
