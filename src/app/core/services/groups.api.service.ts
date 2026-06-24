import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateGroupRequest, Group, GroupMember } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GroupsApiService {
  private readonly api = inject(ApiService);

  getAll(communityId?: string): Observable<Group[]> {
    return this.api.get<Group[]>('/groups', { communityId });
  }

  getById(id: string): Observable<Group> {
    return this.api.get<Group>(`/groups/${id}`);
  }

  getMyGroups(): Observable<Group[]> {
    return this.api.get<Group[]>('/groups/my');
  }

  create(request: CreateGroupRequest): Observable<Group> {
    return this.api.post<Group>('/groups', request);
  }

  join(groupId: string): Observable<Group> {
    return this.api.post<Group>(`/groups/${groupId}/join`, {});
  }

  getMembers(groupId: string): Observable<GroupMember[]> {
    return this.api.get<GroupMember[]>(`/groups/${groupId}/members`);
  }

  approveMember(groupId: string, memberId: string): Observable<GroupMember> {
    return this.api.post<GroupMember>(`/groups/${groupId}/members/${memberId}/approve`, {});
  }

  rejectMember(groupId: string, memberId: string): Observable<any> {
    return this.api.post<any>(`/groups/${groupId}/members/${memberId}/reject`, {});
  }

  removeMember(groupId: string, memberId: string): Observable<any> {
    return this.api.post<any>(`/groups/${groupId}/members/${memberId}/remove`, {});
  }

  leave(groupId: string): Observable<any> {
    return this.api.post<any>(`/groups/${groupId}/leave`, {});
  }
}
