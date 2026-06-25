import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BadgeCheck, Calendar, CircleDollarSign, LUCIDE_ICONS,
  LucideAngularModule, LucideIconProvider, Pencil, Phone, Save, User, Users,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { AuthService } from '../core/services/auth.service';

const LABELS = {
  fr: {
    title: 'Profil', subtitle: 'Informations personnelles et activité Djangi.',
    edit: 'Modifier', save: 'Enregistrer', cancel: 'Annuler',
    name: 'Nom complet', phone: 'Téléphone', email: 'Email', since: 'Membre depuis',
    groups: 'Groupes rejoints', contributed: 'Total cotisé', payouts: 'Versements reçus',
    saving: 'Enregistrement...', saveError: 'Erreur lors de la sauvegarde.',
    namePlaceholder: 'Entrez votre nom complet', emailPlaceholder: 'Entrez votre email',
  },
  en: {
    title: 'Profile', subtitle: 'Personal information and Djangi activity.',
    edit: 'Edit', save: 'Save', cancel: 'Cancel',
    name: 'Full name', phone: 'Phone', email: 'Email', since: 'Member since',
    groups: 'Groups joined', contributed: 'Total contributed', payouts: 'Payouts received',
    saving: 'Saving...', saveError: 'Error saving profile.',
    namePlaceholder: 'Enter your full name', emailPlaceholder: 'Enter your email',
  },
} as const;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: LUCIDE_ICONS, multi: true,
    useValue: new LucideIconProvider({ BadgeCheck, Calendar, CircleDollarSign, Pencil, Phone, Save, User, Users }),
  }],
})
export class ProfileComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  labels = computed(() => LABELS[this.language()]);

  editing = signal(false);
  saving = signal(false);
  saveError = signal('');

  name = signal('');
  phone = signal('');
  email = signal('');
  memberSince = signal('');
  initials = signal('?');

  editName = signal('');
  editEmail = signal('');

  ngOnInit(): void {
    this.authService.me()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.name.set(user.fullName ?? '');
          this.phone.set(user.phoneNumber ?? '');
          this.email.set(user.email ?? '');
          this.initials.set(user.initials ?? (user.fullName?.charAt(0).toUpperCase() ?? '?'));
          this.memberSince.set(user.createdAt ? new Date(user.createdAt).toLocaleDateString(
            this.language() === 'fr' ? 'fr-FR' : 'en-GB',
            { month: 'long', year: 'numeric' }
          ) : '');
        },
      });
  }

  startEditing(): void {
    this.editName.set(this.name());
    this.editEmail.set(this.email());
    this.saveError.set('');
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.editing.set(false);
    this.saveError.set('');
  }

  saveProfile(): void {
    if (!this.editName().trim()) return;
    this.saving.set(true);
    this.saveError.set('');
    this.authService.completeProfile(this.editName().trim(), this.editEmail().trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.name.set(user.fullName ?? '');
          this.email.set(user.email ?? '');
          this.initials.set(user.initials ?? (user.fullName?.charAt(0).toUpperCase() ?? '?'));
          this.saving.set(false);
          this.editing.set(false);
        },
        error: () => {
          this.saveError.set(this.labels().saveError);
          this.saving.set(false);
        },
      });
  }
}
export { ProfileComponent as Profile };