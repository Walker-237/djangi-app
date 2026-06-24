import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Meeting } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MeetingsService {
  private readonly api = inject(ApiService);

  getByGroup(groupId: string): Observable<Meeting[]> {
    return this.api.get<Meeting[]>(`/groups/${groupId}/meetings`);
  }

  getById(groupId: string, meetingId: string): Observable<Meeting> {
    return this.api.get<Meeting>(`/groups/${groupId}/meetings/${meetingId}`);
  }

  create(groupId: string, title: string, meetingDate: string, durationMinutes?: number): Observable<Meeting> {
    return this.api.post<Meeting>(`/groups/${groupId}/meetings`, { title, meetingDate, durationMinutes });
  }

  complete(groupId: string, meetingId: string, notes?: string): Observable<Meeting> {
    return this.api.patch<Meeting>(`/groups/${groupId}/meetings/${meetingId}/complete`, { notes });
  }
}
