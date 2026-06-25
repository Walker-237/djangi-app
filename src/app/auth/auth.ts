import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  ArrowRight,
  BadgeCheck,
  Eye,
  Globe,
  LockKeyhole,
  Mail,
  Phone,
} from 'lucide-angular';
import { Header } from '../components/header/header';
import { LanguageService } from '../core/services/language.service';
import { AuthService } from '../core/services/auth.service';

type Mode = 'login' | 'register';
type Language = 'en' | 'fr';
type FieldIcon = 'mail' | 'lock-keyhole' | 'phone' | 'badge-check';
type AuthStep = 'phone' | 'otp' | 'pinSetup' | 'pinVerify';

interface FieldCopy {
  label: string;
  type: string;
  icon: FieldIcon;
  autocomplete: string;
  placeholder: string;
}

interface PageCopy {
  tab: string;
  kicker: string;
  title: string;
  subtitle: string;
  fields: FieldCopy[];
  primary: string;
  phoneAction: string;
  side: string;
  switchPath: string;
  switchText: string;
  illustration: string;
}

interface AuthCopy {
  authLabel: string;
  languageLabel: string;
  mobileHeroAlt: string;
  desktopHeroAlt: string;
  headline: string;
  subtitle: string;
  tabsLabel: string;
  showPassword: string;
  forgot: string;
  consent: string;
  promise: string;
  promiseSteps: string[];
  login: PageCopy;
  register: PageCopy;
}

const COPY: Record<Language, AuthCopy> = {
  en: {
    authLabel: 'Authentication',
    languageLabel: 'Choose language',
    mobileHeroAlt: 'Secure mobile login illustration',
    desktopHeroAlt: 'Secure account access illustration',
    headline: 'Manage your savings circles with confidence.',
    subtitle:
      'Join trusted groups, follow contributions, and keep every payout clear from one secure account.',
    tabsLabel: 'Switch between login and register',
    showPassword: 'Show password',
    forgot: 'Forgot password?',
    consent: 'I agree to the terms and privacy policy.',
    promise: 'Connect. Contribute. Grow together.',
    promiseSteps: ['Connect', 'Contribute', 'Grow together'],
    login: {
      tab: 'Login',
      kicker: 'Welcome back',
      title: 'Login',
      subtitle: 'Enter your details to continue to Nkap Link.',
      fields: [
        {
          label: 'Email',
          type: 'email',
          icon: 'mail',
          autocomplete: 'email',
          placeholder: 'Enter your email address',
        },
        {
          label: 'Password',
          type: 'password',
          icon: 'lock-keyhole',
          autocomplete: 'current-password',
          placeholder: 'Enter password',
        },
      ],
      primary: 'Login',
      phoneAction: 'Continue with phone',
      side: 'New to Nkap Link?',
      switchPath: '/auth/register',
      switchText: 'Create account',
      illustration: '/assets/image/Mobile login-cuate.svg',
    },
    register: {
      tab: 'Register',
      kicker: 'Create account',
      title: 'Register',
      subtitle: 'Set up your account and start saving together.',
      fields: [
        {
          label: 'Full name',
          type: 'text',
          icon: 'badge-check',
          autocomplete: 'name',
          placeholder: 'Full name',
        },
        {
          label: 'Phone number',
          type: 'tel',
          icon: 'phone',
          autocomplete: 'tel',
          placeholder: '+237 6XX XXX XXX',
        },
        {
          label: 'Email',
          type: 'email',
          icon: 'mail',
          autocomplete: 'email',
          placeholder: 'Enter your email address',
        },
        {
          label: 'Password',
          type: 'password',
          icon: 'lock-keyhole',
          autocomplete: 'new-password',
          placeholder: 'Create password',
        },
        {
          label: 'Confirm Password',
          type: 'password',
          icon: 'lock-keyhole',
          autocomplete: 'new-password',
          placeholder: 'Confirm password',
        },
      ],
      primary: 'Create account',
      phoneAction: 'Continue with phone',
      side: 'Already have an account?',
      switchPath: '/auth/login',
      switchText: 'Login',
      illustration: '/assets/image/Mobile login-pana.svg',
    },
  },
  fr: {
    authLabel: 'Authentification',
    languageLabel: 'Choisir la langue',
    mobileHeroAlt: 'Illustration de connexion mobile securisee',
    desktopHeroAlt: 'Illustration d acces securise au compte',
    headline: 'Gerez vos tontines avec confiance.',
    subtitle:
      'Rejoignez des groupes fiables, suivez les cotisations et gardez chaque paiement clair depuis un compte securise.',
    tabsLabel: 'Basculer entre connexion et inscription',
    showPassword: 'Afficher le mot de passe',
    forgot: 'Mot de passe oublie ?',
    consent: 'J accepte les conditions et la politique de confidentialite.',
    promise: 'Connectez. Cotisez. Grandissez ensemble.',
    promiseSteps: ['Connectez', 'Cotisez', 'Grandissez ensemble'],
    login: {
      tab: 'Connexion',
      kicker: 'Bon retour',
      title: 'Connexion',
      subtitle: 'Entrez vos informations pour continuer vers Nkap Link.',
      fields: [
        {
          label: 'Email',
          type: 'email',
          icon: 'mail',
          autocomplete: 'email',
          placeholder: 'Entrez votre adresse e-mail',
        },
        {
          label: 'Mot de passe',
          type: 'password',
          icon: 'lock-keyhole',
          autocomplete: 'current-password',
          placeholder: 'Mot de passe',
        },
      ],
      primary: 'Se connecter',
      phoneAction: 'Continuer avec le telephone',
      side: 'Nouveau sur Nkap Link ?',
      switchPath: '/auth/register',
      switchText: 'Creer un compte',
      illustration: '/assets/image/Mobile login-cuate.svg',
    },
    register: {
      tab: 'Inscription',
      kicker: 'Creer un compte',
      title: 'Inscription',
      subtitle: 'Configurez votre compte et commencez a epargner ensemble.',
      fields: [
        {
          label: 'Nom complet',
          type: 'text',
          icon: 'badge-check',
          autocomplete: 'name',
          placeholder: 'Nom complet',
        },
        {
          label: 'Telephone',
          type: 'tel',
          icon: 'phone',
          autocomplete: 'tel',
          placeholder: '+237 6XX XXX XXX',
        },
        {
          label: 'Email',
          type: 'email',
          icon: 'mail',
          autocomplete: 'email',
          placeholder: 'Entrez votre adresse e-mail',
        },
        {
          label: 'Mot de passe',
          type: 'password',
          icon: 'lock-keyhole',
          autocomplete: 'new-password',
          placeholder: 'Creer un mot de passe',
        },
        {
          label: 'Confirmer le mot de passe',
          type: 'password',
          icon: 'lock-keyhole',
          autocomplete: 'new-password',
          placeholder: 'Confirmer le mot de passe',
        },
      ],
      primary: 'Creer mon compte',
      phoneAction: 'Continuer avec le telephone',
      side: 'Vous avez deja un compte ?',
      switchPath: '/auth/login',
      switchText: 'Se connecter',
      illustration: '/assets/image/Mobile login-pana.svg',
    },
  },
};

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Header, FormsModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        ArrowRight,
        BadgeCheck,
        Eye,
        Globe,
        LockKeyhole,
        Mail,
        Phone,
      }),
    },
  ],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Auth {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  mode = signal<Mode>(this.router.url.includes('/register') ? 'register' : 'login');
  language = this.languageService.language;

  copy = computed<AuthCopy>(() => COPY[this.language()]);
  page = computed<PageCopy>(() => this.copy()[this.mode()]);
  authStep = signal<AuthStep>('phone');
  phoneNumber = signal('');
  otp = signal('');
  pin = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.authStep.set('phone');
    this.error.set(null);
  }

  onFieldInput(field: FieldCopy, value: string): void {
    const label = field.label.toLowerCase();
    if (field.type === 'tel' || label.includes('phone') || label.includes('telephone') || label.includes('email')) {
      this.phoneNumber.set(value);
    }
    if (field.type === 'password') {
      this.pin.set(value);
    }
    this.error.set(null);
  }

  fieldValue(field: FieldCopy): string {
    const label = field.label.toLowerCase();
    if (field.type === 'tel' || label.includes('phone') || label.includes('telephone') || label.includes('email')) return this.phoneNumber();
    if (field.type === 'password') return this.pin();
    return '';
  }

  handleSubmit(): void {
    if (this.loading()) return;
    this.error.set(null);
    let phoneNumber = this.phoneNumber().trim();
    if (phoneNumber && !phoneNumber.startsWith('+')) {
      phoneNumber = '+237' + phoneNumber;
    }
    if (!phoneNumber) {
      this.error.set(this.language() === 'fr' ? 'Veuillez entrer votre numero de telephone.' : 'Please enter your phone number.');
      return;
    }

    if (this.authStep() === 'phone') {
      this.loading.set(true);
      if (this.mode() === 'login') {
        // Login: skip OTP, go straight to PIN
        this.loading.set(false);
        this.authStep.set('pinVerify');
        return;
      }
      // Register: send OTP first
      this.authService.requestOtp(phoneNumber)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => { this.authStep.set('otp'); this.loading.set(false); },
          error: () => this.setError(this.language() === 'fr' ? 'Impossible d envoyer le code OTP.' : 'Unable to send OTP.'),
        });
      return;
    }

    if (this.authStep() === 'otp') {
      if (!this.otp().trim()) {
        this.error.set(this.language() === 'fr' ? 'Veuillez entrer le code OTP.' : 'Please enter the OTP code.');
        return;
      }
      this.loading.set(true);
      this.authService.verifyOtp(phoneNumber, this.otp().trim())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
          this.loading.set(false);
          if (response.isNewUser || !response.user.pinSet) {
            this.authStep.set('pinSetup');
            return;
          }
          const dest = response.user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard';
          this.router.navigate([dest]);
        },
          error: () => this.setError(this.language() === 'fr' ? 'Code OTP invalide.' : 'Invalid OTP code.'),
        });
      return;
    }

    if (this.authStep() === 'pinSetup') {
      if (this.pin().trim().length < 4) {
        this.error.set(this.language() === 'fr' ? 'Veuillez definir un PIN valide.' : 'Please set a valid PIN.');
        return;
      }
      this.loading.set(true);
      this.authService.setPin(this.pin().trim())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            const user = this.authService.getCurrentUser();
            const dest = user?.role === 'admin' ? '/admin/dashboard' : '/app/dashboard';
            this.router.navigate([dest]);
          },
          error: () => this.setError(this.language() === 'fr' ? 'Impossible de definir le PIN.' : 'Unable to set PIN.'),
        });
      return;
    }

    if (this.authStep() === 'pinVerify') {
      if (!this.pin().trim()) {
        this.error.set(this.language() === 'fr' ? 'Veuillez entrer votre PIN.' : 'Please enter your PIN.');
        return;
      }
      this.loading.set(true);
      this.authService.pinLogin(phoneNumber, this.pin().trim())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            const user = this.authService.getCurrentUser();
            const dest = user?.role === 'admin' ? '/admin/dashboard' : '/app/dashboard';
            this.router.navigate([dest]);
          },
          error: () => this.setError(this.language() === 'fr' ? 'Numero ou PIN invalide.' : 'Invalid phone or PIN.'),
        });
    }
  }

  private setError(message: string): void {
    this.error.set(message);
    this.loading.set(false);
  }
}