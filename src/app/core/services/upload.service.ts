import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly api = inject(ApiService);

  uploadFile(file: File, folder?: string): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return this.api.post<{ url: string }>('/upload', formData);
  }

  submitIdVerification(documentType: string, frontFileName: string, backFileName?: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/users/id-verification/upload', {
      documentType,
      frontFileName,
      backFileName,
    });
  }
}
