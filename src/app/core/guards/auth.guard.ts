import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  return tokenService.isAuthenticated() ? true : router.createUrlTree(['/auth/login']);
};
