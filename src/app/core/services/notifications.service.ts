import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppNotification } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly api = inject(ApiService);

  getAll(): Observable<AppNotification[]> {
    return this.api.get<AppNotification[]>('/notifications');
  }

  markRead(id: string): Observable<AppNotification> {
    return this.api.patch<AppNotification>(`/notifications/${id}/read`, {});
  }
}
