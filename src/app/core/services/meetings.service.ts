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

  create(
    groupId: string, 
    title: string, 
    meetingDate: string, 
    durationMinutes?: number,
    mode?: string,
    meetingLink?: string
  ): Observable<Meeting> {
    return this.api.post<Meeting>(`/groups/${groupId}/meetings`, { 
      title, 
      meetingDate, 
      durationMinutes, 
      mode, 
      meetingLink 
    });
  }

  summarizeAudio(groupId: string, meetingId: string, audio: File, language: string = 'fr'): Observable<Meeting> {
    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('language', language);
    return this.api.postFormData<Meeting>(`/groups/${groupId}/meetings/${meetingId}/summarize-audio`, formData);
  }

  complete(groupId: string, meetingId: string, notes?: string): Observable<Meeting> {
    return this.api.patch<Meeting>(`/groups/${groupId}/meetings/${meetingId}/complete`, { notes });
  }

  saveSummary(groupId: string, meetingId: string, summary: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/groups/${groupId}/meetings/${meetingId}/summarize`, { summary });
  }
}