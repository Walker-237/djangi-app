import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  LucideAngularModule, LucideIconProvider, LUCIDE_ICONS,
  Calendar, Clock, MapPin, Users, Video, Plus,
  ChevronRight, Filter, CheckCircle, Circle, AlertCircle, X,
} from 'lucide-angular';

const ICONS = {
  Calendar, Clock, MapPin, Users, Video, Plus,
  ChevronRight, Filter, CheckCircle, Circle, AlertCircle, X,
};

type Lang = 'fr' | 'en';
export type MeetingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type MeetingFilter = 'all' | 'upcoming' | 'completed';

export interface Meeting {
  id:            string;
  groupId:       string;
  groupName:     string;
  groupColor:    string;
  titleFr:       string;
  titleEn:       string;
  date:          Date;
  durationMin:   number;
  locationFr:    string;
  locationEn:    string;
  isVirtual:     boolean;
  status:        MeetingStatus;
  attendeeCount: number;
  totalMembers:  number;
  hasAiSummary:  boolean;
}

const LABELS = {
  fr: {
    pageTitle:       'Réunions',
    newMeeting:      'Planifier',
    filterAll:       'Toutes',
    filterUpcoming:  'À venir',
    filterCompleted: 'Terminées',
    upcoming:        'À venir',
    ongoing:         'En cours',
    completed:       'Terminée',
    cancelled:       'Annulée',
    virtual:         'Virtuelle',
    inPerson:        'Présentiel',
    attendees:       'participants',
    aiSummary:       'Résumé IA disponible',
    noMeetings:      'Aucune réunion',
    noMeetingsDesc:  'Aucune réunion pour ce filtre.',
    today:           "Aujourd'hui",
    tomorrow:        'Demain',
    yesterday:       'Hier',
    min:             'min',
    scheduleNew:     'Planifier une réunion',
  },
  en: {
    pageTitle:       'Meetings',
    newMeeting:      'Schedule',
    filterAll:       'All',
    filterUpcoming:  'Upcoming',
    filterCompleted: 'Completed',
    upcoming:        'Upcoming',
    ongoing:         'Ongoing',
    completed:       'Completed',
    cancelled:       'Cancelled',
    virtual:         'Virtual',
    inPerson:        'In person',
    attendees:       'attendees',
    aiSummary:       'AI summary available',
    noMeetings:      'No meetings',
    noMeetingsDesc:  'No meetings for this filter.',
    today:           'Today',
    tomorrow:        'Tomorrow',
    yesterday:       'Yesterday',
    min:             'min',
    scheduleNew:     'Schedule a meeting',
  },
} as const;

const now = Date.now();

const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1', groupId: 'g1', groupName: 'Tontine Famille', groupColor: '#1B3A2D',
    titleFr: 'Réunion mensuelle — Juillet', titleEn: 'Monthly Meeting — July',
    date: new Date(now + 3_600_000 * 3), durationMin: 90,
    locationFr: 'Google Meet', locationEn: 'Google Meet',
    isVirtual: true, status: 'upcoming',
    attendeeCount: 3, totalMembers: 5, hasAiSummary: false,
  },
  {
    id: 'm2', groupId: 'g2', groupName: 'Cercle Amis BTP', groupColor: '#4A7C59',
    titleFr: "Réunion d'urgence", titleEn: 'Emergency Meeting',
    date: new Date(now + 86_400_000 * 2), durationMin: 60,
    locationFr: 'Salle de conférence Akwa', locationEn: 'Akwa Conference Room',
    isVirtual: false, status: 'upcoming',
    attendeeCount: 0, totalMembers: 6, hasAiSummary: false,
  },
  {
    id: 'm3', groupId: 'g3', groupName: 'Njangi Pro', groupColor: '#C0392B',
    titleFr: 'Réunion planification T3', titleEn: 'Q3 Planning Meeting',
    date: new Date(now + 86_400_000 * 7), durationMin: 120,
    locationFr: 'WhatsApp Call', locationEn: 'WhatsApp Call',
    isVirtual: true, status: 'upcoming',
    attendeeCount: 0, totalMembers: 5, hasAiSummary: false,
  },
  {
    id: 'm4', groupId: 'g1', groupName: 'Tontine Famille', groupColor: '#1B3A2D',
    titleFr: 'Réunion mensuelle — Juin', titleEn: 'Monthly Meeting — June',
    date: new Date(now - 86_400_000 * 5), durationMin: 90,
    locationFr: 'Google Meet', locationEn: 'Google Meet',
    isVirtual: true, status: 'completed',
    attendeeCount: 4, totalMembers: 5, hasAiSummary: true,
  },
  {
    id: 'm5', groupId: 'g2', groupName: 'Cercle Amis BTP', groupColor: '#4A7C59',
    titleFr: 'Réunion mensuelle — Juin', titleEn: 'Monthly Meeting — June',
    date: new Date(now - 86_400_000 * 12), durationMin: 75,
    locationFr: 'Résidence Mbarga', locationEn: 'Mbarga Residence',
    isVirtual: false, status: 'completed',
    attendeeCount: 6, totalMembers: 6, hasAiSummary: true,
  },
  {
    id: 'm6', groupId: 'g4', groupName: 'Épargne Quartier', groupColor: '#2980B9',
    titleFr: 'Réunion annuelle', titleEn: 'Annual Meeting',
    date: new Date(now - 86_400_000 * 20), durationMin: 180,
    locationFr: 'Salle paroissiale', locationEn: 'Parish Hall',
    isVirtual: false, status: 'completed',
    attendeeCount: 9, totalMembers: 10, hasAiSummary: false,
  },
  {
    id: 'm7', groupId: 'g3', groupName: 'Njangi Pro', groupColor: '#C0392B',
    titleFr: 'Réunion annulée', titleEn: 'Cancelled Meeting',
    date: new Date(now - 86_400_000 * 3), durationMin: 60,
    locationFr: 'Zoom', locationEn: 'Zoom',
    isVirtual: true, status: 'cancelled',
    attendeeCount: 0, totalMembers: 5, hasAiSummary: false,
  },
];

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(ICONS) },
  ],
  templateUrl: './meetings.html',
  styleUrls: ['./meetings.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeetingsComponent {
  private router = inject(Router);

  language     = signal<Lang>('fr');
  activeFilter = signal<MeetingFilter>('all');
  icons        = ICONS;

  labels = computed(() => LABELS[this.language()]);

  filters = computed(() => {
    const l = this.labels();
    return [
      { value: 'all'       as MeetingFilter, label: l.filterAll       },
      { value: 'upcoming'  as MeetingFilter, label: l.filterUpcoming  },
      { value: 'completed' as MeetingFilter, label: l.filterCompleted },
    ];
  });

  meetings = computed(() => {
    const f = this.activeFilter();
    return MOCK_MEETINGS.filter(m => {
      if (f === 'upcoming')  return m.status === 'upcoming' || m.status === 'ongoing';
      if (f === 'completed') return m.status === 'completed' || m.status === 'cancelled';
      return true;
    }).sort((a, b) => {
      const aUp = a.status === 'upcoming' || a.status === 'ongoing';
      const bUp = b.status === 'upcoming' || b.status === 'ongoing';
      if (aUp && !bUp) return -1;
      if (!aUp && bUp) return 1;
      return aUp
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    });
  });

  title(m: Meeting)    { return this.language() === 'fr' ? m.titleFr : m.titleEn; }
  location(m: Meeting) { return this.language() === 'fr' ? m.locationFr : m.locationEn; }

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
      { weekday: 'short', day: 'numeric', month: 'short' }
    );
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString(
      this.language() === 'fr' ? 'fr-FR' : 'en-GB',
      { hour: '2-digit', minute: '2-digit' }
    );
  }

  openDetail(id: string) {
    this.router.navigate(['/app/meetings', id]);
  }
}

export { MeetingsComponent as Meetings };