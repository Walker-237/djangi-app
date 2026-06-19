import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  ArrowLeft,
  Heart,
  Users,
  Layers,
  Wallet,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { GroupsService } from '../core/services/groups.service';
import { Community, Group } from '../core/models/models';

@Component({
  selector: 'app-community-detail',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        ArrowLeft,
        Heart,
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
  private readonly groupsService = inject(GroupsService);

  language = this.languageService.language;

  readonly community = computed<Community | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.groupsService.communities().find((c) => c.id === id);
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

  goBack(): void {
    this.router.navigate(['/app/communities']);
  }

  openGroup(group: Group): void {
    this.router.navigate(['/app/groups', group.id]);
  }

  openCreateGroup(): void {
    const c = this.community();
    if (c) {
      this.router.navigate(['/app/groups/create'], {
        queryParams: { communityId: c.id },
      });
    }
  }

  frequencyLabel(f: string): string {
    const map: Record<string, { en: string; fr: string }> = {
      weekly:   { en: 'Weekly',    fr: 'Hebdomadaire' },
      biweekly: { en: 'Biweekly',  fr: 'Bimensuel' },
      monthly:  { en: 'Monthly',   fr: 'Mensuel' },
    };
    const entry = map[f] ?? { en: f, fr: f };
    return this.language() === 'fr' ? entry.fr : entry.en;
  }
}