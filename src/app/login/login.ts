import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowRight,
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
    kicker: 'Bon retour',
    title: 'Connexion',
    subtitle: 'Entrez vos informations pour continuer vers Djangi.',
    email: 'Email',
    emailPlaceholder: 'votre@email.com',
    password: 'Mot de passe',
    passwordPlaceholder: 'Votre mot de passe',
    showPassword: 'Afficher le mot de passe',
    forgot: 'Mot de passe oublie ?',
    submit: 'Se connecter',
    phone: 'Continuer avec le telephone',
    switchText: 'Nouveau sur Djangi ?',
    switchLink: 'Creer un compte',
  },
  en: {
    kicker: 'Welcome back',
    title: 'Login',
    subtitle: 'Enter your details to continue to Djangi.',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    showPassword: 'Show password',
    forgot: 'Forgot password?',
    submit: 'Login',
    phone: 'Continue with phone',
    switchText: 'New to Djangi?',
    switchLink: 'Create account',
  },
} as const;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        ArrowRight,
        Eye,
        LockKeyhole,
        Mail,
        Phone,
      }),
    },
  ],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly languageService = inject(LanguageService);

  language = this.languageService.language;
  labels = computed(() => LABELS[this.language()]);
  showPassword = signal(false);

  login(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'token',
        JSON.stringify({ accessToken: 'mock-token-' + Date.now(), tokenType: 'Bearer' }),
      );
    }
    this.router.navigate(['/app/dashboard']);
  }
}

export { LoginComponent as Login };
