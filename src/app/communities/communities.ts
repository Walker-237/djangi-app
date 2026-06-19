import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  Search,
  Users,
  Layers,
  Wallet,
  ChevronRight,
  Plus,
  MapPin,
  ArrowRight,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { GroupsService } from '../core/services/groups.service';
import { Community, Group } from '../core/models/models';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        Search,
        Users,
        Layers,
        Wallet,
        ChevronRight,
        Plus,
        MapPin,
        ArrowRight,
      }),
    },
  ],
  templateUrl: './communities.html',
  styleUrl: './communities.css',
})
export class Communities {
  private readonly languageService = inject(LanguageService);
  private readonly groupsService = inject(GroupsService);
  readonly router = inject(Router);

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

  /**
   * "My groups" = first 2 groups across all communities.
   * TODO: replace with real membership filter once auth/membership is wired.
   */
  readonly myGroups = computed<Group[]>(() => {
    const groups: Group[] = [];
    for (const community of this.communities()) {
      groups.push(...community.groups);
      if (groups.length >= 2) break;
    }
    return groups.slice(0, 2);
  });

  communityName(c: Community): string {
    return this.language() === 'fr' ? c.nameFr : c.name;
  }

  communityDescription(c: Community): string {
    return this.language() === 'fr' ? c.descriptionFr : c.description;
  }

  formatAmount(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  myPosition(group: Group): number {
    // TODO: replace with logged-in user's actual position
    return group.members[0]?.position ?? 1;
  }

  openCommunity(c: Community): void {
    this.router.navigate(['/app/communities', c.id]);
  }

  openGroup(group: Group): void {
    this.router.navigate(['/app/groups', group.id]);
  }

  openCreateCommunity(): void {
    this.router.navigate(['/app/communities/create']);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }
}