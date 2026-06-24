import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  LUCIDE_ICONS,
  LockKeyhole,
  LucideAngularModule,
  LucideIconProvider,
  Mail,
  Phone,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';

const LABELS = {
  fr: {
    kicker: 'Creer un compte',
    title: 'Inscription',
    subtitle: 'Configurez votre compte et commencez a epargner ensemble.',
    name: 'Nom complet',
    namePlaceholder: 'Brice Kamga',
    phone: 'Telephone',
    phonePlaceholder: '+237 6XX XXX XXX',
    email: 'Email',
    emailPlaceholder: 'votre@email.com',
    password: 'Mot de passe',
    passwordPlaceholder: 'Creer un mot de passe',
    confirm: 'Confirmer le mot de passe',
    confirmPlaceholder: 'Confirmer le mot de passe',
    showPassword: 'Afficher le mot de passe',
    consent: 'J accepte les conditions et la politique de confidentialite.',
    submit: 'Creer mon compte',
    switchText: 'Vous avez deja un compte ?',
    switchLink: 'Se connecter',
  },
  en: {
    kicker: 'Create account',
    title: 'Register',
    subtitle: 'Set up your account and start saving together.',
    name: 'Full name',
    namePlaceholder: 'Brice Kamga',
    phone: 'Phone',
    phonePlaceholder: '+237 6XX XXX XXX',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    password: 'Password',
    passwordPlaceholder: 'Create a password',
    confirm: 'Confirm password',
    confirmPlaceholder: 'Confirm password',
    showPassword: 'Show password',
    consent: 'I agree to the terms and privacy policy.',
    submit: 'Create account',
    switchText: 'Already have an account?',
    switchLink: 'Login',
  },
} as const;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        ArrowRight,
        BadgeCheck,
        Eye,
        LockKeyhole,
        Mail,
        Phone,
      }),
    },
  ],
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly languageService = inject(LanguageService);

  language = this.languageService.language;
  labels = computed(() => LABELS[this.language()]);
  showPassword = signal(false);

  register(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'token',
        JSON.stringify({ accessToken: 'mock-token-' + Date.now(), tokenType: 'Bearer' }),
      );
    }
    this.router.navigate(['/app/dashboard']);
  }
}

export { RegisterComponent as Register };
