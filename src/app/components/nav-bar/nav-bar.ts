import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  CircleDollarSign,
  Wallet,
  Bell,
  LogIn,
  UserPlus,
  LogOut,
  Globe,
  ArrowLeft,
} from 'lucide-angular';
import { Language, LanguageService } from '../../core/services/language.service';
import { hasStoredToken } from '../../core/services/auth-token';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavBar {
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly location = inject(Location);

  language = this.languageService.language;

  isLoggedIn = computed(() => {
    if (!isPlatformBrowser(this.platformId)) return false;
    return hasStoredToken();
  });

  showUserSheet = signal(false);
  showLangSheet = signal(false);

  readonly icons = {
    LayoutDashboard,
    Users,
    CircleDollarSign,
    Wallet,
    Bell,
    LogIn,
    UserPlus,
    LogOut,
    Globe,
    ArrowLeft,
  };

  navLinks = [
    { path: '/app/dashboard',   icon: LayoutDashboard,   labelEn: 'Home',        labelFr: 'Accueil' },
    { path: '/app/communities', icon: Users,              labelEn: 'Communities', labelFr: 'Communautés' },
    { path: '/app/my-groups',   icon: CircleDollarSign,  labelEn: 'My Groups',   labelFr: 'Mes groupes' },
    { path: '/app/wallet',      icon: Wallet,             labelEn: 'Wallet',      labelFr: 'Portefeuille' },
  ];

  label(link: (typeof this.navLinks)[number]): string {
    return this.language() === 'fr' ? link.labelFr : link.labelEn;
  }

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
    this.closeAll();
  }

  toggleUserSheet(): void {
    this.showUserSheet.update(v => !v);
    this.showLangSheet.set(false);
  }

  toggleLangSheet(): void {
    this.showLangSheet.update(v => !v);
    this.showUserSheet.set(false);
  }

  closeAll(): void {
    this.showUserSheet.set(false);
    this.showLangSheet.set(false);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.closeAll();
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.location.back();
  }

  showBackButton = computed(() => {
    const url = this.router.url;
    // Show back button on detail pages (communities/:id, groups/:id, etc.)
    return /\/app\/communities\/[^/]+|groups\/[^/]+/.test(url);
  });
}