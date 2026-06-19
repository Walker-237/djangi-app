import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CircleDollarSign,
  Layers,
  LUCIDE_ICONS,
  LucideIconProvider,
  Users,
  Wallet,
} from 'lucide-angular';
import { GroupsService } from '../core/services/groups.service';
import { LanguageService } from '../core/services/language.service';
import { Group } from '../core/models/models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        ArrowRight,
        Bell,
        CalendarClock,
        CircleDollarSign,
        Layers,
        Users,
        Wallet,
      }),
    },
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Dashboard {
  private readonly groupsService = inject(GroupsService);
  private readonly languageService = inject(LanguageService);

  language = this.languageService.language;
  communities = this.groupsService.communities;
  groups = this.groupsService.groups;

  totalMembers = computed(() =>
    this.communities().reduce((sum, community) => sum + community.memberCount, 0),
  );

  totalSavings = computed(() =>
    this.communities().reduce((sum, community) => sum + community.totalSavings, 0),
  );

  nextPayouts = computed(() =>
    [...this.groups()]
      .sort(
        (a, b) =>
          new Date(a.nextPayoutDate).getTime() -
          new Date(b.nextPayoutDate).getTime(),
      )
      .slice(0, 3),
  );

  featuredCommunities = computed(() =>
    [...this.communities()]
      .sort((a, b) => b.totalSavings - a.totalSavings)
      .slice(0, 3),
  );

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR');
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat(this.language() === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  }

  frequencyLabel(group: Group): string {
    const labels = {
      weekly: this.language() === 'fr' ? 'Hebdomadaire' : 'Weekly',
      biweekly: this.language() === 'fr' ? 'Bimensuel' : 'Biweekly',
      monthly: this.language() === 'fr' ? 'Mensuel' : 'Monthly',
    };

    return labels[group.frequency];
  }
}
