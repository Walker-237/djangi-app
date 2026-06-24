export interface NavItem {
  path: string;
  iconName: string;
  labelEn: string;
  labelFr: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/app/dashboard', iconName: 'layout-dashboard', labelEn: 'Home', labelFr: 'Accueil' },
  { path: '/app/communities', iconName: 'users', labelEn: 'Communities', labelFr: 'Communautes' },
  { path: '/app/my-groups', iconName: 'circle-dollar-sign', labelEn: 'My Groups', labelFr: 'Mes groupes' },
  { path: '/app/wallet', iconName: 'wallet', labelEn: 'Wallet', labelFr: 'Portefeuille' },
  { path: '/app/meetings', iconName: 'calendar', labelEn: 'Meetings', labelFr: 'Reunions' },
  { path: '/app/notifications', iconName: 'bell', labelEn: 'Notifications', labelFr: 'Notifications' },
  { path: '/app/complaints', iconName: 'message-square', labelEn: 'Complaints', labelFr: 'Reclamations' },
];
