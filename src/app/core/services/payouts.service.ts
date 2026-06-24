import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Payout } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PayoutsService {
  private readonly api = inject(ApiService);

  getByGroup(groupId: string): Observable<Payout[]> {
    return this.api.get<Payout[]>(`/groups/${groupId}/payouts`);
  }

  create(groupId: string, memberId: number, amount: number, payoutDate: string): Observable<Payout> {
    return this.api.post<Payout>(`/groups/${groupId}/payouts`, { memberId, amount, payoutDate });
  }

  process(groupId: string, payoutId: string): Observable<Payout> {
    return this.api.post<Payout>(`/groups/${groupId}/payouts/${payoutId}/process`, {});
  }
}
