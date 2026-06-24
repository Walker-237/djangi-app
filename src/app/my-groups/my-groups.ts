import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LucideAngularModule,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  LUCIDE_ICONS,
  LucideIconProvider,
  Search,
  Users,
  Wallet,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { GroupsApiService } from '../core/services/groups.api.service';
import { CommunitiesService } from '../core/services/communities.service';
import { Community, Group, GroupFrequency } from '../core/models/models';

type FrequencyFilter = 'all' | GroupFrequency;

@Component({
  selector: 'app-my-groups',
  imports: [RouterLink, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        ArrowRight,
        CalendarClock,
        CheckCircle2,
        CircleDollarSign,
        Search,
        Users,
        Wallet,
      }),
    },
  ],
  templateUrl: './my-groups.html',
  styleUrl: './my-groups.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyGroups {
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly communitiesService = inject(CommunitiesService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  groups = signal<Group[]>([]);
  communities = signal<Community[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  searchQuery = signal('');
  frequencyFilter = signal<FrequencyFilter>('all');

  filters: FrequencyFilter[] = ['all', 'weekly', 'biweekly', 'monthly'];

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.groupsApiService.getMyGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (groups) => {
          this.groups.set(groups);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.language() === 'fr' ? 'Impossible de charger vos groupes.' : 'Unable to load your groups.');
          this.loading.set(false);
        },
      });
    this.communitiesService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (communities) => this.communities.set(communities),
        error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger les communautes.' : 'Unable to load communities.'),
      });
  }

  filteredGroups = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const frequency = this.frequencyFilter();

    return this.groups().filter((group) => {
      const community = this.communityForGroup(group);
      const matchesFrequency = frequency === 'all' || group.frequency === frequency;
      const matchesSearch =
        !q ||
        group.name.toLowerCase().includes(q) ||
        group.description.toLowerCase().includes(q) ||
        community?.name.toLowerCase().includes(q) ||
        (community?.nameFr ?? '').toLowerCase().includes(q);

      return matchesFrequency && matchesSearch;
    });
  });

  totalPot = computed(() => this.groups().reduce((sum, group) => sum + group.totalPot, 0));
  totalMembers = computed(() => this.groups().reduce((sum, group) => sum + group.memberCount, 0));

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  setFrequencyFilter(value: FrequencyFilter): void {
    this.frequencyFilter.set(value);
  }

  communityForGroup(group: Group) {
    return this.communities().find((community) => community.groups.some((item) => item.id === group.id));
  }

  communityName(group: Group): string {
    const community = this.communityForGroup(group);
    if (!community) return this.language() === 'fr' ? 'Communaute' : 'Community';
    return this.language() === 'fr' ? (community.nameFr ?? community.name) : community.name;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR');
  }

  formatDate(value: string | null): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat(this.language() === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));
  }

  frequencyLabel(value: FrequencyFilter): string {
    const labels: Record<FrequencyFilter, string> = {
      all: this.language() === 'fr' ? 'Tous' : 'All',
      weekly: this.language() === 'fr' ? 'Hebdomadaire' : 'Weekly',
      biweekly: this.language() === 'fr' ? 'Bimensuel' : 'Biweekly',
      monthly: this.language() === 'fr' ? 'Mensuel' : 'Monthly',
    };

    return labels[value];
  }
}
