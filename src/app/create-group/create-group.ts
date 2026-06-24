import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  ArrowLeft,
  ChevronDown,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { GroupsApiService } from '../core/services/groups.api.service';
import { CommunitiesService } from '../core/services/communities.service';
import { Community } from '../core/models/models';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ ArrowLeft, ChevronDown }),
    },
  ],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css',
})
export class CreateGroup {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly languageService = inject(LanguageService);
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly communitiesService = inject(CommunitiesService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  loading = signal(false);
  error = signal<string | null>(null);
  communities = signal<Community[]>([]);

  groupName = signal('');
  description = signal('');
  frequency = signal<'weekly' | 'biweekly' | 'monthly'>('monthly');
  contributionAmount = signal('');
  currency = signal('FCFA');
  maxMembers = signal('');

  currencies = ['FCFA', 'EUR', 'USD', 'XAF'];
  frequencies = ['weekly', 'biweekly', 'monthly'];

  readonly communityId = computed(() => this.route.snapshot.queryParamMap.get('communityId') ?? this.communities()[0]?.id ?? '');

  ngOnInit(): void {
    this.communitiesService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (communities) => this.communities.set(communities),
        error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger les communautes.' : 'Unable to load communities.'),
      });
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

  onSubmit(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.groupsApiService.create({
      name: this.groupName(),
      description: this.description(),
      frequency: this.frequency(),
      contributionAmount: parseFloat(this.contributionAmount()),
      currency: this.currency(),
      communityId: this.communityId(),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/app/my-groups']),
      error: () => {
        this.error.set(this.language() === 'fr' ? 'Impossible de creer le groupe.' : 'Unable to create group.');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
