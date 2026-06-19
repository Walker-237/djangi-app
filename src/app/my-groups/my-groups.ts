import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
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
import { GroupsService } from '../core/services/groups.service';
import { LanguageService } from '../core/services/language.service';
import { Group, GroupFrequency } from '../core/models/models';

type FrequencyFilter = 'all' | GroupFrequency;

@Component({
  selector: 'app-my-groups',
  imports: [RouterLink],
  providers: [
    {
      provide: LUCIDE_ICONS,
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
  private readonly groupsService = inject(GroupsService);
  private readonly languageService = inject(LanguageService);

  language = this.languageService.language;
  groups = this.groupsService.groups;
  communities = this.groupsService.communities;

  searchQuery = signal('');
  frequencyFilter = signal<FrequencyFilter>('all');

  filters: FrequencyFilter[] = ['all', 'weekly', 'biweekly', 'monthly'];

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
        community?.nameFr.toLowerCase().includes(q);

      return matchesFrequency && matchesSearch;
    });
  });

  totalPot = computed(() =>
    this.groups().reduce((sum, group) => sum + group.totalPot, 0),
  );

  totalMembers = computed(() =>
    this.groups().reduce((sum, group) => sum + group.memberCount, 0),
  );

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  setFrequencyFilter(value: FrequencyFilter): void {
    this.frequencyFilter.set(value);
  }

  communityForGroup(group: Group) {
    return this.communities().find((community) =>
      community.groups.some((item) => item.id === group.id),
    );
  }

  communityName(group: Group): string {
    const community = this.communityForGroup(group);
    if (!community) return this.language() === 'fr' ? 'Communaute' : 'Community';
    return this.language() === 'fr' ? community.nameFr : community.name;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR');
  }

  formatDate(value: string): string {
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
