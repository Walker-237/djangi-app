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
  Calendar,
  User,
  Bell,
  MessageSquare,
  LogIn,
  UserPlus,
  LogOut,
  Globe,
  ArrowLeft,
} from 'lucide-angular';
import { Language, LanguageService } from '../../core/services/language.service';
import { hasStoredToken } from '../../core/services/auth-token';
import { TokenService } from '../../core/services/token.service';

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
  
  private readonly tokenService = inject(TokenService);

  userInitials = computed(() => {
    const user = this.tokenService.getUser();
    if (!user) return '?';
    if (user.initials) return user.initials;
    if (user.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user.phoneNumber) return user.phoneNumber.slice(-2);
    return '?';
  });

  // New computeds
  userName = computed(() => {
    const user = this.tokenService.getUser();
    return user?.fullName || (this.language() === 'fr' ? 'Membre' : 'Member');
  });

  userPhone = computed(() => {
    const user = this.tokenService.getUser();
    return user?.phoneNumber ?? '';
  });

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
    Calendar,
    User,           // Added
    Bell,
    MessageSquare,
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
    { path: '/app/meetings',    icon: Calendar,           labelEn: 'Meetings',    labelFr: 'Reunions' },
    { path: '/app/notifications', icon: Bell,              labelEn: 'Alerts',      labelFr: 'Alertes' },
    { path: '/app/complaints',  icon: MessageSquare,      labelEn: 'Complaints',  labelFr: 'Reclamations' },
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
    localStorage.removeItem('auth_token'); 
    localStorage.removeItem('pin_token'); 
    localStorage.removeItem('current_user');
    this.closeAll();
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.location.back();
  }

  showBackButton = computed(() => {
    const url = this.router.url;
    return /\/app\/communities\/[^/]+|\/app\/my-groups\/[^/]+|\/app\/meetings\/[^/]+|groups\/[^/]+/.test(url);
  });
}