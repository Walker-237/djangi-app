import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { redirectAuthenticatedToDashboard } from './core/services/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
  {
    path: 'app',
    loadComponent: () =>
      import('./main-shell/main-shell').then((m) => m.MainShell),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'communities',
        loadComponent: () =>
          import('./communities/communities').then((m) => m.Communities),
      },
      {
        path: 'communities/create',
        loadComponent: () =>
          import('./create-community/create-community').then((m) => m.CreateCommunity),
      },
      {
        path: 'communities/all',
        redirectTo: 'communities',
      },
      {
        path: 'communities/:id',
        loadComponent: () =>
          import('./community-detail/community-detail').then((m) => m.CommunityDetail),
      },
      {
        path: 'my-groups',
        loadComponent: () =>
          import('./my-groups/my-groups').then((m) => m.MyGroups),
      },
      {
        path: 'my-groups/:id',
        loadComponent: () =>
          import('./group-detail/group-detail').then((m) => m.GroupDetail),
      },
      {
        path: 'wallet',
        loadComponent: () => import('./wallet/wallet').then((m) => m.Wallet),
      },
      {
        path: 'meetings',
        loadComponent: () =>
          import('./meetings/meetings').then((m) => m.Meetings),
      },
      {
        path: 'meetings/:id',
        loadComponent: () =>
          import('./meeting-detail/meeting-detail').then((m) => m.MeetingDetail),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notifications/notifications').then((m) => m.Notifications),
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./complaints/complaints').then((m) => m.Complaints),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile').then((m) => m.Profile),
      },
      {
        path: 'groups/create',
        loadComponent: () =>
          import('./create-group/create-group').then((m) => m.CreateGroup),
      },
      {
        path: 'groups/:id',
        loadComponent: () =>
          import('./group-detail/group-detail').then((m) => m.GroupDetail),
      },
      {
        path: 'groups/:id/contributions',
        loadComponent: () =>
          import('./contributions/contributions').then((m) => m.Contributions),
      },
      {
        path: 'groups/:id/payouts',
        loadComponent: () =>
          import('./payouts/payouts').then((m) => m.Payouts),
      },
      { path: 'groups/:id/meetings', redirectTo: 'meetings' },
      { path: 'groups/:id/meetings/:meetingId', redirectTo: 'meetings/:meetingId' },
    ],
  },
  {
    path: 'auth',
    canActivate: [redirectAuthenticatedToDashboard],
    canActivateChild: [redirectAuthenticatedToDashboard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./auth/auth').then((m) => m.Auth),
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/auth').then((m) => m.Auth),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-shell/admin-shell').then((m) => m.AdminShell),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/admin-pages/admin-pages').then((m) => m.AdminDashboard),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/admin-pages/admin-pages').then((m) => m.AdminUsers),
      },
      {
        path: 'communities',
        loadComponent: () =>
          import('./admin/admin-pages/admin-pages').then((m) => m.AdminCommunities),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./admin/admin-pages/admin-pages').then((m) => m.AdminGroups),
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./admin/admin-pages/admin-pages').then((m) => m.AdminComplaints),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/admin-pages/admin-pages').then((m) => m.AdminReports),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./admin/admin-pages/admin-pages').then((m) => m.AdminSettings),
      },
    ],
  },
  { path: '**', redirectTo: '/app/dashboard' },
];
