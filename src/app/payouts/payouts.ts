import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideAngularModule,
  LucideIconProvider,
  LUCIDE_ICONS,
  ArrowLeft,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  CircleCheck,
  X,
  Download,
  ChevronRight,
  Banknote,
  RefreshCw,
} from 'lucide-angular';
import { LanguageService } from '../core/services/language.service';
import { GroupsService } from '../core/services/groups.service';
import { Group, GroupMember } from '../core/models/models';

// ── Types ─────────────────────────────────────────────────────────────────────
export type PayoutStatus = 'paid' | 'next' | 'pending' | 'late';
export type ModalStep = 'confirm' | 'success';

export interface PayoutRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberInitials: string;
  position: number;
  amount: number;
  currency: string;
  date: string;
  status: PayoutStatus;
  ref?: string;
}

// ── Labels ────────────────────────────────────────────────────────────────────
const LABELS = {
  fr: {
    title:           'Versements',
    subtitle:        'Gestion des versements du groupe',
    back:            'Retour',
    cycle:           'Cycle',
    totalPot:        'Cagnotte totale',
    nextPayout:      'Prochain versement',
    membersLeft:     'membres restants',
    schedule:        'Calendrier de rotation',
    history:         'Historique des versements',
    position:        'Position',
    recipient:       'Bénéficiaire',
    amount:          'Montant',
    date:            'Date',
    status:          'Statut',
    paid:            'Versé',
    next:            'Prochain',
    pending:         'En attente',
    late:            'En retard',
    processBtn:      'Effectuer le versement',
    confirmTitle:    'Confirmer le versement',
    confirmSubtitle: 'Cette action est irréversible.',
    confirmTo:       'Bénéficiaire',
    confirmAmount:   'Montant',
    confirmDate:     'Date',
    confirmBtn:      'Confirmer le versement',
    cancel:          'Annuler',
    successTitle:    'Versement effectué !',
    successMsg:      'Le versement a été enregistré avec succès.',
    close:           'Fermer',
    processing:      'Traitement en cours...',
    downloadReceipt: 'Télécharger le reçu',
    emptyHistory:    'Aucun versement effectué pour ce cycle.',
    noGroup:         'Groupe introuvable.',
    cycleProgress:   'Progression du cycle',
    ref:             'Référence',
  },
  en: {
    title:           'Payouts',
    subtitle:        'Group payout management',
    back:            'Back',
    cycle:           'Cycle',
    totalPot:        'Total pot',
    nextPayout:      'Next payout',
    membersLeft:     'members remaining',
    schedule:        'Rotation schedule',
    history:         'Payout history',
    position:        'Position',
    recipient:       'Recipient',
    amount:          'Amount',
    date:            'Date',
    status:          'Status',
    paid:            'Paid',
    next:            'Next',
    pending:         'Pending',
    late:            'Late',
    processBtn:      'Process payout',
    confirmTitle:    'Confirm payout',
    confirmSubtitle: 'This action cannot be undone.',
    confirmTo:       'Recipient',
    confirmAmount:   'Amount',
    confirmDate:     'Date',
    confirmBtn:      'Confirm payout',
    cancel:          'Cancel',
    successTitle:    'Payout successful!',
    successMsg:      'The payout has been recorded successfully.',
    close:           'Close',
    processing:      'Processing...',
    downloadReceipt: 'Download receipt',
    emptyHistory:    'No payouts recorded for this cycle.',
    noGroup:         'Group not found.',
    cycleProgress:   'Cycle progress',
    ref:             'Reference',
  },
} as const;

// ── Mock payout records builder ───────────────────────────────────────────────
function buildPayouts(group: Group): PayoutRecord[] {
  return group.members.map((m) => ({
    id:             'pyt-' + m.id,
    memberId:       m.id,
    memberName:     m.name,
    memberInitials: m.initials,
    position:       m.position,
    amount:         group.totalPot,
    currency:       group.currency,
    date: group.nextPayoutDate ?? "",
    status:         m.status as PayoutStatus,
    ref:            m.status === 'paid' ? 'PYT-' + m.id.toUpperCase() : undefined,
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-group-payouts',
  standalone: true,
  imports: [LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        ArrowLeft,
        TrendingUp,
        Users,
        Calendar,
        CheckCircle2,
        Clock,
        Circle,
        AlertCircle,
        CircleCheck,
        X,
        Download,
        ChevronRight,
        Banknote,
        RefreshCw,
      }),
    },
  ],
  templateUrl: './payouts.html',
  styleUrl: './payouts.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Payouts {
  private readonly route   = inject(ActivatedRoute);
  private readonly router  = inject(Router);
  private readonly langSvc = inject(LanguageService);
  private readonly grpSvc  = inject(GroupsService);

  language = this.langSvc.language;

  // ── Labels ─────────────────────────────────────────────────────────────────
  L = computed(() => LABELS[this.language()]);

  // ── Group ──────────────────────────────────────────────────────────────────
  group = computed<Group | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    for (const community of this.grpSvc.communities()) {
      const found = community.groups.find((g) => g.id === id);
      if (found) return found;
    }
    return undefined;
  });

  // ── Payout records ─────────────────────────────────────────────────────────
  payouts = computed<PayoutRecord[]>(() => {
    const g = this.group();
    if (!g) return [];
    return buildPayouts(g).sort((a, b) => a.position - b.position);
  });

  paidPayouts = computed(() => this.payouts().filter((p) => p.status === 'paid'));
  nextPayout  = computed(() => this.payouts().find((p) => p.status === 'next'));
  pendingPayouts = computed(() => this.payouts().filter((p) => p.status === 'pending' || p.status === 'late'));

  paidCount   = computed(() => this.paidPayouts().length);
  totalCount  = computed(() => this.payouts().length);

  cycleProgress = computed(() =>
    this.totalCount() === 0 ? 0 : Math.round((this.paidCount() / this.totalCount()) * 100)
  );

  // ── Modal state ────────────────────────────────────────────────────────────
  activeModal  = signal<'process' | null>(null);
  modalStep    = signal<ModalStep>('confirm');
  isProcessing = signal(false);
  lastRef      = signal('');

  // ── Actions ────────────────────────────────────────────────────────────────
  goBack(): void { history.back(); }

  openProcessModal(): void {
    this.activeModal.set('process');
    this.modalStep.set('confirm');
    this.isProcessing.set(false);
  }

  closeModal(): void {
    if (this.isProcessing()) return;
    this.activeModal.set(null);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('gp-modal-backdrop')) {
      this.closeModal();
    }
  }

  confirmPayout(): void {
    this.isProcessing.set(true);
    setTimeout(() => {
      this.lastRef.set('PYT-' + Date.now().toString(36).toUpperCase());
      this.isProcessing.set(false);
      this.modalStep.set('success');
    }, 1800);
  }

  downloadReceipt(): void {
    const g   = this.group();
    const nxt = this.nextPayout();
    if (!g || !nxt) return;
    const L   = this.L();
    const lang = this.language();

    const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${L.downloadReceipt} — Djangi</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,Helvetica,Arial,sans-serif; background:#F7F3ED; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:2rem; }
    .r { background:#fff; border-radius:24px; max-width:400px; width:100%; padding:2.5rem 2rem; box-shadow:0 8px 32px rgba(27,58,45,.14); }
    .logo { text-align:center; margin-bottom:1.5rem; }
    .logo h1 { font-size:1.5rem; font-weight:800; color:#1B3A2D; }
    .logo p  { font-size:.75rem; color:#6B6B6B; margin-top:.2rem; }
    .amt-block { text-align:center; padding:1.5rem 0; border-top:1px solid #F0EBE3; border-bottom:1px solid #F0EBE3; margin-bottom:1.5rem; }
    .amt-block .lbl { font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#6B6B6B; margin-bottom:.5rem; }
    .amt-block .amt { font-size:2.5rem; font-weight:800; color:#1B3A2D; }
    .rows .row { display:flex; justify-content:space-between; padding:.75rem 0; border-bottom:1px solid #F7F3ED; }
    .rows .row:last-child { border-bottom:none; }
    .k { font-size:.78rem; color:#6B6B6B; font-weight:500; }
    .v { font-size:.85rem; color:#1A1A1A; font-weight:600; text-align:right; }
    .ref { text-align:center; margin-top:1.5rem; padding-top:1.5rem; border-top:1px dashed #E5DDD3; }
    .ref p { font-size:.68rem; color:#A0A0A0; margin-bottom:.25rem; }
    .ref code { font-size:.8rem; font-weight:700; color:#1B3A2D; }
    .footer { text-align:center; margin-top:1.5rem; font-size:.68rem; color:#A0A0A0; }
    @media print { body { background:white; } .r { box-shadow:none; } }
  </style>
</head>
<body>
  <div class="r">
    <div class="logo"><h1>Djangi</h1><p>${lang === 'fr' ? 'Reçu de versement' : 'Payout Receipt'}</p></div>
    <div class="amt-block">
      <div class="lbl">${lang === 'fr' ? 'Versement groupe' : 'Group payout'}</div>
      <div class="amt">${nxt.amount.toLocaleString('fr-FR')} <span style="font-size:1rem">${nxt.currency}</span></div>
    </div>
    <div class="rows">
      <div class="row"><span class="k">${L.recipient}</span><span class="v">${nxt.memberName}</span></div>
      <div class="row"><span class="k">${lang === 'fr' ? 'Groupe' : 'Group'}</span><span class="v">${g.name}</span></div>
      <div class="row"><span class="k">${L.date}</span><span class="v">${this.formatDate(nxt.date)}</span></div>
      <div class="row"><span class="k">${L.position}</span><span class="v">#${nxt.position} / ${this.totalCount()}</span></div>
    </div>
    <div class="ref"><p>${L.ref}</p><code>${this.lastRef()}</code></div>
    <div class="footer">Djangi · ${lang === 'fr' ? 'Gardez ce reçu comme preuve' : 'Keep this receipt as proof'}</div>
  </div>
  <script>window.onload = () => window.print()<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (!win) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `payout-${this.lastRef()}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  formatAmount(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat(this.language() === 'fr' ? 'fr-FR' : 'en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(iso));
  }

  statusLabel(status: PayoutStatus): string {
    return this.L()[status];
  }

  statusIcon(status: PayoutStatus): string {
    const map: Record<PayoutStatus, string> = {
      paid:    'check-circle-2',
      next:    'clock',
      pending: 'circle',
      late:    'alert-circle',
    };
    return map[status];
  }

  statusClass(status: PayoutStatus): string {
    const map: Record<PayoutStatus, string> = {
      paid:    'gp-status--paid',
      next:    'gp-status--next',
      pending: 'gp-status--pending',
      late:    'gp-status--late',
    };
    return map[status];
  }
}


