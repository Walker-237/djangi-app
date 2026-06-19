import { Routes } from '@angular/router';
import { hasStoredToken } from './core/services/auth-token';
import { redirectAuthenticatedToDashboard } from './core/services/auth.guards';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [redirectAuthenticatedToDashboard],
    canActivateChild: [redirectAuthenticatedToDashboard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/auth').then((m) => m.Auth),
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/auth').then((m) => m.Auth),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./main-shell/main-shell').then((m) => m.MainShell),
    children: [
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
        loadComponent: () =>
          import('./all-communities/all-communities').then((m) => m.AllCommunities),
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
        path: 'wallet',
        loadComponent: () => import('./wallet/wallet').then((m) => m.Wallet),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notifications/notifications').then(
            (m) => m.Notifications,
          ),
      },
      {
        path: 'groups/create',
        loadComponent: () =>
          import('./create-group/create-group').then((m) => m.CreateGroup),
      },
      {
        path: 'groups/:id',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./group-detail/group-detail').then(
                (m) => m.GroupDetail,
              ),
          },
          {
            path: 'contributions',
            loadComponent: () =>
              import('./contributions/contributions').then(
                (m) => m.Contributions,
              ),
          },
          {
            path: 'payouts',
            loadComponent: () =>
              import('./payouts/payouts').then((m) => m.Payouts),
          },
          {
            path: 'meetings',
            loadComponent: () =>
              import('./meetings/meetings').then((m) => m.Meetings),
          },
          {
            path: 'meetings/:meetingId',
            loadComponent: () =>
              import('./meeting-detail/meeting-detail').then(
                (m) => m.MeetingDetail,
              ),
          },
        ],
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./complaints/complaints').then((m) => m.Complaints),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    redirectTo: () => (hasStoredToken() ? '/app/dashboard' : '/auth/login'),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: () => (hasStoredToken() ? '/app/dashboard' : '/auth/login'),
  },
];
