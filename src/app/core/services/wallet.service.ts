import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Wallet, WalletTransaction } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly api = inject(ApiService);

  getWallet(): Observable<Wallet> {
    return this.api.get<Wallet>('/wallet');
  }

  getHistory(page?: number, size?: number): Observable<WalletTransaction[]> {
    return this.api.get<WalletTransaction[]>('/wallet/history', { page, size });
  }

  deposit(amount: number, method: 'mobile_money' | 'bank', label?: string): Observable<Wallet> {
    return this.api.post<Wallet>('/wallet/deposit', { amount, method, label });
  }

  withdraw(amount: number, method: 'mobile_money' | 'bank', label?: string): Observable<Wallet> {
    return this.api.post<Wallet>('/wallet/withdraw', { amount, method, label });
  }

  transfer(recipientPhone: string, amount: number, label?: string): Observable<Wallet> {
    return this.api.post<Wallet>('/wallet/transfer', { recipientPhone, amount, label });
  }
}
