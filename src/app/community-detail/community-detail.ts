import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  ArrowLeft,
  Plus, Heart,
  Users,
  Layers,
  Wallet,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { CommunitiesService } from '../core/services/communities.service';
import { GroupsApiService } from '../core/services/groups.api.service';
import { Community, Group } from '../core/models/models';

@Component({
  selector: 'app-community-detail',
  standalone: true,
  imports: [LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        ArrowLeft, Heart, Plus,
        Users,
        Layers,
        Wallet,
        ChevronRight,
        MapPin,
        Calendar,
      }),
    },
  ],
  templateUrl: './community-detail.html',
  styleUrl: './community-detail.css',
})
export class CommunityDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly communitiesService = inject(CommunitiesService);
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  loading = signal(false);
  error = signal<string | null>(null);
  community = signal<Community | undefined>(undefined);
  groups = signal<Group[]>([]);

  readonly displayCommunity = computed<Community | undefined>(() => {
    const community = this.community();
    return community ? { ...community, groups: this.groups() } : undefined;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading.set(true);
    this.error.set(null);
    this.communitiesService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (community) => this.community.set(this.normalizeCommunity(community)),
        error: () => {
          this.error.set(this.language() === 'fr' ? 'Impossible de charger la communaute.' : 'Unable to load community.');
          this.loading.set(false);
        },
      });
    this.groupsApiService.getAll(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (groups) => {
          this.groups.set(groups);
          const community = this.community();
          if (community) this.community.set({ ...community, groups });
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.language() === 'fr' ? 'Impossible de charger les groupes.' : 'Unable to load groups.');
          this.loading.set(false);
        },
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

  goBack(): void {
    this.router.navigate(['/app/communities']);
  }

  openGroup(group: Group): void {
    this.router.navigate(['/app/groups', group.id]);
  }

  openCreateGroup(): void {
    const c = this.community();
    if (c) {
      this.router.navigate(['/app/groups/create'], { queryParams: { communityId: c.id } });
    }
  }

  frequencyLabel(f: string): string {
    const map: Record<string, { en: string; fr: string }> = {
      weekly: { en: 'Weekly', fr: 'Hebdomadaire' },
      biweekly: { en: 'Biweekly', fr: 'Bimensuel' },
      monthly: { en: 'Monthly', fr: 'Mensuel' },
    };
    const entry = map[f] ?? { en: f, fr: f };
    return this.language() === 'fr' ? entry.fr : entry.en;
  }

  private normalizeCommunity(community: Community): Community {
    return {
      ...community,
      memberCount: community.memberCount ?? community.groups.reduce((sum, group) => sum + group.memberCount, 0),
      location: community.location ?? community.category ?? community.name,
      imageUrl: community.imageUrl ?? '/assets/image/communities/west-region.jpg',
      nameFr: community.nameFr ?? community.name,
      descriptionFr: community.descriptionFr ?? community.description,
    };
  }
}


