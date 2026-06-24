import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Community, CreateCommunityRequest, Group } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CommunitiesService {
  private readonly api = inject(ApiService);

  getAll(search?: string): Observable<Community[]> {
    return this.api.get<Community[]>('/communities', { search });
  }

  getById(id: string): Observable<Community> {
    return this.api.get<Community>(`/communities/${id}`);
  }

  create(request: CreateCommunityRequest): Observable<Community> {
    return this.api.post<Community>('/communities', request);
  }

  getGroups(communityId: string): Observable<Group[]> {
    return this.api.get<Group[]>('/groups', { communityId });
  }
}
