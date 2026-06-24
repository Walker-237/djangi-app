import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CircleDollarSign,
  Layers,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Users,
  Wallet,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { AuthService } from '../core/services/auth.service';
import { WalletService } from '../core/services/wallet.service';
import { GroupsApiService } from '../core/services/groups.api.service';
import { NotificationsService } from '../core/services/notifications.service';
import { CommunitiesService } from '../core/services/communities.service';
import { AppNotification, Community, Group, User, Wallet as UserWallet } from '../core/models/models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
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
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly walletService = inject(WalletService);
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly communitiesService = inject(CommunitiesService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  loading = signal(false);
  error = signal<string | null>(null);
  currentUser = signal<User | null>(this.authService.getCurrentUser());
  wallet = signal<UserWallet | null>(null);
  notifications = signal<AppNotification[]>([]);
  communities = signal<Community[]>([]);
  groups = signal<Group[]>([]);

  totalMembers = computed(() =>
    this.communities().reduce((sum, community) => sum + (community.memberCount ?? community.groups.reduce((inner, group) => inner + group.memberCount, 0)), 0),
  );

  totalSavings = computed(() =>
    this.wallet()?.balance ?? this.communities().reduce((sum, community) => sum + community.totalSavings, 0),
  );

  unreadNotificationCount = computed(() => this.notifications().filter((notification) => !notification.read).length);

  nextPayouts = computed(() =>
    [...this.groups()]
      .filter((group) => !!group.nextPayoutDate)
      .sort((a, b) => new Date(a.nextPayoutDate ?? 0).getTime() - new Date(b.nextPayoutDate ?? 0).getTime())
      .slice(0, 3),
  );

  featuredCommunities = computed(() =>
    [...this.communities()]
      .sort((a, b) => b.totalSavings - a.totalSavings)
      .slice(0, 3),
  );

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.authService.me().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger le profil.' : 'Unable to load profile.'),
    });
    this.walletService.getWallet().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (wallet) => this.wallet.set(wallet),
      error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger le portefeuille.' : 'Unable to load wallet.'),
    });
    this.groupsApiService.getMyGroups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (groups) => this.groups.set(groups),
      error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger vos groupes.' : 'Unable to load your groups.'),
    });
    this.notificationsService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (notifications) => this.notifications.set(notifications),
      error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger les notifications.' : 'Unable to load notifications.'),
    });
    this.communitiesService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (communities) => {
        this.communities.set(communities.map((community) => ({
          ...community,
          memberCount: community.memberCount ?? community.groups.reduce((sum, group) => sum + group.memberCount, 0),
          location: community.location ?? community.category ?? community.name,
          nameFr: community.nameFr ?? community.name,
          descriptionFr: community.descriptionFr ?? community.description,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.language() === 'fr' ? 'Impossible de charger les communautes.' : 'Unable to load communities.');
        this.loading.set(false);
      },
    });
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR');
  }

  formatDate(value: string | null): string {
    if (!value) return '-';
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
