import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, LucideIconProvider, LUCIDE_ICONS, Video, Calendar, Sparkles, Upload, Mic, FileText, Clock, Plus, ChevronRight, CheckCircle, Circle, X, Users } from 'lucide-angular';
import { marked } from 'marked';
import { MeetingsService } from '../core/services/meetings.service';
import { GroupsApiService } from '../core/services/groups.api.service';
import { LanguageService } from '../core/services/language.service';
import { TokenService } from '../core/services/token.service';
import { Meeting, Group } from '../core/models/models';

interface MeetingWithGroup extends Meeting { 
  groupName: string; 
  groupId: string; 
}

type MeetingFilter = 'all' | 'upcoming' | 'completed';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Calendar, Sparkles, Video, Upload, Mic, FileText, Clock, Plus, ChevronRight, CheckCircle, Circle, X, Users }) }],
  templateUrl: './meetings.html',
  styleUrls: ['./meetings.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeetingsComponent {
  private readonly router = inject(Router);
  private readonly meetingsService = inject(MeetingsService);
  private readonly groupsApiService = inject(GroupsApiService);
  private readonly languageService = inject(LanguageService);
  private readonly tokenService = inject(TokenService);
  private readonly destroyRef = inject(DestroyRef);

  language = this.languageService.language;
  activeFilter = signal<MeetingFilter>('all');
  loading = signal(false);
  error = signal<string | null>(null);
  allMeetings = signal<MeetingWithGroup[]>([]);
  myGroups = signal<Group[]>([]);

  showCreateModal = signal(false);
  selectedGroupId = signal('');
  newTitle = signal('');
  newDate = signal('');
  newDuration = signal('60');
  newMode = signal<'physical' | 'online'>('physical');   // Added
  newLink = signal('');                                 // Added

  creating = signal(false);
  createError = signal('');

  showCompleteModal = signal(false);
  completingMeeting = signal<MeetingWithGroup | null>(null);
  completeNotes = signal('');
  completing = signal(false);

  showSummaryModal = signal(false);
  summaryMeeting = signal<MeetingWithGroup | null>(null);
  showSummaryView = signal(false);
  viewingSummary = signal<MeetingWithGroup | null>(null);
  summaryMode = signal<'manual' | 'ai' | null>(null);
  manualSummary = signal('');
  selectedAudioFile = signal<File | null>(null);
  generatingSummary = signal(false);
  summaryError = signal('');

  openSummaryModal(m: MeetingWithGroup): void {
    this.summaryMeeting.set(m);
    this.summaryMode.set(null);
    this.manualSummary.set('');
    this.selectedAudioFile.set(null);
    this.summaryError.set('');
    this.showSummaryModal.set(true);
  }

  openSummaryView(m: MeetingWithGroup): void {
    this.viewingSummary.set(m);
    this.showSummaryView.set(true);
  }

  renderMarkdown(text: string): string {
    return marked(text ?? '') as string;
  }

  onAudioFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedAudioFile.set(input.files[0]);
      this.summaryError.set('');
    }
  }

  submitManualSummary(): void {
    const m = this.summaryMeeting();
    if (!m || !this.manualSummary().trim()) return;
    this.generatingSummary.set(true);
    this.meetingsService.saveSummary(m.groupId, m.id, this.manualSummary())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.allMeetings.update(ms => ms.map(x => x.id === m.id ? { ...x, aiSummary: updated.aiSummary, hasAiSummary: true } : x));
          this.generatingSummary.set(false);
          this.showSummaryModal.set(false);
        },
        error: () => { this.summaryError.set('Error saving summary.'); this.generatingSummary.set(false); }
      });
  }

  submitAudioSummary(): void {
    const m = this.summaryMeeting();
    const file = this.selectedAudioFile();
    if (!m || !file) return;
    this.generatingSummary.set(true);
    this.summaryError.set('');
    this.meetingsService.summarizeAudio(m.groupId, m.id, file, this.language())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.allMeetings.update(ms => ms.map(x => x.id === m.id ? { ...x, aiSummary: updated.aiSummary, hasAiSummary: true } : x));
          this.generatingSummary.set(false);
          this.showSummaryModal.set(false);
        },
        error: () => { this.summaryError.set('Error processing audio.'); this.generatingSummary.set(false); }
      });
  }

  readonly currentUserId = computed(() => this.tokenService.getUser()?.id);

  readonly isLeaderOf = computed(() => {
    const userId = this.currentUserId();
    return new Set(this.myGroups().filter(g => g.leaderId === userId).map(g => g.id));
  });

  readonly filteredMeetings = computed(() => {
    const f = this.activeFilter();
    return this.allMeetings().filter(m => {
      if (f === 'upcoming') return m.status === 'upcoming';
      if (f === 'completed') return m.status === 'completed';
      return true;
    }).sort((a, b) => {
      const aDate = new Date(a.meetingDate ?? a.date ?? '').getTime();
      const bDate = new Date(b.meetingDate ?? b.date ?? '').getTime();
      return a.status === 'upcoming' ? aDate - bDate : bDate - aDate;
    });
  });

  ngOnInit(): void {
  this.loading.set(true);
  this.groupsApiService.getMyGroups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (groups) => {
      console.log('Groups loaded:', groups);
      this.myGroups.set(groups);
      if (groups.length === 0) { this.loading.set(false); return; }
      
      const all: MeetingWithGroup[] = [];
      let loaded = 0;
      const total = groups.length;

      groups.forEach(group => {
        console.log('Loading meetings for group:', group.id, group.name);
        this.meetingsService.getByGroup(group.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (meetings) => {
            console.log('Meetings for group', group.name, ':', meetings);
            meetings.forEach(m => all.push({ ...m, groupName: group.name, groupId: group.id }));
          },
          error: (err) => { console.error('Error loading meetings for group', group.name, err); },
          complete: () => {
            loaded++;
            console.log('Completed', loaded, '/', total);
            if (loaded === total) {
              console.log('All meetings:', all);
              this.allMeetings.set([...all]);
              this.loading.set(false);
            }
          }
        });
      });
    },
    error: (err) => { console.error('Error loading groups:', err); this.loading.set(false); }
  });
}

  openCreate(): void {
    this.showCreateModal.set(true);
    this.selectedGroupId.set(this.myGroups().find(g => this.isLeaderOf().has(g.id))?.id ?? '');
    this.newTitle.set('');
    this.newDate.set('');
    this.newDuration.set('60');
    this.newMode.set('physical');      // Added
    this.newLink.set('');              // Added
    this.createError.set('');
  }

  submitCreate(): void {
    if (!this.newTitle().trim() || !this.newDate() || !this.selectedGroupId()) {
      this.createError.set(this.language() === 'fr' ? 'Remplissez tous les champs.' : 'Fill in all fields.');
      return;
    }
    this.creating.set(true);
    this.meetingsService.create(
      this.selectedGroupId(), 
      this.newTitle(), 
      this.newDate(), 
      parseInt(this.newDuration()) || undefined,
      this.newMode(),
      this.newLink() || undefined
    )
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (meeting) => {
          const group = this.myGroups().find(g => g.id === this.selectedGroupId());
          this.allMeetings.update(ms => [{ ...meeting, groupName: group?.name ?? '', groupId: this.selectedGroupId() }, ...ms]);
          this.creating.set(false);
          this.showCreateModal.set(false);
        },
        error: () => { this.createError.set('Failed to create meeting.'); this.creating.set(false); }
      });
  }

  openComplete(m: MeetingWithGroup): void {
    this.completingMeeting.set(m);
    this.completeNotes.set('');
    this.showCompleteModal.set(true);
  }

  submitComplete(): void {
    const m = this.completingMeeting();
    if (!m) return;
    this.completing.set(true);
    this.meetingsService.complete(m.groupId, m.id, this.completeNotes() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          const updated = { ...m, status: 'completed' as any, hasAiSummary: false };
          this.allMeetings.update(ms => ms.map(x => x.id === m.id ? updated : x));
          this.completing.set(false);
          this.showCompleteModal.set(false);
          this.openSummaryModal(updated as MeetingWithGroup);
        },
        error: () => { this.completing.set(false); }
      });
  }

  formatDate(iso: string): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString(this.language() === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatTime(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString(this.language() === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  statusLabel(status: string): string {
    const map: Record<string, { fr: string; en: string }> = {
      upcoming: { fr: 'À venir', en: 'Upcoming' },
      completed: { fr: 'Terminée', en: 'Completed' },
      cancelled: { fr: 'Annulée', en: 'Cancelled' },
    };
    return (this.language() === 'fr' ? map[status]?.fr : map[status]?.en) ?? status;
  }
}

export { MeetingsComponent as Meetings };