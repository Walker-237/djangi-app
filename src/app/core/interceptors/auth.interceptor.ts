import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  let request = req;

  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    const pinToken = localStorage.getItem('pin_token');
    const headers: Record<string, string> = {};

    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (pinToken) headers['X-Pin-Token'] = pinToken;

    if (Object.keys(headers).length > 0) {
      request = req.clone({ setHeaders: headers });
    }
  }

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('pin_token');
          localStorage.removeItem('current_user');
        }
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
