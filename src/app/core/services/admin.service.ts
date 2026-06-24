import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdVerification, Wallet } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  getIdVerifications(): Observable<IdVerification[]> {
    return this.api.get<IdVerification[]>('/admin/id-verifications');
  }

  approveVerification(id: string, note?: string): Observable<IdVerification> {
    return this.api.post<IdVerification>(`/admin/id-verifications/${id}/approve`, { note });
  }

  rejectVerification(id: string, note?: string): Observable<IdVerification> {
    return this.api.post<IdVerification>(`/admin/id-verifications/${id}/reject`, { note });
  }

  getWallet(userId: number): Observable<Wallet> {
    return this.api.get<Wallet>('/admin/wallets', { userId });
  }

  creditWallet(userId: number, amount: number, label: string): Observable<Wallet> {
    return this.api.post<Wallet>(`/admin/wallets/${userId}/credit`, { amount, label });
  }

  debitWallet(userId: number, amount: number, label: string): Observable<Wallet> {
    return this.api.post<Wallet>(`/admin/wallets/${userId}/debit`, { amount, label });
  }
}
