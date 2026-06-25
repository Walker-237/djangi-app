import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import {
  Bell,
  Calendar,
  CircleDollarSign,
  Globe2,
  LayoutDashboard,
  LogOut,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MessageSquare,
  User,
  Users,
  Wallet,
} from 'lucide-angular';
import { NavBar } from '../components/nav-bar/nav-bar';
import { Language, LanguageService } from '../core/services/language.service';
import { NAV_ITEMS } from '../core/config/nav-items';
import { TokenService } from '../core/services/token.service';

const LABELS = {
  fr: {
    logout: 'Deconnexion',
    userName: 'Brice Kamga',
    userRole: 'Membre Djangi',
    notifications: 'Notifications',
    pages: {
      dashboard: 'Accueil',
      communities: 'Communautes',
      'my-groups': 'Mes groupes',
      wallet: 'Portefeuille',
      meetings: 'Reunions',
      notifications: 'Notifications',
      complaints: 'Reclamations',
      profile: 'Profil',
    },
  },
  en: {
    logout: 'Logout',
    userName: 'Brice Kamga',
    userRole: 'Djangi member',
    notifications: 'Notifications',
    pages: {
      dashboard: 'Home',
      communities: 'Communities',
      'my-groups': 'My Groups',
      wallet: 'Wallet',
      meetings: 'Meetings',
      notifications: 'Notifications',
      complaints: 'Complaints',
      profile: 'Profile',
    },
  },
} as const;

@Component({
  selector: 'app-main-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, NavBar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Bell,
        Calendar,
        CircleDollarSign,
        Globe2,
        LayoutDashboard,
        LogOut,
        MessageSquare,
        User,
        Users,
        Wallet,
      }),
    },
  ],
  templateUrl: './main-shell.html',
  styleUrl: './main-shell.css',
})
export class MainShell {
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  navItems = NAV_ITEMS;
  language = this.languageService.language;
  private readonly tokenService = inject(TokenService);
  
  userInitials = computed(() => {
      const user = this.tokenService.getUser();
      if (!user) return '?';
      if (user.initials) return user.initials;
      if (user.fullName) return user.fullName.charAt(0).toUpperCase();
      if (user.phoneNumber) return user.phoneNumber.slice(-2);
      return '?';
  });

  userName = computed(() => {
    const user = this.tokenService.getUser();
    return user?.fullName || user?.phoneNumber || (this.language() === 'fr' ? 'Membre' : 'Member');
  });

  userRole = computed(() => {
    const user = this.tokenService.getUser();
    return user?.role === 'admin' ? 'Admin' : (this.language() === 'fr' ? 'Membre Djangi' : 'Djangi Member');
  });
    
  unreadNotifCount = signal(3);
  currentUrl = signal(this.router.url);
  labels = computed(() => LABELS[this.language()]);

  pageTitle = computed(() => {
    const segment = this.currentUrl().split('?')[0].split('/')[2] as keyof typeof LABELS.en.pages | undefined;
    if (!segment) return this.labels().pages.dashboard;
    return this.labels().pages[segment] ?? this.labels().pages.dashboard;
  });

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  navLabel = computed(() => {
    const lang = this.language();
    return (item: (typeof this.navItems)[number]) =>
      lang === 'fr' ? item.labelFr : item.labelEn;
  });

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('pin_token');
    localStorage.removeItem('current_user');
    this.router.navigate(['/auth/login']);
  }
}

export { MainShell as MainShellComponent };