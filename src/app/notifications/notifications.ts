import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LucideAngularModule,
  LucideIconProvider,
  LUCIDE_ICONS,
  CircleDollarSign,
  AlertCircle,
  Clock,
  Users,
  Bell,
  CheckCheck,
  X,
  Inbox,
  CreditCard,
  Settings,
  PartyPopper,
  ShieldAlert,
} from 'lucide-angular';
import { NotificationsService } from '../core/services/notifications.service';
import { AppNotification } from '../core/models/models';

export type NotifType = 'payment_received' | 'payment_due' | 'group_invite' | 'group_update' | 'payout_received' | 'system';
export type FilterTab = 'all' | 'unread' | 'groups' | 'payments' | 'system';

export interface Notification {
  id: string;
  type: NotifType;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  timestamp: Date;
  read: boolean;
}

const LABELS = {
  fr: {
    pageTitle: 'Notifications',
    unreadBadge: (n: number) => `${n} non lue${n > 1 ? 's' : ''}`,
    markAll: 'Tout marquer comme lu',
    tabs: { all: 'Tout', unread: 'Non lues', groups: 'Groupes', payments: 'Paiements', system: 'Systeme' },
    emptyTitle: 'Aucune notification',
    emptyBody: 'Vous etes a jour. Revenez plus tard.',
    justNow: "A l'instant",
    minutesAgo: (n: number) => `Il y a ${n} min`,
    hoursAgo: (n: number) => `Il y a ${n}h`,
    yesterday: 'Hier',
    daysAgo: (n: number) => `Il y a ${n} jours`,
  },
  en: {
    pageTitle: 'Notifications',
    unreadBadge: (n: number) => `${n} unread`,
    markAll: 'Mark all as read',
    tabs: { all: 'All', unread: 'Unread', groups: 'Groups', payments: 'Payments', system: 'System' },
    emptyTitle: 'All caught up',
    emptyBody: 'No notifications here. Check back later.',
    justNow: 'Just now',
    minutesAgo: (n: number) => `${n} min ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    yesterday: 'Yesterday',
    daysAgo: (n: number) => `${n} days ago`,
  },
};

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        CircleDollarSign,
        AlertCircle,
        Clock,
        Users,
        Bell,
        CheckCheck,
        X,
        Inbox,
        CreditCard,
        Settings,
        PartyPopper,
        ShieldAlert,
      }),
    },
  ],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationsComponent {
  private readonly notificationsService = inject(NotificationsService);
  private readonly destroyRef = inject(DestroyRef);

  language = signal<'fr' | 'en'>('fr');
  activeTab = signal<FilterTab>('all');
  notifications = signal<Notification[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  get L() { return LABELS[this.language()]; }

  tabs: FilterTab[] = ['all', 'unread', 'groups', 'payments', 'system'];

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.notificationsService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (notifications) => {
          this.notifications.set(notifications.map((notification) => this.toNotification(notification)));
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.language() === 'fr' ? 'Impossible de charger les notifications.' : 'Unable to load notifications.');
          this.loading.set(false);
        },
      });
  }

  tabLabel(tab: FilterTab): string {
    return this.L.tabs[tab];
  }

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  filtered = computed(() => {
    const tab = this.activeTab();
    return this.notifications().filter(n => {
      if (tab === 'all') return true;
      if (tab === 'unread') return !n.read;
      if (tab === 'groups') return n.type === 'group_invite' || n.type === 'group_update';
      if (tab === 'payments') return n.type === 'payment_received' || n.type === 'payment_due' || n.type === 'payout_received';
      if (tab === 'system') return n.type === 'system';
      return true;
    });
  });

  markRead(id: string) {
    this.notificationsService.markRead(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (notification) => {
          const mapped = this.toNotification(notification);
          this.notifications.update(list => list.map(n => n.id === id ? mapped : n));
        },
        error: () => this.error.set(this.language() === 'fr' ? 'Impossible de marquer comme lu.' : 'Unable to mark as read.'),
      });
  }

  markAllRead() {
    this.notifications().filter(n => !n.read).forEach((notification) => this.markRead(notification.id));
  }

  dismiss(id: string) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  setTab(tab: FilterTab) {
    this.activeTab.set(tab);
  }

  toggleLanguage() {
    this.language.update(l => l === 'fr' ? 'en' : 'fr');
  }

  iconName(type: NotifType): string {
    switch (type) {
      case 'payment_received': return 'circle-dollar-sign';
      case 'payment_due': return 'alert-circle';
      case 'payout_received': return 'credit-card';
      case 'group_invite': return 'party-popper';
      case 'group_update': return 'users';
      case 'system': return 'shield-alert';
    }
  }

  typeClass(type: NotifType): string {
    switch (type) {
      case 'payment_received': return 'ntf-icon-wrap ntf-icon--green';
      case 'payout_received': return 'ntf-icon-wrap ntf-icon--green';
      case 'payment_due': return 'ntf-icon-wrap ntf-icon--red';
      case 'group_invite': return 'ntf-icon-wrap ntf-icon--gold';
      case 'group_update': return 'ntf-icon-wrap ntf-icon--gold';
      case 'system': return 'ntf-icon-wrap ntf-icon--grey';
    }
  }

  title(n: Notification): string {
    return this.language() === 'fr' ? n.titleFr : n.titleEn;
  }

  body(n: Notification): string {
    return this.language() === 'fr' ? n.bodyFr : n.bodyEn;
  }

  relativeTime(date: Date): string {
    const L = this.L;
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    const diffHr = Math.floor(diffMs / 3_600_000);
    const diffDay = Math.floor(diffMs / 86_400_000);

    if (diffMin < 1) return L.justNow;
    if (diffMin < 60) return L.minutesAgo(diffMin);
    if (diffHr < 24) return L.hoursAgo(diffHr);
    if (diffDay === 1) return L.yesterday;
    return L.daysAgo(diffDay);
  }

  private toNotification(notification: AppNotification): Notification {
    return {
      id: notification.id,
      type: this.mapType(notification.type),
      titleFr: notification.title,
      titleEn: notification.title,
      bodyFr: notification.body,
      bodyEn: notification.body,
      timestamp: new Date(notification.createdAt),
      read: notification.read,
    };
  }

  private mapType(type: AppNotification['type']): NotifType {
    const map: Record<AppNotification['type'], NotifType> = {
      payout: 'payout_received',
      contribution_due: 'payment_due',
      meeting: 'group_update',
      complaint: 'system',
      system: 'system',
    };
    return map[type];
  }
}

export { NotificationsComponent as Notifications };
