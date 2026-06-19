import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  ArrowLeft,
  ChevronDown,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        ArrowLeft,
        ChevronDown,
      }),
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

  language = this.languageService.language;

  groupName = signal('');
  description = signal('');
  frequency = signal<'weekly' | 'biweekly' | 'monthly'>('monthly');
  contributionAmount = signal('');
  currency = signal('FCFA');
  maxMembers = signal('');

  currencies = ['FCFA', 'EUR', 'USD', 'XAF'];
  frequencies = ['weekly', 'biweekly', 'monthly'];

  readonly communityId = computed(() => this.route.snapshot.queryParamMap.get('communityId') ?? '');

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
    // TODO: wire to real group creation service
    const formData = {
      name: this.groupName(),
      description: this.description(),
      frequency: this.frequency(),
      contributionAmount: parseFloat(this.contributionAmount()),
      currency: this.currency(),
      maxMembers: parseInt(this.maxMembers(), 10),
      communityId: this.communityId(),
    };
    console.log('Create group:', formData);
    // Redirect to groups or dashboard
    this.router.navigate(['/app/my-groups']);
  }

  goBack(): void {
    this.location.back();
  }
}
