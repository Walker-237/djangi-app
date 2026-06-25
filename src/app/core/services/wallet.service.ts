import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Wallet, WalletTransaction } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly api = inject(ApiService);

  getWallet(): Observable<Wallet> {
    return this.api.get<Wallet>('/wallet');
  }

  getHistory(page?: number, size?: number): Observable<WalletTransaction[]> {
    return this.api.get<any>('/wallet/history', { page, size }).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.content ?? []))
    );
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

  contribute(groupId: string, amount: number): Observable<Wallet> {
    return this.api.post<Wallet>('/wallet/contribute', { groupId, amount });
  }

  payContribution(groupId: string, contributionId: string): Observable<any> {
    return this.api.post<any>(`/groups/${groupId}/contributions/${contributionId}/pay`, {});
  }

  processPayout(groupId: string, payoutId: string): Observable<any> {
    return this.api.post<any>(`/groups/${groupId}/payouts/${payoutId}/process`, {});
  }
}
