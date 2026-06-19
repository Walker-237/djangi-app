import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  ArrowLeft,
  Users,
  Layers,
  ChevronRight,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { GroupsService } from '../core/services/groups.service';
import { Community } from '../core/models/models';

@Component({
  selector: 'app-all-communities',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        ArrowLeft,
        Users,
        Layers,
        ChevronRight,
      }),
    },
  ],
  templateUrl: './all-communities.html',
  styleUrl: './all-communities.css',
})
export class AllCommunities {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly languageService = inject(LanguageService);
  private readonly groupsService = inject(GroupsService);

  language = this.languageService.language;
  searchQuery = signal('');

  readonly communities = this.groupsService.communities;

  filteredCommunities = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.communities();
    return this.communities().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameFr.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  });

  communityName(c: Community): string {
    return this.language() === 'fr' ? c.nameFr : c.name;
  }

  openCommunity(c: Community): void {
    this.router.navigate(['/app/communities', c.id]);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  goBack(): void {
    this.location.back();
  }
}
