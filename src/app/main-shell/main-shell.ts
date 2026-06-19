import { Component, computed, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  LayoutDashboard,
  UsersRound,
  CircleDollarSign,
  Wallet,
  Bell,
  Globe2,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { NAV_ITEMS } from '../core/config/nav-items';

@Component({
  selector: 'app-main-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        LayoutDashboard,
        UsersRound,
        CircleDollarSign,
        Wallet,
        Bell,
        Globe2,
      }),
    },
  ],
  templateUrl: './main-shell.html',
  styleUrl: './main-shell.css',
})
export class MainShell {
  private languageService = inject(LanguageService);

  navItems = NAV_ITEMS;
  language = this.languageService.language;

  navLabel = computed(() => {
    const lang = this.language();
    return (item: (typeof this.navItems)[number]) =>
      lang === 'fr' ? item.labelFr : item.labelEn;
  });

  setLanguage(lang: 'en' | 'fr'): void {
    this.languageService.setLanguage(lang);
  }
}