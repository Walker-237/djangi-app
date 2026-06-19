import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import {
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
  LUCIDE_ICONS,
  LucideIconProvider,
} from 'lucide-angular';

// ── Types ─────────────────────────────────────────────
export type NotifType =
  | 'payment_received'
  | 'payment_due'
  | 'group_invite'
  | 'group_update'
  | 'payout_received'
  | 'system';

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

// ── Labels ────────────────────────────────────────────
const LABELS = {
  fr: {
    pageTitle: 'Notifications',
    unreadBadge: (n: number) => `${n} non lue${n > 1 ? 's' : ''}`,
    markAll: 'Tout marquer comme lu',
    tabs: {
      all: 'Tout',
      unread: 'Non lues',
      groups: 'Groupes',
      payments: 'Paiements',
      system: 'Système',
    },
    emptyTitle: 'Aucune notification',
    emptyBody: 'Vous êtes à jour. Revenez plus tard.',
    justNow: "À l'instant",
    minutesAgo: (n: number) => `Il y a ${n} min`,
    hoursAgo: (n: number) => `Il y a ${n}h`,
    yesterday: 'Hier',
    daysAgo: (n: number) => `Il y a ${n} jours`,
  },
  en: {
    pageTitle: 'Notifications',
    unreadBadge: (n: number) => `${n} unread`,
    markAll: 'Mark all as read',
    tabs: {
      all: 'All',
      unread: 'Unread',
      groups: 'Groups',
      payments: 'Payments',
      system: 'System',
    },
    emptyTitle: 'All caught up',
    emptyBody: 'No notifications here. Check back later.',
    justNow: 'Just now',
    minutesAgo: (n: number) => `${n} min ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    yesterday: 'Yesterday',
    daysAgo: (n: number) => `${n} days ago`,
  },
};

// ── Mock data ─────────────────────────────────────────
const now = new Date();
const mins = (n: number) => new Date(now.getTime() - n * 60_000);
const hrs  = (n: number) => new Date(now.getTime() - n * 3_600_000);
const days = (n: number) => new Date(now.getTime() - n * 86_400_000);

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'payment_received',
    titleFr: 'Paiement reçu',
    titleEn: 'Payment received',
    bodyFr: 'Marie Nguessé a versé 25 000 XAF dans "Famille Beti".',
    bodyEn: 'Marie Nguessé paid 25,000 XAF into "Famille Beti".',
    timestamp: mins(3),
    read: false,
  },
  {
    id: '2',
    type: 'payout_received',
    titleFr: 'Tour de collecte reçu',
    titleEn: 'Payout received',
    bodyFr: 'Vous avez reçu 150 000 XAF du groupe "Amis du Lycée".',
    bodyEn: 'You received 150,000 XAF from "Amis du Lycée".',
    timestamp: mins(18),
    read: false,
  },
  {
    id: '3',
    type: 'payment_due',
    titleFr: 'Cotisation due aujourd\'hui',
    titleEn: 'Contribution due today',
    bodyFr: 'Votre cotisation de 10 000 XAF pour "Tontine Bafoussam" est attendue.',
    bodyEn: 'Your 10,000 XAF contribution to "Tontine Bafoussam" is due.',
    timestamp: hrs(1),
    read: false,
  },
  {
    id: '4',
    type: 'group_invite',
    titleFr: 'Invitation au groupe',
    titleEn: 'Group invitation',
    bodyFr: 'Paul Mbarga vous invite à rejoindre "Njangi Douala Sud".',
    bodyEn: 'Paul Mbarga invited you to join "Njangi Douala Sud".',
    timestamp: hrs(2),
    read: false,
  },
  {
    id: '5',
    type: 'group_update',
    titleFr: 'Règles modifiées',
    titleEn: 'Rules updated',
    bodyFr: 'L\'administrateur de "Famille Beti" a mis à jour les règles du groupe.',
    bodyEn: 'The admin of "Famille Beti" updated the group rules.',
    timestamp: hrs(5),
    read: true,
  },
  {
    id: '6',
    type: 'payment_due',
    titleFr: 'Retard de paiement',
    titleEn: 'Late payment',
    bodyFr: 'Votre cotisation pour "Amis du Lycée" est en retard de 3 jours.',
    bodyEn: 'Your contribution to "Amis du Lycée" is 3 days overdue.',
    timestamp: hrs(26),
    read: true,
  },
  {
    id: '7',
    type: 'payment_received',
    titleFr: 'Paiement confirmé',
    titleEn: 'Payment confirmed',
    bodyFr: 'Jean Tagne a versé 50 000 XAF dans "Tontine Bafoussam".',
    bodyEn: 'Jean Tagne paid 50,000 XAF into "Tontine Bafoussam".',
    timestamp: days(2),
    read: true,
  },
  {
    id: '8',
    type: 'group_update',
    titleFr: 'Nouveau membre',
    titleEn: 'New member',
    bodyFr: 'Christelle Abena a rejoint "Njangi Douala Sud".',
    bodyEn: 'Christelle Abena joined "Njangi Douala Sud".',
    timestamp: days(2),
    read: true,
  },
  {
    id: '9',
    type: 'system',
    titleFr: 'Mise à jour disponible',
    titleEn: 'Update available',
    bodyFr: 'Djangi v2.1 est disponible avec de nouvelles fonctionnalités.',
    bodyEn: 'Djangi v2.1 is available with new features.',
    timestamp: days(3),
    read: true,
  },
  {
    id: '10',
    type: 'system',
    titleFr: 'Sécurité du compte',
    titleEn: 'Account security',
    bodyFr: 'Une connexion depuis un nouvel appareil a été détectée.',
    bodyEn: 'A sign-in from a new device was detected.',
    timestamp: days(5),
    read: true,
  },
];

// ── Component ─────────────────────────────────────────
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: LUCIDE_ICONS,
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
  private readonly platformId = inject(PLATFORM_ID);

  language = signal<'fr' | 'en'>('fr');
  activeTab = signal<FilterTab>('all');
  notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);

  get L() { return LABELS[this.language()]; }

  tabs: FilterTab[] = ['all', 'unread', 'groups', 'payments', 'system'];

  tabLabel(tab: FilterTab): string {
    return this.L.tabs[tab];
  }

  unreadCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );

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
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
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

  // Icon per type
  iconName(type: NotifType): string {
    switch (type) {
      case 'payment_received': return 'circle-dollar-sign';
      case 'payment_due':      return 'alert-circle';
      case 'payout_received':  return 'credit-card';
      case 'group_invite':     return 'party-popper';
      case 'group_update':     return 'users';
      case 'system':           return 'shield-alert';
    }
  }

  // Color class per type
  typeClass(type: NotifType): string {
    switch (type) {
      case 'payment_received': return 'ntf-icon--green';
      case 'payout_received':  return 'ntf-icon--green';
      case 'payment_due':      return 'ntf-icon--red';
      case 'group_invite':     return 'ntf-icon--gold';
      case 'group_update':     return 'ntf-icon--gold';
      case 'system':           return 'ntf-icon--grey';
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
    const diffHr  = Math.floor(diffMs / 3_600_000);
    const diffDay = Math.floor(diffMs / 86_400_000);

    if (diffMin < 1)  return L.justNow;
    if (diffMin < 60) return L.minutesAgo(diffMin);
    if (diffHr  < 24) return L.hoursAgo(diffHr);
    if (diffDay === 1) return L.yesterday;
    return L.daysAgo(diffDay);
  }
}

export { NotificationsComponent as Notifications };