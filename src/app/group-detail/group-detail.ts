import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider,
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
import { GroupsApiService } from '../core/services/groups.api.service';
import { ContributionsService } from '../core/services/contributions.service';
import { PayoutsService } from '../core/services/payouts.service';
import { MeetingsService } from '../core/services/meetings.service';
import { Contribution, Group, GroupMember, Meeting, Payout } from '../core/models/models';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [LucideAngularModule],
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
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly contributionsService = inject(ContributionsService);
  private readonly payoutsService = inject(PayoutsService);
  private readonly meetingsService = inject(MeetingsService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  readonly isMember = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);
  group = signal<Group | undefined>(undefined);
  contributions = signal<Contribution[]>([]);
  payouts = signal<Payout[]>([]);
  meetings = signal<Meeting[]>([]);

  readonly myMember = computed<GroupMember | undefined>(() => this.group()?.members[0]);
  readonly paidCount = computed(() => this.group()?.members.filter((m) => m.status === 'paid').length ?? 0);
  readonly totalMembers = computed(() => this.group()?.memberCount ?? 0);

  readonly nextMember = computed<GroupMember | undefined>(() => {
    const group = this.group();
    if (!group) return undefined;
    return group.members.find((m) => m.status === 'next') ?? group.members.find((m) => m.id === String(group.nextPayoutMemberId));
  });

  readonly cycleNumber = computed(() => {
    const group = this.group();
    if (!group) return 1;
    const createdAt = new Date(group.createdAt || Date.now());
    const months = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)) + 1);
    return months;
  });

  private readonly circleRadius = 60;
  readonly circleCircumference = 2 * Math.PI * this.circleRadius;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading.set(true);
    this.error.set(null);
    this.groupsApiService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (group) => this.group.set(group),
      error: () => this.setLoadError(),
    });
    this.groupsApiService.getMembers(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (members) => {
        const group = this.group();
        if (group) this.group.set({ ...group, members });
      },
      error: () => this.setLoadError(),
    });
    this.contributionsService.getByGroup(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (contributions) => this.contributions.set(contributions),
      error: () => this.setLoadError(),
    });
    this.payoutsService.getByGroup(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (payouts) => this.payouts.set(payouts),
      error: () => this.setLoadError(),
    });
    this.meetingsService.getByGroup(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (meetings) => {
        this.meetings.set(meetings);
        this.loading.set(false);
      },
      error: () => this.setLoadError(),
    });
  }

  cycleDashOffset(): number {
    const progress = this.totalMembers() === 0 ? 0 : this.paidCount() / this.totalMembers();
    return this.circleCircumference * (1 - progress);
  }

  formatAmount(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  formatDate(iso: string | null): string {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString(this.language() === 'fr' ? 'fr-FR' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  statusLabel(status: GroupMember['status']): string {
    const map: Record<GroupMember['status'], { en: string; fr: string }> = {
      paid: { en: 'Paid', fr: 'Paye' },
      next: { en: 'Next', fr: 'Prochain' },
      pending: { en: 'Pending', fr: 'En attente' },
      late: { en: 'Late', fr: 'En retard' },
    };
    const entry = map[status] ?? { en: status, fr: status };
    return this.language() === 'fr' ? entry.fr : entry.en;
  }

  meetingStatusLabel(status: string): string {
    const map: Record<string, { en: string; fr: string }> = {
      upcoming: { en: 'Upcoming', fr: 'A venir' },
      completed: { en: 'Completed', fr: 'Termine' },
      pending: { en: 'Pending', fr: 'En attente' },
      cancelled: { en: 'Cancelled', fr: 'Annule' },
    };
    const entry = map[status] ?? { en: status, fr: status };
    return this.language() === 'fr' ? entry.fr : entry.en;
  }

  statusIcon(status: GroupMember['status']): string {
    const map: Record<string, string> = {
      paid: 'check-circle',
      next: 'clock',
      pending: 'circle',
      late: 'alert-circle',
    };
    return map[status] ?? 'circle';
  }

  statusClass(status: GroupMember['status']): string {
    const map: Record<string, string> = {
      paid: 'gd-status--paid',
      next: 'gd-status--next',
      pending: 'gd-status--pending',
      late: 'gd-status--late',
    };
    return map[status] ?? '';
  }

  goBack(): void {
    history.back();
  }

  openContributions(): void {
    const group = this.group();
    if (group) this.router.navigate(['/app/groups', group.id, 'contributions']);
  }

  openPayouts(): void {
    const group = this.group();
    if (group) this.router.navigate(['/app/groups', group.id, 'payouts']);
  }

  openMeetings(): void {
    const group = this.group();
    if (group) this.router.navigate(['/app/groups', group.id, 'meetings']);
  }

  openComplaints(): void {
    this.router.navigate(['/app/complaints']);
  }

  joinGroup(group: Group): void {
    this.loading.set(true);
    this.error.set(null);
    this.groupsApiService.join(group.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedGroup) => {
        this.group.set(updatedGroup);
        this.isMember.set(true);
        this.loading.set(false);
      },
      error: () => this.setLoadError(),
    });
  }

  private setLoadError(): void {
    this.error.set(this.language() === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.');
    this.loading.set(false);
  }
}

