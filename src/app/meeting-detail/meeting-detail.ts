import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, LucideIconProvider, LUCIDE_ICONS, Calendar, Clock, ArrowLeft, CheckCircle, FileText, Sparkles, Users, RefreshCw, Video, Upload, Mic, Loader, X } from 'lucide-angular';
import { marked } from 'marked';
import { MeetingsService } from '../core/services/meetings.service';
import { LanguageService } from '../core/services/language.service';
import { TokenService } from '../core/services/token.service';
import { ApiService } from '../core/services/api.service';
import { Meeting } from '../core/models/models';

@Component({
  selector: 'app-meeting-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Calendar, Clock, ArrowLeft, CheckCircle, FileText, Sparkles, Users, RefreshCw, Video, Upload, Mic, Loader, X }) }],
  templateUrl: './meeting-detail.html',
  styleUrls: ['./meeting-detail.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeetingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meetingsService = inject(MeetingsService);
  private readonly languageService = inject(LanguageService);
  private readonly tokenService = inject(TokenService);
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  loading = signal(false);
  meeting = signal<Meeting | null>(null);
  groupId = signal('');

  generatingSummary = signal(false);
  summaryError = signal('');
  showAudioUpload = signal(false);
  selectedAudioFile = signal<File | null>(null);

  onAudioFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedAudioFile.set(input.files[0]);
      this.summaryError.set('');
    }
  }

  renderMarkdown(text: string): string {
    return marked(text ?? '') as string;
  }

  readonly isLeader = computed(() => {
    const user = this.tokenService.getUser();
    const m = this.meeting();
    if (!user || !m) return false;
    return (m as any).leaderId === user.id || this.tokenService.isAdmin();
  });

  ngOnInit(): void {
    const meetingId = this.route.snapshot.paramMap.get('id') ?? '';
    const groupId = this.route.snapshot.queryParamMap.get('groupId') ?? '';
    this.groupId.set(groupId);
    if (!meetingId || !groupId) return;
    this.loading.set(true);
    this.meetingsService.getById(groupId, meetingId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (m) => { this.meeting.set(m); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }

  async generateSummary(): Promise<void> {
    const m = this.meeting();
    if (!m) return;
    this.generatingSummary.set(true);
    this.summaryError.set('');

    try {
      const lang = this.language();
      const prompt = lang === 'fr'
        ? `Tu es un assistant pour une tontine (groupe d'épargne). Génère un résumé structuré de cette réunion de groupe en français.

Titre de la réunion: ${m.title}
Date: ${this.formatDate(m.meetingDate ?? m.date ?? '')}
Durée: ${m.durationMinutes ?? 'Non précisée'} minutes
Participants: ${m.attendeeCount ?? 'Non précisé'}
Notes du leader: ${m.notes ?? 'Aucune note fournie'}

Génère un résumé avec: points clés discutés, décisions prises, actions à suivre. Sois concis et professionnel.`
        : `You are an assistant for a tontine (savings group). Generate a structured summary of this group meeting in English.

Meeting title: ${m.title}
Date: ${this.formatDate(m.meetingDate ?? m.date ?? '')}
Duration: ${m.durationMinutes ?? 'Not specified'} minutes
Attendees: ${m.attendeeCount ?? 'Not specified'}
Leader notes: ${m.notes ?? 'No notes provided'}

Generate a summary with: key points discussed, decisions made, follow-up actions. Be concise and professional.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const summary = data.content?.[0]?.text ?? '';

      if (!summary) throw new Error('No summary generated');

      // Save to backend
      this.api.post<Meeting>(
        `/groups/${this.groupId()}/meetings/${m.id}/summarize`,
        { summary }
      ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (updated) => {
          this.meeting.set({ ...m, aiSummary: summary, hasAiSummary: true });
          this.generatingSummary.set(false);
        },
        error: () => {
          // Even if save fails, show the summary locally
          this.meeting.set({ ...m, aiSummary: summary, hasAiSummary: true });
          this.generatingSummary.set(false);
        },
      });

    } catch (err) {
      this.summaryError.set(this.language() === 'fr'
        ? 'Erreur lors de la génération du résumé.'
        : 'Error generating summary.');
      this.generatingSummary.set(false);
    }
  }

  formatDate(iso: string): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString(
      this.language() === 'fr' ? 'fr-FR' : 'en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
  }

  formatTime(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString(
      this.language() === 'fr' ? 'fr-FR' : 'en-GB',
      { hour: '2-digit', minute: '2-digit' }
    );
  }

  statusLabel(status: string): string {
    const map: Record<string, { fr: string; en: string }> = {
      upcoming: { fr: 'À venir', en: 'Upcoming' },
      completed: { fr: 'Terminée', en: 'Completed' },
      cancelled: { fr: 'Annulée', en: 'Cancelled' },
    };
    return (this.language() === 'fr' ? map[status]?.fr : map[status]?.en) ?? status;
  }

  uploadAndSummarize(m: Meeting): void {
    const file = this.selectedAudioFile();
    if (!file) return;

    this.generatingSummary.set(true);
    this.summaryError.set('');

    this.meetingsService.summarizeAudio(this.groupId(), m.id, file, this.language())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.meeting.set({ ...m, aiSummary: updated.aiSummary, hasAiSummary: true });
          this.generatingSummary.set(false);
          this.showAudioUpload.set(false);
          this.selectedAudioFile.set(null);
        },
        error: () => {
          this.summaryError.set(this.language() === 'fr'
            ? 'Erreur lors du traitement audio.'
            : 'Error processing audio.');
          this.generatingSummary.set(false);
        },
      });
  }

  goBack(): void { this.router.navigate(['/app/meetings']); }
}

export { MeetingDetailComponent as MeetingDetail };