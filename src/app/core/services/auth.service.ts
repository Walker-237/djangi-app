import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthOtpVerifyResponse, PinVerifyResponse, User } from '../models/models';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  requestOtp(phoneNumber: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/auth/otp/request', { phoneNumber });
  }

  verifyOtp(phoneNumber: string, otp: string): Observable<AuthOtpVerifyResponse> {
    return this.api.post<AuthOtpVerifyResponse>('/auth/otp/verify', { phoneNumber, otp }).pipe(
      tap((response) => this.saveAuthResponse(response)),
    );
  }

  setPin(pin: string): Observable<{ success: boolean }> {
    return this.api.post<{ success: boolean }>('/auth/pin/set', { pin });
  }

  verifyPin(pin: string): Observable<PinVerifyResponse> {
    return this.api.post<PinVerifyResponse>('/auth/pin/verify', { pin }).pipe(
      tap((response) => this.tokenService.savePinToken(response.pinToken)),
    );
  }

  pinLogin(phoneNumber: string, pin: string): Observable<AuthOtpVerifyResponse> {
    return this.api.post<AuthOtpVerifyResponse>('/auth/pin/login', { phoneNumber, pin }).pipe(
      tap((response) => this.saveAuthResponse(response)),
    );
  }

  me(): Observable<User> {
    return this.api.get<User>('/auth/me').pipe(tap((user) => this.tokenService.saveUser(user)));
  }

  completeProfile(fullName: string, email: string): Observable<User> {
    return this.api.post<User>('/auth/complete-profile', { fullName, email })
      .pipe(tap((user) => this.tokenService.saveUser(user)));
  }

  logout(): void {
    this.tokenService.clearAll();
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.tokenService.getUser();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }

  private saveAuthResponse(response: AuthOtpVerifyResponse): void {
    this.tokenService.saveAuthToken(response.token);
    this.tokenService.saveUser(response.user);
  }
}
