import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LUCIDE_ICONS,
  LucideAngularModule,
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
import { CommunitiesService } from '../core/services/communities.service';
import { GroupsApiService } from '../core/services/groups.api.service';
import { Community, Group } from '../core/models/models';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
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
  private readonly communitiesService = inject(CommunitiesService);
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly router = inject(Router);

  language = this.languageService.language;
  searchQuery = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  readonly communities = signal<Community[]>([]);
  readonly myGroups = signal<Group[]>([]);

  filteredCommunities = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.communities();
    return this.communities().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.nameFr ?? '').toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this.loadCommunities();
    this.loadMyGroups();
  }

  loadCommunities(): void {
    this.loading.set(true);
    this.error.set(null);
    this.communitiesService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (communities) => {
          this.communities.set(communities.map((community) => this.normalizeCommunity(community)));
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.language() === 'fr' ? 'Impossible de charger les communautes.' : 'Unable to load communities.');
          this.loading.set(false);
        },
      });
  }

  loadMyGroups(): void {
    this.groupsApiService.getMyGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (groups) => this.myGroups.set(groups),
        error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger vos groupes.' : 'Unable to load your groups.'),
      });
  }

  communityName(c: Community): string {
    return this.language() === 'fr' ? (c.nameFr ?? c.name) : c.name;
  }

  communityDescription(c: Community): string {
    return this.language() === 'fr' ? (c.descriptionFr ?? c.description) : c.description;
  }

  formatAmount(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  myPosition(group: Group): number {
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

  private normalizeCommunity(community: Community): Community {
    const memberCount = community.memberCount ?? community.groups.reduce((sum, group) => sum + group.memberCount, 0);
    return {
      ...community,
      memberCount,
      location: community.location ?? community.category ?? community.name,
      imageUrl: community.imageUrl ?? '/assets/image/communities/west-region.jpg',
      nameFr: community.nameFr ?? community.name,
      descriptionFr: community.descriptionFr ?? community.description,
    };
  }
}
