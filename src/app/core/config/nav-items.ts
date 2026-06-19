export interface NavItem {
  path: string;
  iconName: string; // lucide icon name, kebab-case
  labelEn: string;
  labelFr: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/app/dashboard', iconName: 'layout-dashboard', labelEn: 'Dashboard', labelFr: 'Tableau de bord' },
  { path: '/app/communities', iconName: 'users-round', labelEn: 'Communities', labelFr: 'Communautés' },
  { path: '/app/my-groups', iconName: 'circle-dollar-sign', labelEn: 'My Groups', labelFr: 'Mes groupes' },
  { path: '/app/wallet', iconName: 'wallet', labelEn: 'Wallet', labelFr: 'Portefeuille' },
  { path: '/app/notifications', iconName: 'bell', labelEn: 'Notifications', labelFr: 'Notifications' },
];