import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  Globe,
  ChevronDown,
  LayoutDashboard,
  Users,
  CircleDollarSign,
  Wallet,
  Bell,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  LUCIDE_ICONS,
  LucideIconProvider,
} from 'lucide-angular';
import { Language, LanguageService } from '../../core/services/language.service';
import { hasStoredToken } from '../../core/services/auth-token';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        Globe,
        ChevronDown,
        LayoutDashboard,
        Users,
        CircleDollarSign,
        Wallet,
        Bell,
        LogIn,
        UserPlus,
        LogOut,
        Menu,
        X,
      }),
    },
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Header {
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  language = this.languageService.language;
  isLoggedIn = computed(() => {
    if (!isPlatformBrowser(this.platformId)) return false;
    return hasStoredToken();
  });

  showLangDropdown = signal(false);
  showUserDropdown = signal(false);
  showMobileMenu = signal(false);

  navLinks = [
    { path: '/app/dashboard', icon: 'layout-dashboard', labelEn: 'Dashboard', labelFr: 'Tableau de bord' },
    { path: '/app/communities', icon: 'users', labelEn: 'Communities', labelFr: 'Communautés' },
    { path: '/app/my-groups', icon: 'circle-dollar-sign', labelEn: 'My Groups', labelFr: 'Mes groupes' },
    { path: '/app/wallet', icon: 'wallet', labelEn: 'Wallet', labelFr: 'Portefeuille' },
  ];

  label(link: (typeof this.navLinks)[number]): string {
    return this.language() === 'fr' ? link.labelFr : link.labelEn;
  }

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
    this.showLangDropdown.set(false);
  }

  toggleLangDropdown(): void {
    this.showLangDropdown.update(v => !v);
    this.showUserDropdown.set(false);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(v => !v);
    this.showLangDropdown.set(false);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.showUserDropdown.set(false);
    this.showMobileMenu.set(false);
    this.router.navigate(['/auth/login']);
  }

  closeAll(): void {
    this.showLangDropdown.set(false);
    this.showUserDropdown.set(false);
  }
}
