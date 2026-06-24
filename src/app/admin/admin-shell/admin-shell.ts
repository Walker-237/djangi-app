import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  CircleDollarSign,
  FileText,
  Globe,
  LayoutDashboard,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-angular';
import { LanguageService } from '../../core/services/language.service';

const LABELS = {
  fr: {
    title: 'Administration',
    role: 'Plateforme',
    nav: {
      dashboard: 'Dashboard',
      users: 'Utilisateurs',
      communities: 'Communautes',
      groups: 'Groupes',
      complaints: 'Reclamations',
      reports: 'Rapports',
      settings: 'Parametres',
    },
  },
  en: {
    title: 'Administration',
    role: 'Platform',
    nav: {
      dashboard: 'Dashboard',
      users: 'Users',
      communities: 'Communities',
      groups: 'Groups',
      complaints: 'Complaints',
      reports: 'Reports',
      settings: 'Settings',
    },
  },
} as const;

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        CircleDollarSign,
        FileText,
        Globe,
        LayoutDashboard,
        MessageSquare,
        Settings,
        Users,
      }),
    },
  ],
})
export class AdminShellComponent {
  private readonly languageService = inject(LanguageService);

  language = this.languageService.language;
  labels = computed(() => LABELS[this.language()]);

  navItems = [
    { path: '/admin/dashboard', icon: 'layout-dashboard', key: 'dashboard' },
    { path: '/admin/users', icon: 'users', key: 'users' },
    { path: '/admin/communities', icon: 'globe', key: 'communities' },
    { path: '/admin/groups', icon: 'circle-dollar-sign', key: 'groups' },
    { path: '/admin/complaints', icon: 'message-square', key: 'complaints' },
    { path: '/admin/reports', icon: 'file-text', key: 'reports' },
    { path: '/admin/settings', icon: 'settings', key: 'settings' },
  ] as const;

  navLabel(key: keyof typeof LABELS.en.nav): string {
    return this.labels().nav[key];
  }
}

export { AdminShellComponent as AdminShell };
