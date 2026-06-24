import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LucideAngularModule,
  LucideIconProvider,
  LUCIDE_ICONS,
  AlertTriangle, Plus, X, ChevronRight, ArrowLeft,
  Clock, CheckCircle, CircleAlert, MessageSquare,
  Filter, Search, FileText, Send, Eye,
  CircleX, RefreshCw, Inbox,
} from 'lucide-angular';
import { ComplaintsService } from '../core/services/complaints.service';
import { GroupsApiService } from '../core/services/groups.api.service';
import { Complaint as ApiComplaint } from '../core/models/models';

const COMPLAINT_ICONS = {
  AlertTriangle, Plus, X, ChevronRight, ArrowLeft,
  Clock, CheckCircle, CircleAlert, MessageSquare,
  Filter, Search, FileText, Send, Eye,
  CircleX, RefreshCw, Inbox,
};

type Lang = 'fr' | 'en';

const LABELS = {
  fr: {
    pageTitle: 'Mes reclamations', newComplaint: 'Nouvelle reclamation', searchPlaceholder: 'Rechercher une reclamation...',
    filterAll: 'Toutes', filterOpen: 'Ouvertes', filterInProgress: 'En cours', filterResolved: 'Resolues', filterClosed: 'Fermees',
    emptyTitle: 'Aucune reclamation', emptyDesc: 'Vous n avez soumis aucune reclamation pour ce filtre.',
    catPayment: 'Probleme de paiement', catPayout: 'Litige de versement', catMember: 'Comportement d un membre', catLeader: 'Conduite du leader', catMeeting: 'Organisation des reunions', catOther: 'Autre',
    formTitle: 'Soumettre une reclamation', formSubtitle: 'Decrivez votre probleme ci-dessous', labelCategory: 'Categorie', labelGroup: 'Groupe concerne', labelGroupPh: 'Selectionner un groupe...', labelSubject: 'Sujet', labelSubjectPh: 'Resume du probleme en une phrase', labelDescription: 'Description', labelDescPh: 'Decrivez le probleme en detail...', labelPriority: 'Priorite',
    priorityLow: 'Faible', priorityMedium: 'Normale', priorityHigh: 'Urgente', submitBtn: 'Soumettre la reclamation', cancelBtn: 'Annuler', successTitle: 'Reclamation soumise !', successDesc: 'Votre reclamation a ete enregistree. Vous serez notifie de son evolution.', successRef: 'Reference', closeBtn: 'Fermer',
    detailStatus: 'Statut', detailCategory: 'Categorie', detailGroup: 'Groupe', detailPriority: 'Priorite', detailDate: 'Soumise le', detailUpdated: 'Mise a jour', detailTimeline: 'Historique', detailResponse: 'Reponse de l equipe', noResponse: 'Aucune reponse pour l instant.',
    statusOpen: 'Ouverte', statusInProgress: 'En cours', statusResolved: 'Resolue', statusClosed: 'Fermee', errCategory: 'Veuillez selectionner une categorie', errSubject: 'Le sujet est requis', errDescription: 'La description est requise (min. 20 caracteres)', processing: 'Envoi en cours...',
  },
  en: {
    pageTitle: 'My Complaints', newComplaint: 'New Complaint', searchPlaceholder: 'Search complaints...',
    filterAll: 'All', filterOpen: 'Open', filterInProgress: 'In Progress', filterResolved: 'Resolved', filterClosed: 'Closed',
    emptyTitle: 'No complaints', emptyDesc: 'You have no complaints submitted for this filter.',
    catPayment: 'Payment issue', catPayout: 'Payout dispute', catMember: 'Member behaviour', catLeader: 'Leader conduct', catMeeting: 'Meeting organisation', catOther: 'Other',
    formTitle: 'Submit a Complaint', formSubtitle: 'Describe your issue below', labelCategory: 'Category', labelGroup: 'Concerned group', labelGroupPh: 'Select a group...', labelSubject: 'Subject', labelSubjectPh: 'One-sentence summary of the problem', labelDescription: 'Description', labelDescPh: 'Describe the problem in detail...', labelPriority: 'Priority',
    priorityLow: 'Low', priorityMedium: 'Normal', priorityHigh: 'Urgent', submitBtn: 'Submit Complaint', cancelBtn: 'Cancel', successTitle: 'Complaint submitted!', successDesc: 'Your complaint has been recorded. You will be notified of its progress.', successRef: 'Reference', closeBtn: 'Close',
    detailStatus: 'Status', detailCategory: 'Category', detailGroup: 'Group', detailPriority: 'Priority', detailDate: 'Submitted on', detailUpdated: 'Updated', detailTimeline: 'Timeline', detailResponse: 'Team response', noResponse: 'No response yet.',
    statusOpen: 'Open', statusInProgress: 'In Progress', statusResolved: 'Resolved', statusClosed: 'Closed', errCategory: 'Please select a category', errSubject: 'Subject is required', errDescription: 'Description is required (min. 20 characters)', processing: 'Sending...',
  },
} as const;

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintCategory = 'payment' | 'payout' | 'member' | 'leader' | 'meeting' | 'other';
export type ComplaintPriority = 'low' | 'medium' | 'high';
export type StatusFilter = 'all' | ComplaintStatus;

export interface TimelineEvent { date: string; label: string; labelFr: string; }
export interface Complaint {
  id: string; ref: string; category: ComplaintCategory; group: string; subject: string; subjectFr: string; description: string; descFr: string;
  status: ComplaintStatus; priority: ComplaintPriority; submittedAt: string; updatedAt: string; response?: string; responseFr?: string; timeline: TimelineEvent[];
}

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(COMPLAINT_ICONS) }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './complaints.html',
  styleUrls: ['./complaints.css'],
})
export class ComplaintsComponent {
  private readonly complaintsService = inject(ComplaintsService);
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly destroyRef = inject(DestroyRef);

  language = signal<Lang>('fr');
  labels = computed(() => LABELS[this.language()]);
  view = signal<'list' | 'form' | 'detail' | 'success'>('list');
  statusFilter = signal<StatusFilter>('all');
  searchQuery = signal('');
  selectedId = signal<string | null>(null);
  isProcessing = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  lastRef = signal('');

  formCategory = signal<ComplaintCategory | ''>('');
  formGroup = signal('');
  formSubject = signal('');
  formDescription = signal('');
  formPriority = signal<ComplaintPriority>('medium');
  formErrors = signal<Record<string, string>>({});

  complaints = signal<Complaint[]>([]);
  groups: string[] = [];

  ngOnInit(): void {
    this.loadComplaints();
    this.groupsApiService.getMyGroups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (groups) => this.groups = groups.map((group) => group.name),
      error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger les groupes.' : 'Unable to load groups.'),
    });
  }

  loadComplaints(): void {
    this.loading.set(true);
    this.error.set(null);
    this.complaintsService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (complaints) => {
        this.complaints.set(complaints.map((complaint) => this.toComplaint(complaint)));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.language() === 'fr' ? 'Impossible de charger les reclamations.' : 'Unable to load complaints.');
        this.loading.set(false);
      },
    });
  }

  statusFilters = computed(() => {
    const l = this.labels();
    return [
      { value: 'all' as StatusFilter, label: l.filterAll }, { value: 'open' as StatusFilter, label: l.filterOpen },
      { value: 'in_progress' as StatusFilter, label: l.filterInProgress }, { value: 'resolved' as StatusFilter, label: l.filterResolved },
      { value: 'closed' as StatusFilter, label: l.filterClosed },
    ];
  });

  categories = computed(() => {
    const l = this.labels();
    return [
      { value: 'payment' as ComplaintCategory, label: l.catPayment }, { value: 'payout' as ComplaintCategory, label: l.catPayout },
      { value: 'member' as ComplaintCategory, label: l.catMember }, { value: 'leader' as ComplaintCategory, label: l.catLeader },
      { value: 'meeting' as ComplaintCategory, label: l.catMeeting }, { value: 'other' as ComplaintCategory, label: l.catOther },
    ];
  });

  filteredComplaints = computed(() => {
    let list = this.complaints();
    const sf = this.statusFilter();
    const q = this.searchQuery().toLowerCase().trim();
    if (sf !== 'all') list = list.filter(c => c.status === sf);
    if (q) list = list.filter(c => c.ref.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.subjectFr.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
    return [...list].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  });

  selectedComplaint = computed(() => this.complaints().find(c => c.id === this.selectedId()) ?? null);
  unreadCount = computed(() => this.complaints().filter(c => c.status === 'open').length);

  openForm(): void { this.resetForm(); this.view.set('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  openDetail(id: string): void { this.selectedId.set(id); this.view.set('detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  backToList(): void { this.view.set('list'); this.selectedId.set(null); }

  resetForm(): void {
    this.formCategory.set(''); this.formGroup.set(''); this.formSubject.set(''); this.formDescription.set(''); this.formPriority.set('medium'); this.formErrors.set({});
  }

  validate(): boolean {
    const errs: Record<string, string> = {};
    const l = this.labels();
    if (!this.formCategory()) errs['category'] = l.errCategory;
    if (!this.formSubject().trim()) errs['subject'] = l.errSubject;
    if (this.formDescription().trim().length < 20) errs['description'] = l.errDescription;
    this.formErrors.set(errs);
    return Object.keys(errs).length === 0;
  }

  submitComplaint(): void {
    if (!this.validate()) return;
    this.isProcessing.set(true);
    this.error.set(null);
    this.complaintsService.create(this.formSubject(), this.formDescription(), this.formCategory() || undefined, this.formGroup() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (complaint) => {
          const mapped = this.toComplaint(complaint);
          this.complaints.update(list => [mapped, ...list]);
          this.lastRef.set(mapped.ref);
          this.isProcessing.set(false);
          this.view.set('success');
        },
        error: () => {
          this.error.set(this.language() === 'fr' ? 'Impossible de soumettre la reclamation.' : 'Unable to submit complaint.');
          this.isProcessing.set(false);
        },
      });
  }

  categoryLabel(cat: ComplaintCategory): string { return this.categories().find(c => c.value === cat)?.label ?? cat; }
  statusLabel(s: ComplaintStatus): string {
    const l = this.labels();
    return ({ open: l.statusOpen, in_progress: l.statusInProgress, resolved: l.statusResolved, closed: l.statusClosed } as Record<ComplaintStatus, string>)[s];
  }
  priorityLabel(p: ComplaintPriority): string { const l = this.labels(); return p === 'high' ? l.priorityHigh : p === 'low' ? l.priorityLow : l.priorityMedium; }
  subjectDisplay(c: Complaint): string { return this.language() === 'fr' ? c.subjectFr : c.subject; }
  responseDisplay(c: Complaint): string | undefined { return this.language() === 'fr' ? c.responseFr : c.response; }
  timelineLabel(e: TimelineEvent): string { return this.language() === 'fr' ? e.labelFr : e.label; }
  formatDate(iso: string): string { return new Date(iso).toLocaleDateString(this.language() === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

  private toComplaint(complaint: ApiComplaint): Complaint {
    const created = complaint.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10);
    const category = this.toCategory(complaint.category);
    return {
      id: complaint.id, ref: `CMP-${complaint.id}`, category, group: complaint.groupId || '-', subject: complaint.subject, subjectFr: complaint.subject,
      description: complaint.description, descFr: complaint.description, status: this.toLocalStatus(complaint.status), priority: 'medium', submittedAt: created, updatedAt: created,
      timeline: [{ date: created, label: 'Complaint submitted', labelFr: 'Reclamation soumise' }],
    };
  }

  private toCategory(category?: string): ComplaintCategory {
    const allowed: ComplaintCategory[] = ['payment', 'payout', 'member', 'leader', 'meeting', 'other'];
    return allowed.includes(category as ComplaintCategory) ? category as ComplaintCategory : 'other';
  }

  private toLocalStatus(status: ApiComplaint['status']): ComplaintStatus {
    return ({ open: 'open', in_review: 'in_progress', resolved: 'resolved', rejected: 'closed' } as Record<ApiComplaint['status'], ComplaintStatus>)[status];
  }
}

export { ComplaintsComponent as Complaints };
