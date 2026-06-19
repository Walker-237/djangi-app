import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'fr';

const STORAGE_KEY = 'nkap_language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly stored = (typeof localStorage !== 'undefined'
    ? (localStorage.getItem(STORAGE_KEY) as Language | null)
    : null);

  language = signal<Language>(this.stored ?? 'en');

  setLanguage(lang: Language): void {
    this.language.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  toggle(): void {
    this.setLanguage(this.language() === 'en' ? 'fr' : 'en');
  }
}