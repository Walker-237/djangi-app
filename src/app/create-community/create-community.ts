import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  ArrowLeft,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-create-community',
  standalone: true,
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        ArrowLeft,
      }),
    },
  ],
  templateUrl: './create-community.html',
  styleUrl: './create-community.css',
})
export class CreateCommunity {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly languageService = inject(LanguageService);

  language = this.languageService.language;

  nameEn = signal('');
  nameFr = signal('');
  descriptionEn = signal('');
  descriptionFr = signal('');
  locationValue = signal('');
  imageUrl = signal('');

  onSubmit(): void {
    const formData = {
      name: this.nameEn(),
      nameFr: this.nameFr(),
      description: this.descriptionEn(),
      descriptionFr: this.descriptionFr(),
      location: this.locationValue(),
      imageUrl: this.imageUrl(),
    };
    console.log('Create community:', formData);
    this.router.navigate(['/app/communities']);
  }

  goBack(): void {
    this.location.back();
  }
}
