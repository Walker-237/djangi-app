import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Complaint } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ComplaintsService {
  private readonly api = inject(ApiService);

  getAll(groupId?: string): Observable<Complaint[]> {
    return this.api.get<Complaint[]>('/complaints', { groupId });
  }

  create(subject: string, description: string, category?: string, groupId?: string): Observable<Complaint> {
    return this.api.post<Complaint>('/complaints', { subject, description, category, groupId });
  }

  updateStatus(id: string, status: string, resolutionNote?: string): Observable<Complaint> {
    return this.api.patch<Complaint>(`/complaints/${id}/status`, { status, resolutionNote });
  }
}
