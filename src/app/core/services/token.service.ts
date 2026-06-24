import { Injectable } from '@angular/core';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TokenService {
  saveAuthToken(token: string): void {
    this.storage()?.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return this.storage()?.getItem('auth_token') ?? null;
  }

  savePinToken(token: string): void {
    this.storage()?.setItem('pin_token', token);
  }

  getPinToken(): string | null {
    return this.storage()?.getItem('pin_token') ?? null;
  }

  saveUser(user: User): void {
    this.storage()?.setItem('current_user', JSON.stringify(user));
  }

  getUser(): User | null {
    const raw = this.storage()?.getItem('current_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  clearAll(): void {
    const storage = this.storage();
    storage?.removeItem('auth_token');
    storage?.removeItem('pin_token');
    storage?.removeItem('current_user');
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 > Date.now();
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(normalized)
          .split('')
          .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join(''),
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private storage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }
}
