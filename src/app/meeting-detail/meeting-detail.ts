import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  LucideAngularModule, LucideIconProvider, LUCIDE_ICONS,
  Calendar, Clock, MapPin, Users, Video, ArrowLeft,
  CheckCircle, Circle, Download, FileText, Sparkles,
  Phone, MessageSquare, MoreVertical, Edit, Trash2,
} from 'lucide-angular';
import { Meeting, MeetingStatus } from '../meetings/meetings';

const ICONS = {
  Calendar, Clock, MapPin, Users, Video, ArrowLeft,
  CheckCircle, Circle, Download, FileText, Sparkles,
  Phone, MessageSquare, MoreVertical, Edit, Trash2,
};

type Lang = 'fr' | 'en';
type MeetingDetailTab = 'info' | 'agenda' | 'attendees' | 'notes' | 'ai';
type MeetingDetailTabItem = {
  value: MeetingDetailTab;
  label: string;
};

interface Attendee {
  id:     string;
  name:   string;
  phone:  string;
  avatar: string;
  paid:   boolean;
  present: boolean;
}

interface AgendaItem {
  id:        string;
  titleFr:   string;
  titleEn:   string;
  done:      boolean;
  duration:  number;
}

interface MeetingDetail extends Meeting {
  attendees:   Attendee[];
  agenda:      AgendaItem[];
  notesFr:     string;
  notesEn:     string;
  aiSummaryFr: string;
  aiSummaryEn: string;
}

const LABELS = {
  fr: {
    back:          'Retour',
    info:          'Informations',
    agenda:        'Ordre du jour',
    attendees:     'Participants',
    notes:         'Notes de réunion',
    aiSummary:     'Résumé IA',
    date:          'Date',
    time:          'Heure',
    duration:      'Durée',
    location:      'Lieu',
    type:          'Type',
    group:         'Groupe',
    virtual:       'Virtuelle',
    inPerson:      'Présentiel',
    min:           'min',
    present:       'présent',
    absent:        'absent',
    paid:          'à jour',
    unpaid:        'en retard',
    upcoming:      'À venir',
    ongoing:       'En cours',
    completed:     'Terminée',
    cancelled:     'Annulée',
    joinMeeting:   'Rejoindre',
    editMeeting:   'Modifier',
    cancelMeeting: 'Annuler',
    download:      'Télécharger le résumé',
    noNotes:       'Aucune note disponible.',
    noSummary:     'Le résumé IA sera disponible après la réunion.',
    today:         "Aujourd'hui",
    tomorrow:      'Demain',
    yesterday:     'Hier',
    of:            'sur',
    presents:      'présents',
  },
  en: {
    back:          'Back',
    info:          'Info',
    agenda:        'Agenda',
    attendees:     'Attendees',
    notes:         'Meeting Notes',
    aiSummary:     'AI Summary',
    date:          'Date',
    time:          'Time',
    duration:      'Duration',
    location:      'Location',
    type:          'Type',
    group:         'Group',
    virtual:       'Virtual',
    inPerson:      'In person',
    min:           'min',
    present:       'present',
    absent:        'absent',
    paid:          'up to date',
    unpaid:        'overdue',
    upcoming:      'Upcoming',
    ongoing:       'Ongoing',
    completed:     'Completed',
    cancelled:     'Cancelled',
    joinMeeting:   'Join',
    editMeeting:   'Edit',
    cancelMeeting: 'Cancel',
    download:      'Download summary',
    noNotes:       'No notes available.',
    noSummary:     'AI summary will be available after the meeting.',
    today:         'Today',
    tomorrow:      'Tomorrow',
    yesterday:     'Yesterday',
    of:            'of',
    presents:      'present',
  },
} as const;

const now = Date.now();

const MOCK_DETAILS: Record<string, MeetingDetail> = {
  m1: {
    id: 'm1', groupId: 'g1', groupName: 'Tontine Famille', groupColor: '#1B3A2D',
    titleFr: 'Réunion mensuelle — Juillet', titleEn: 'Monthly Meeting — July',
    date: new Date(now + 3_600_000 * 3), durationMin: 90,
    locationFr: 'Google Meet', locationEn: 'Google Meet',
    isVirtual: true, status: 'upcoming',
    attendeeCount: 3, totalMembers: 5, hasAiSummary: false,
    attendees: [
      { id: 'a1', name: 'Marie Nguema',    phone: '+237 6 70 00 01', avatar: 'MN', paid: true,  present: true  },
      { id: 'a2', name: 'Paul Biya Jr.',   phone: '+237 6 70 00 02', avatar: 'PB', paid: true,  present: true  },
      { id: 'a3', name: 'Élise Fotso',     phone: '+237 6 70 00 03', avatar: 'EF', paid: false, present: true  },
      { id: 'a4', name: 'Jean-Marc Essoh', phone: '+237 6 70 00 04', avatar: 'JE', paid: true,  present: false },
      { id: 'a5', name: 'Carine Mbassi',   phone: '+237 6 70 00 05', avatar: 'CM', paid: false, present: false },
    ],
    agenda: [
      { id: 'ag1', titleFr: 'Tour de table et présences',        titleEn: 'Roll call',                     done: false, duration: 10 },
      { id: 'ag2', titleFr: 'Collecte des cotisations du mois',  titleEn: 'Monthly contribution collection', done: false, duration: 20 },
      { id: 'ag3', titleFr: 'Désignation du bénéficiaire',       titleEn: 'Beneficiary selection',          done: false, duration: 15 },
      { id: 'ag4', titleFr: 'Discussion des pénalités en retard', titleEn: 'Late penalties discussion',      done: false, duration: 20 },
      { id: 'ag5', titleFr: 'Questions diverses',                 titleEn: 'Any other business',            done: false, duration: 25 },
    ],
    notesFr:     '',
    notesEn:     '',
    aiSummaryFr: '',
    aiSummaryEn: '',
  },
  m4: {
    id: 'm4', groupId: 'g1', groupName: 'Tontine Famille', groupColor: '#1B3A2D',
    titleFr: 'Réunion mensuelle — Juin', titleEn: 'Monthly Meeting — June',
    date: new Date(now - 86_400_000 * 5), durationMin: 90,
    locationFr: 'Google Meet', locationEn: 'Google Meet',
    isVirtual: true, status: 'completed',
    attendeeCount: 4, totalMembers: 5, hasAiSummary: true,
    attendees: [
      { id: 'a1', name: 'Marie Nguema',    phone: '+237 6 70 00 01', avatar: 'MN', paid: true,  present: true  },
      { id: 'a2', name: 'Paul Biya Jr.',   phone: '+237 6 70 00 02', avatar: 'PB', paid: true,  present: true  },
      { id: 'a3', name: 'Élise Fotso',     phone: '+237 6 70 00 03', avatar: 'EF', paid: true,  present: true  },
      { id: 'a4', name: 'Jean-Marc Essoh', phone: '+237 6 70 00 04', avatar: 'JE', paid: true,  present: true  },
      { id: 'a5', name: 'Carine Mbassi',   phone: '+237 6 70 00 05', avatar: 'CM', paid: false, present: false },
    ],
    agenda: [
      { id: 'ag1', titleFr: 'Tour de table et présences',        titleEn: 'Roll call',                     done: true, duration: 10 },
      { id: 'ag2', titleFr: 'Collecte des cotisations du mois',  titleEn: 'Monthly contribution collection', done: true, duration: 20 },
      { id: 'ag3', titleFr: 'Désignation du bénéficiaire',       titleEn: 'Beneficiary selection',          done: true, duration: 15 },
      { id: 'ag4', titleFr: 'Discussion des pénalités en retard', titleEn: 'Late penalties discussion',      done: true, duration: 20 },
      { id: 'ag5', titleFr: 'Questions diverses',                 titleEn: 'Any other business',            done: false, duration: 25 },
    ],
    notesFr: 'La réunion s\'est déroulée normalement. Élise Fotso a été désignée comme bénéficiaire du mois de juin. Carine Mbassi est absente et doit payer une pénalité de 2 000 XAF. Prochaine réunion prévue le 15 juillet.',
    notesEn: 'The meeting went smoothly. Élise Fotso was selected as the June beneficiary. Carine Mbassi was absent and owes a 2,000 XAF penalty. Next meeting scheduled for July 15th.',
    aiSummaryFr: '**Points clés :** La réunion de juin a réuni 4 membres sur 5. Élise Fotso a reçu le versement mensuel de 50 000 XAF. Une pénalité de 2 000 XAF a été infligée à Carine Mbassi pour absence injustifiée. Le groupe reste en bonne santé financière avec un taux de recouvrement de 80%.',
    aiSummaryEn: '**Key points:** The June meeting gathered 4 of 5 members. Élise Fotso received the monthly payout of 50,000 XAF. A 2,000 XAF penalty was issued to Carine Mbassi for unjustified absence. The group remains financially healthy with an 80% collection rate.',
  },
};

// Fallback for IDs not in mock
function buildFallback(id: string): MeetingDetail {
  return {
    id, groupId: 'g1', groupName: 'Groupe', groupColor: '#4A7C59',
    titleFr: 'Réunion', titleEn: 'Meeting',
    date: new Date(), durationMin: 60,
    locationFr: 'À définir', locationEn: 'TBD',
    isVirtual: false, status: 'upcoming',
    attendeeCount: 0, totalMembers: 0, hasAiSummary: false,
    attendees: [], agenda: [],
    notesFr: '', notesEn: '', aiSummaryFr: '', aiSummaryEn: '',
  };
}

@Component({
  selector: 'app-meeting-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(ICONS) },
  ],
  templateUrl: './meeting-detail.html',
  styleUrls: ['./meeting-detail.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeetingDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  language    = signal<Lang>('fr');
  activeTab   = signal<MeetingDetailTab>('info');
  meeting     = signal<MeetingDetail | null>(null);
  icons       = ICONS;

  labels = computed(() => LABELS[this.language()]);

  tabs = computed<MeetingDetailTabItem[]>(() => {
    const l = this.labels();
    const m = this.meeting();
    const base: MeetingDetailTabItem[] = [
      { value: 'info', label: l.info },
      { value: 'agenda', label: l.agenda },
      { value: 'attendees', label: l.attendees },
      { value: 'notes', label: l.notes },
    ];
    if (m?.hasAiSummary) base.push({ value: 'ai', label: l.aiSummary });
    return base;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.meeting.set(MOCK_DETAILS[id] ?? buildFallback(id));
  }

  title(m: MeetingDetail)     { return this.language() === 'fr' ? m.titleFr     : m.titleEn; }
  location(m: MeetingDetail)  { return this.language() === 'fr' ? m.locationFr  : m.locationEn; }
  notes(m: MeetingDetail)     { return this.language() === 'fr' ? m.notesFr     : m.notesEn; }
  aiSummary(m: MeetingDetail) { return this.language() === 'fr' ? m.aiSummaryFr : m.aiSummaryEn; }
  agendaTitle(a: AgendaItem)  { return this.language() === 'fr' ? a.titleFr     : a.titleEn; }

  statusLabel(s: MeetingStatus): string {
    const l = this.labels();
    return ({ upcoming: l.upcoming, ongoing: l.ongoing, completed: l.completed, cancelled: l.cancelled })[s];
  }

  formatDate(date: Date): string {
    const diff = Math.round((date.getTime() - Date.now()) / 86_400_000);
    const l    = this.labels();
    if (diff === 0)  return l.today;
    if (diff === 1)  return l.tomorrow;
    if (diff === -1) return l.yesterday;
    return date.toLocaleDateString(
      this.language() === 'fr' ? 'fr-FR' : 'en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString(
      this.language() === 'fr' ? 'fr-FR' : 'en-GB',
      { hour: '2-digit', minute: '2-digit' }
    );
  }

  presentCount(m: MeetingDetail): number {
    return m.attendees.filter(a => a.present).length;
  }

  goBack() { this.router.navigate(['/app/meetings']); }

  downloadSummary() {
    const m = this.meeting();
    if (!m) return;
    const content = this.aiSummary(m) || this.notes(m);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${this.title(m).replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export { MeetingDetailComponent as MeetingDetail };
