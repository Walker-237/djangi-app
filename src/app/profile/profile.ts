import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BadgeCheck,
  Calendar,
  CircleDollarSign,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Pencil,
  Phone,
  Save,
  User,
  Users,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';

const LABELS = {
  fr: {
    title: 'Profil',
    subtitle: 'Informations personnelles et activite Djangi.',
    edit: 'Modifier',
    save: 'Enregistrer',
    name: 'Nom complet',
    phone: 'Telephone',
    since: 'Membre depuis',
    groups: 'Groupes rejoints',
    contributed: 'Total cotise',
    payouts: 'Versements recus',
    memberSince: 'Janvier 2024',
  },
  en: {
    title: 'Profile',
    subtitle: 'Personal information and Djangi activity.',
    edit: 'Edit',
    save: 'Save',
    name: 'Full name',
    phone: 'Phone',
    since: 'Member since',
    groups: 'Groups joined',
    contributed: 'Total contributed',
    payouts: 'Payouts received',
    memberSince: 'January 2024',
  },
} as const;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        BadgeCheck,
        Calendar,
        CircleDollarSign,
        Pencil,
        Phone,
        Save,
        User,
        Users,
      }),
    },
  ],
})
export class ProfileComponent {
  private readonly languageService = inject(LanguageService);

  language = this.languageService.language;
  labels = computed(() => LABELS[this.language()]);
  editing = signal(false);
  name = signal('Brice Kamga');
  phone = signal('+237 6 77 24 18 90');

  stats = [
    { icon: 'users', key: 'groups', value: '4' },
    { icon: 'circle-dollar-sign', key: 'contributed', value: '1 850 000 XAF' },
    { icon: 'badge-check', key: 'payouts', value: '3' },
  ] as const;

  label(key: 'groups' | 'contributed' | 'payouts'): string {
    return this.labels()[key];
  }

  toggleEditing(): void {
    this.editing.update((value) => !value);
  }
}

export { ProfileComponent as Profile };
