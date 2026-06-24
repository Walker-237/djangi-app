import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';

type Lang = 'fr' | 'en';

const ADMIN_LABELS = {
  fr: {
    overview: 'Vue plateforme',
    users: 'Utilisateurs',
    activeGroups: 'Groupes actifs',
    volume: 'Volume transactions',
    openComplaints: 'Reclamations ouvertes',
    communities: 'Communautes',
    recentActivity: 'Activite recente',
    monthlySignups: 'Inscriptions mensuelles',
    search: 'Rechercher',
    role: 'Role',
    status: 'Statut',
    joined: 'Inscrit le',
    actions: 'Actions',
    view: 'Voir',
    suspend: 'Suspendre',
    verify: 'Verifier',
    creator: 'Createur',
    members: 'Membres',
    groups: 'Groupes',
    created: 'Cree le',
    approve: 'Approuver',
    delete: 'Supprimer',
    leader: 'Leader',
    amount: 'Montant',
    cycle: 'Cycle',
    assignee: 'Assigne a',
    resolution: 'Note de resolution',
    update: 'Mettre a jour',
    reports: 'Rapports',
    download: 'Telecharger',
    settings: 'Parametres',
    save: 'Enregistrer',
  },
  en: {
    overview: 'Platform overview',
    users: 'Users',
    activeGroups: 'Active groups',
    volume: 'Transaction volume',
    openComplaints: 'Open complaints',
    communities: 'Communities',
    recentActivity: 'Recent activity',
    monthlySignups: 'Monthly signups',
    search: 'Search',
    role: 'Role',
    status: 'Status',
    joined: 'Joined',
    actions: 'Actions',
    view: 'View',
    suspend: 'Suspend',
    verify: 'Verify',
    creator: 'Creator',
    members: 'Members',
    groups: 'Groups',
    created: 'Created',
    approve: 'Approve',
    delete: 'Delete',
    leader: 'Leader',
    amount: 'Amount',
    cycle: 'Cycle',
    assignee: 'Assigned to',
    resolution: 'Resolution note',
    update: 'Update',
    reports: 'Reports',
    download: 'Download',
    settings: 'Settings',
    save: 'Save',
  },
} as const;

const adminBaseStyles = `
  .adm-page { padding: 2rem; color: #1B3A2D; }
  .adm-title { margin: 0 0 1.25rem; font-size: 2rem; line-height: 1.1; }
  .adm-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1rem; }
  .adm-card, .admu-card, .admc-card, .admg-card, .admcp-card, .admr-card, .adms-card { background: #FFFFFF; border-radius: 1.25rem; box-shadow: 0 4px 16px rgba(27,58,45,.10); }
  .adm-card { padding: 1rem; }
  .adm-label { display: block; color: #6B7280; font-size: .78rem; font-weight: 800; text-transform: uppercase; }
  .adm-value { display: block; margin-top: .45rem; font-size: 1.45rem; font-weight: 900; }
  .adm-panels { display: grid; grid-template-columns: 1.3fr .7fr; gap: 1rem; margin-top: 1rem; }
  .adm-panel { padding: 1.25rem; }
  .adm-panel-title { margin: 0 0 1rem; font-size: 1rem; }
  .adm-chart { display: flex; align-items: end; gap: .7rem; min-height: 180px; }
  .adm-bar { flex: 1; min-height: 1rem; border-radius: .75rem .75rem 0 0; background: #4A7C59; }
  .adm-activity { display: grid; gap: .75rem; margin: 0; padding: 0; list-style: none; color: #374151; }
  .adm-table-wrap { overflow-x: auto; }
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th, .adm-table td { padding: .8rem; border-bottom: 1px solid #EFE7DC; text-align: left; white-space: nowrap; }
  .adm-table th { color: #6B7280; font-size: .75rem; text-transform: uppercase; }
  .adm-chip { display: inline-flex; border-radius: 999px; padding: .25rem .65rem; background: #EBF5EF; color: #1B3A2D; font-size: .8rem; font-weight: 800; }
  .adm-actions { display: flex; gap: .45rem; }
  .adm-btn { border: 0; border-radius: .7rem; padding: .55rem .75rem; background: #1B3A2D; color: #FFFFFF; font: inherit; font-size: .8rem; font-weight: 800; cursor: pointer; }
  .adm-btn--ghost { background: #EBF5EF; color: #1B3A2D; }
  .adm-btn--danger { background: #FDEDEB; color: #C0392B; }
  .admu-toolbar, .admcp-tools, .admr-grid, .adms-grid { display: flex; gap: .75rem; margin-bottom: 1rem; }
  .admu-input, .admu-select, .admcp-input, .adms-input { min-height: 2.75rem; border: 1px solid #E5DDD3; border-radius: .85rem; padding: 0 .85rem; background: #FFFFFF; color: #1B3A2D; font: inherit; }
  .admu-card, .admc-card, .admg-card, .admcp-card, .admr-card, .adms-card { padding: 1rem; }
  .admr-grid, .adms-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .admr-card, .adms-card { display: grid; gap: .7rem; }
`;

const users = [
  ['BK', 'Brice Kamga', '+237 6 77 24 18 90', 'Member', 'Active', '2024-01-12'],
  ['MN', 'Marie Nguema', '+237 6 90 11 48 22', 'Leader', 'Active', '2024-02-02'],
  ['AF', 'Aline Fotso', '+237 6 51 89 70 13', 'Member', 'Suspended', '2024-03-19'],
  ['JM', 'Jean Mbarga', '+237 6 98 15 39 44', 'Admin', 'Active', '2024-04-07'],
];

function labels(language: () => Lang) {
  return computed(() => ADMIN_LABELS[language()]);
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <section class="adm-page">
      <h1 class="adm-title">{{ l().overview }}</h1>
      <div class="adm-grid">
        @for (kpi of kpis; track kpi.label) {
          <article class="adm-card">
            <span class="adm-label">{{ kpi.label }}</span>
            <strong class="adm-value">{{ kpi.value }}</strong>
          </article>
        }
      </div>
      <div class="adm-panels">
        <article class="adm-card adm-panel">
          <h2 class="adm-panel-title">{{ l().monthlySignups }}</h2>
          <div class="adm-chart">
            @for (bar of bars; track bar.month) {
              <span class="adm-bar" [style.height.%]="bar.value"></span>
            }
          </div>
        </article>
        <article class="adm-card adm-panel">
          <h2 class="adm-panel-title">{{ l().recentActivity }}</h2>
          <ul class="adm-activity">
            @for (item of activity; track item) { <li>{{ item }}</li> }
          </ul>
        </article>
      </div>
    </section>
  `,
  styles: [adminBaseStyles],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminDashboardComponent {
  private readonly languageService = inject(LanguageService);
  l = labels(this.languageService.language);
  kpis = [
    { label: this.l().users, value: '12,480' },
    { label: this.l().activeGroups, value: '842' },
    { label: this.l().volume, value: '486M XAF' },
    { label: this.l().openComplaints, value: '27' },
    { label: this.l().communities, value: '136' },
  ];
  bars = [{ month: 'Jan', value: 42 }, { month: 'Feb', value: 55 }, { month: 'Mar', value: 68 }, { month: 'Apr', value: 61 }, { month: 'May', value: 78 }, { month: 'Jun', value: 88 }];
  activity = ['Marie Nguema verified a group payout', 'Douala Tech Njangi approved', 'Complaint CMP-00155 assigned', 'Financial report generated'];
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="adm-page">
      <h1 class="adm-title">{{ l().users }}</h1>
      <div class="admu-toolbar">
        <input class="admu-input" [placeholder]="l().search" [value]="query()" (input)="query.set($any($event.target).value)" />
        <select class="admu-select" [value]="role()" (change)="role.set($any($event.target).value)">
          <option value="all">{{ l().role }}</option>
          <option value="Member">Member</option>
          <option value="Leader">Leader</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <article class="admu-card adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>Avatar</th><th>{{ l().users }}</th><th>Phone</th><th>{{ l().role }}</th><th>{{ l().status }}</th><th>{{ l().joined }}</th><th>{{ l().actions }}</th></tr></thead>
          <tbody>
            @for (user of filtered(); track user[1]) {
              <tr><td><span class="adm-chip">{{ user[0] }}</span></td><td>{{ user[1] }}</td><td>{{ user[2] }}</td><td>{{ user[3] }}</td><td>{{ user[4] }}</td><td>{{ user[5] }}</td><td class="adm-actions"><button class="adm-btn adm-btn--ghost">{{ l().view }}</button><button class="adm-btn adm-btn--danger">{{ l().suspend }}</button><button class="adm-btn">{{ l().verify }}</button></td></tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
  styles: [adminBaseStyles],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminUsersComponent {
  private readonly languageService = inject(LanguageService);
  l = labels(this.languageService.language);
  query = signal('');
  role = signal('all');
  filtered = computed(() => users.filter((user) => (this.role() === 'all' || user[3] === this.role()) && user.join(' ').toLowerCase().includes(this.query().toLowerCase())));
}

@Component({
  selector: 'app-admin-communities',
  standalone: true,
  template: `
    <section class="adm-page">
      <h1 class="adm-title">{{ l().communities }}</h1>
      <article class="admc-card adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>{{ l().communities }}</th><th>{{ l().creator }}</th><th>{{ l().members }}</th><th>{{ l().groups }}</th><th>{{ l().status }}</th><th>{{ l().created }}</th><th>{{ l().actions }}</th></tr></thead>
          <tbody>
            @for (row of rows; track row[0]) {
              <tr><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td>{{ row[2] }}</td><td>{{ row[3] }}</td><td><span class="adm-chip">{{ row[4] }}</span></td><td>{{ row[5] }}</td><td class="adm-actions"><button class="adm-btn">{{ l().approve }}</button><button class="adm-btn adm-btn--danger">{{ l().delete }}</button></td></tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
  styles: [adminBaseStyles],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminCommunitiesComponent {
  private readonly languageService = inject(LanguageService);
  l = labels(this.languageService.language);
  rows = [['Bamenda Traders', 'Nadine Taku', '324', '18', 'Pending', '2026-06-05'], ['Douala Tech Njangi', 'Kevin Mballa', '142', '9', 'Approved', '2026-05-11'], ['Famille Beti', 'Marie Nguema', '81', '6', 'Approved', '2026-04-29']];
}

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  template: `
    <section class="adm-page">
      <h1 class="adm-title">{{ l().groups }}</h1>
      <article class="admg-card adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>{{ l().groups }}</th><th>{{ l().communities }}</th><th>{{ l().leader }}</th><th>{{ l().members }}</th><th>{{ l().amount }}</th><th>{{ l().cycle }}</th><th>{{ l().status }}</th></tr></thead>
          <tbody>
            @for (row of rows; track row[0]) {
              <tr><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td>{{ row[2] }}</td><td>{{ row[3] }}</td><td>{{ row[4] }}</td><td>{{ row[5] }}</td><td><span class="adm-chip">{{ row[6] }}</span></td></tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
  styles: [adminBaseStyles],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminGroupsComponent {
  private readonly languageService = inject(LanguageService);
  l = labels(this.languageService.language);
  rows = [['Tontine Famille', 'Famille Beti', 'Marie Nguema', '12', '25 000 XAF', 'Monthly', 'Active'], ['Cercle Amis BTP', 'Bamenda Traders', 'Jean Mbarga', '9', '50 000 XAF', 'Biweekly', 'Active'], ['Njangi Pro', 'Douala Tech Njangi', 'Aline Fotso', '7', '100 000 XAF', 'Monthly', 'Review']];
}

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  template: `
    <section class="adm-page">
      <h1 class="adm-title">{{ l().openComplaints }}</h1>
      <article class="admcp-card adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>Ref</th><th>{{ l().groups }}</th><th>{{ l().status }}</th><th>{{ l().assignee }}</th><th>{{ l().resolution }}</th><th>{{ l().actions }}</th></tr></thead>
          <tbody>
            @for (row of rows; track row[0]) {
              <tr><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td><span class="adm-chip">{{ row[2] }}</span></td><td><input class="admcp-input" [value]="row[3]" /></td><td><input class="admcp-input" [placeholder]="l().resolution" /></td><td><button class="adm-btn">{{ l().update }}</button></td></tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
  styles: [adminBaseStyles],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminComplaintsComponent {
  private readonly languageService = inject(LanguageService);
  l = labels(this.languageService.language);
  rows = [['CMP-00155', 'Epargne Quartier', 'Open', 'Aline'], ['CMP-00142', 'Tontine Famille', 'In progress', 'Kevin'], ['CMP-00149', 'Tontine Famille', 'Escalated', 'Brice']];
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  template: `
    <section class="adm-page">
      <h1 class="adm-title">{{ l().reports }}</h1>
      <div class="admr-grid">
        @for (report of reports; track report.title) {
          <article class="admr-card">
            <strong>{{ report.title }}</strong>
            <span>{{ report.summary }}</span>
            <button class="adm-btn">{{ l().download }}</button>
          </article>
        }
      </div>
    </section>
  `,
  styles: [adminBaseStyles],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminReportsComponent {
  private readonly languageService = inject(LanguageService);
  l = labels(this.languageService.language);
  reports = [{ title: 'User report', summary: '12,480 active users' }, { title: 'Financial report', summary: '486M XAF processed' }, { title: 'Group activity report', summary: '842 active groups' }];
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  template: `
    <section class="adm-page">
      <h1 class="adm-title">{{ l().settings }}</h1>
      <div class="adms-grid">
        <article class="adms-card"><strong>Support phone</strong><input class="adms-input" value="+237 6 90 00 00 00" /><button class="adm-btn">{{ l().save }}</button></article>
        <article class="adms-card"><strong>Default currency</strong><input class="adms-input" value="XAF" /><button class="adm-btn">{{ l().save }}</button></article>
        <article class="adms-card"><strong>Complaint SLA</strong><input class="adms-input" value="48h" /><button class="adm-btn">{{ l().save }}</button></article>
      </div>
    </section>
  `,
  styles: [adminBaseStyles],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminSettingsComponent {
  private readonly languageService = inject(LanguageService);
  l = labels(this.languageService.language);
}

export { AdminDashboardComponent as AdminDashboard };
export { AdminUsersComponent as AdminUsers };
export { AdminCommunitiesComponent as AdminCommunities };
export { AdminGroupsComponent as AdminGroups };
export { AdminComplaintsComponent as AdminComplaints };
export { AdminReportsComponent as AdminReports };
export { AdminSettingsComponent as AdminSettings };
