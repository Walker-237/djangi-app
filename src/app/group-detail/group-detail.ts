import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LUCIDE_ICONS,
  LucideIconProvider,
  ArrowLeft,
  Users,
  Wallet,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  CheckCircle2,
  Circle,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  FileText,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { GroupsService } from '../core/services/groups.service';
import { Group, GroupMember } from '../core/models/models';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        ArrowLeft,
        Users,
        Wallet,
        Calendar,
        Clock,
        ChevronRight,
        TrendingUp,
        CheckCircle,
        CheckCircle2,
        Circle,
        AlertCircle,
        AlertTriangle,
        MessageSquare,
        FileText,
        Sparkles,
        Play,
        RotateCcw,
      }),
    },
  ],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css',
})
export class GroupDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly groupsService = inject(GroupsService);

  language = this.languageService.language;
  readonly isMember = signal(true);

  readonly group = computed<Group | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    // Search across all communities' groups
    for (const community of this.groupsService.communities()) {
      const found = community.groups.find((g) => g.id === id);
      if (found) return found;
    }
    return undefined;
  });

  readonly myMember = computed<GroupMember | undefined>(() => this.group()?.members[0]);

  readonly paidCount = computed(() => this.group()?.members.filter((m) => m.status === 'paid').length ?? 0);

  readonly totalMembers = computed(() => this.group()?.memberCount ?? 0);

  readonly nextMember = computed<GroupMember | undefined>(() => {
    const group = this.group();
    if (!group) return undefined;
    return group.members.find((m) => m.status === 'next') ??
      group.members.find((m) => m.id === group.nextPayoutMemberId);
  });

  readonly meetings = [
    {
      id: 'm1',
      title: 'Cycle planning',
      date: '2026-06-27',
      status: 'upcoming',
      hasAiSummary: false,
    },
    {
      id: 'm2',
      title: 'Payout review',
      date: '2026-05-10',
      status: 'completed',
      hasAiSummary: true,
    },
  ];

  readonly cycleNumber = computed(() => {
    const group = this.group();
    if (!group) return 1;
    const createdAt = new Date(group.createdAt || Date.now());
    const months = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)) + 1);
    return months;
  });

  private readonly circleRadius = 60;
  readonly circleCircumference = 2 * Math.PI * this.circleRadius;

  cycleDashOffset(): number {
    const progress = this.totalMembers() === 0 ? 0 : this.paidCount() / this.totalMembers();
    return this.circleCircumference * (1 - progress);
  }

  formatAmount(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString(this.language() === 'fr' ? 'fr-FR' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  frequencyLabel(f: string): string {
    const map: Record<string, { en: string; fr: string }> = {
      weekly:   { en: 'Weekly',   fr: 'Hebdomadaire' },
      biweekly: { en: 'Biweekly', fr: 'Bimensuel' },
      monthly:  { en: 'Monthly',  fr: 'Mensuel' },
    };
    const entry = map[f] ?? { en: f, fr: f };
    return this.language() === 'fr' ? entry.fr : entry.en;
  }

  statusLabel(status: GroupMember['status']): string {
    const map: Record<GroupMember['status'], { en: string; fr: string }> = {
      paid:    { en: 'Paid',    fr: 'Payé' },
      next:    { en: 'Next',    fr: 'Prochain' },
      pending: { en: 'Pending', fr: 'En attente' },
      late:    { en: 'Late',    fr: 'En retard' },
    };
    const entry = map[status] ?? { en: status, fr: status };
    return this.language() === 'fr' ? entry.fr : entry.en;
  }

  meetingStatusLabel(status: string): string {
    const map: Record<string, { en: string; fr: string }> = {
      upcoming:  { en: 'Upcoming',   fr: 'À venir' },
      completed: { en: 'Completed',  fr: 'Terminé' },
      pending:   { en: 'Pending',    fr: 'En attente' },
    };
    const entry = map[status] ?? { en: status, fr: status };
    return this.language() === 'fr' ? entry.fr : entry.en;
  }

  statusIcon(status: GroupMember['status']): string {
    const map: Record<string, string> = {
      paid:    'check-circle',
      next:    'clock',
      pending: 'circle',
      late:    'alert-circle',
    };
    return map[status] ?? 'circle';
  }

  statusClass(status: GroupMember['status']): string {
    const map: Record<string, string> = {
      paid:    'gd-status--paid',
      next:    'gd-status--next',
      pending: 'gd-status--pending',
      late:    'gd-status--late',
    };
    return map[status] ?? '';
  }

  goBack(): void {
    history.back();
  }

  openContributions(): void {
    const group = this.group();
    if (group) {
      this.router.navigate(['/app/groups', group.id, 'contributions']);
    }
  }

  openPayouts(): void {
    const group = this.group();
    if (group) {
      this.router.navigate(['/app/groups', group.id, 'payouts']);
    }
  }

  openMeetings(): void {
    const group = this.group();
    if (group) {
      this.router.navigate(['/app/groups', group.id, 'meetings']);
    }
  }

  openComplaints(): void {
    this.router.navigate(['/app/complaints']);
  }

  joinGroup(group: Group): void {
    // TODO: wire to real join flow / service
    alert(`Join group: ${group.name}`);
  }
}