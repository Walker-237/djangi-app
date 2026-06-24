import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, ArrowLeft, Upload } from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { CommunitiesService } from '../core/services/communities.service';
import { UploadService } from '../core/services/upload.service';

@Component({
  selector: 'app-create-community',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ 
    provide: LUCIDE_ICONS, 
    multi: true, 
    useValue: new LucideIconProvider({ ArrowLeft, Upload }) 
  }],
  templateUrl: './create-community.html',
  styleUrl: './create-community.css',
})
export class CreateCommunity {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly languageService = inject(LanguageService);
  private readonly communitiesService = inject(CommunitiesService);
  private readonly uploadService = inject(UploadService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  loading = signal(false);
  uploading = signal(false);
  error = signal<string | null>(null);

  nameEn = signal('');
  nameFr = signal('');
  descriptionEn = signal('');
  descriptionFr = signal('');
  imageUrl = signal('');
  imagePreview = signal<string | null>(null);

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploading.set(true);
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploadService.uploadFile(file, 'communities')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => { 
          this.imageUrl.set(res.url); 
          this.uploading.set(false); 
        },
        error: () => { 
          this.error.set('Image upload failed.'); 
          this.uploading.set(false); 
        },
      });
  }

  onSubmit(): void {
    if (this.loading() || this.uploading()) return;
    this.loading.set(true);
    this.error.set(null);

    this.communitiesService.create({
      name: this.nameEn(),
      nameFr: this.nameFr() || undefined,
      description: this.descriptionEn(),
      descriptionFr: this.descriptionFr() || undefined,
      imageUrl: this.imageUrl() || undefined,
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/app/communities']),
      error: () => { 
        this.error.set(this.language() === 'fr' ? 'Impossible de creer la communaute.' : 'Unable to create community.'); 
        this.loading.set(false); 
      },
    });
  }

  goBack(): void { 
    this.location.back(); 
  }
}