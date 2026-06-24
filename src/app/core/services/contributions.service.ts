import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contribution } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ContributionsService {
  private readonly api = inject(ApiService);

  getByGroup(groupId: string): Observable<Contribution[]> {
    return this.api.get<Contribution[]>(`/groups/${groupId}/contributions`);
  }

  create(groupId: string, memberId: number, amount: number, dueDate: string): Observable<Contribution> {
    return this.api.post<Contribution>(`/groups/${groupId}/contributions`, { memberId, amount, dueDate });
  }

  pay(groupId: string, contributionId: string): Observable<Contribution> {
    return this.api.post<Contribution>(`/groups/${groupId}/contributions/${contributionId}/pay`, {});
  }
}
