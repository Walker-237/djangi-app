import { Injectable, signal, computed } from '@angular/core';
import { Community, Group, GroupMember } from '../models/models';

const MOCK_MEMBERS: GroupMember[] = [
  { id: 'm1', name: 'Amina', initials: 'AM', status: 'next', position: 1 },
  { id: 'm2', name: 'Paul', initials: 'PL', status: 'paid', position: 2 },
  { id: 'm3', name: 'Grace', initials: 'GR', status: 'pending', position: 3 },
  { id: 'm4', name: 'Eric', initials: 'ER', status: 'pending', position: 4 },
  { id: 'm5', name: 'Fanta', initials: 'FN', status: 'pending', position: 5 },
];

const MOCK_MEMBERS_NONMEMBER: GroupMember[] = [
  { id: 'n1', name: 'Sophie', initials: 'SP', status: 'paid', position: 1 },
  { id: 'n2', name: 'David', initials: 'DV', status: 'paid', position: 2 },
  { id: 'n3', name: 'Carine', initials: 'CR', status: 'next', position: 3 },
  { id: 'n4', name: 'Jules', initials: 'JL', status: 'pending', position: 4 },
];

export const MOCK_GROUPS: Community[] = [
  {
    id: 'c1',
    name: 'West Region Association',
    nameFr: "Association de l'Ouest",
    description: 'Community for people from the West Region of Cameroon.',
    descriptionFr:
      "Communauté destinée aux ressortissants de la région de l'Ouest.",
    imageUrl: '/assets/image/communities/west-region.jpg',
    location: 'West Region',
    memberCount: 542,
    groupCount: 18,
    totalSavings: 185000000,
    groups: [
      {
        id: 'g1',
        name: 'West Region Builders Circle',
        description:
          'Monthly savings circle for family projects, home building and school fees.',
        frequency: 'monthly',
        contributionAmount: 50000,
        currency: 'FCFA',
        memberCount: 24,
        totalPot: 1200000,
        nextPayoutMemberId: 'm1',
        nextPayoutDate: '2026-07-05',
        members: MOCK_MEMBERS,
        createdAt: '2025-01-12',
      },
      {
        id: 'g2',
        name: 'Bafoussam Family Support',
        description:
          'Biweekly rotation helping members handle urgent family needs.',
        frequency: 'biweekly',
        contributionAmount: 25000,
        currency: 'FCFA',
        memberCount: 18,
        totalPot: 450000,
        nextPayoutMemberId: 'm3',
        nextPayoutDate: '2026-06-28',
        members: MOCK_MEMBERS,
        createdAt: '2025-03-19',
      },
      {
        id: 'g9',
        name: 'West Region Discovery Group',
        description: 'Open group for new members looking to join the West Region savings circle.',
        frequency: 'monthly',
        contributionAmount: 30000,
        currency: 'FCFA',
        memberCount: 4,
        totalPot: 120000,
        nextPayoutMemberId: 'n3',
        nextPayoutDate: '2026-08-01',
        members: MOCK_MEMBERS_NONMEMBER,
        createdAt: '2026-01-10',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Bonamoussadi Young Professionals',
    nameFr: 'Jeunes Professionnels de Bonamoussadi',
    description:
      'Young professionals, entrepreneurs and innovators living in Bonamoussadi.',
    descriptionFr:
      'Jeunes professionnels, entrepreneurs et innovateurs vivant à Bonamoussadi.',
    imageUrl: '/assets/image/communities/bonamoussadi.jpg',
    location: 'Douala',
    memberCount: 321,
    groupCount: 11,
    totalSavings: 126000000,
    groups: [
      {
        id: 'g3',
        name: 'Bonamoussadi Tech Savings',
        description:
          'Weekly savings group for young professionals investing in devices and training.',
        frequency: 'weekly',
        contributionAmount: 15000,
        currency: 'FCFA',
        memberCount: 16,
        totalPot: 240000,
        nextPayoutMemberId: 'm2',
        nextPayoutDate: '2026-06-22',
        members: MOCK_MEMBERS,
        createdAt: '2025-06-04',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Bonapriso Business Network',
    nameFr: "Réseau d'Affaires de Bonapriso",
    description:
      'A network of business owners and professionals from Bonapriso.',
    descriptionFr:
      "Réseau de chefs d'entreprise et de professionnels de Bonapriso.",
    imageUrl: '/assets/image/communities/bonapriso.jpg',
    location: 'Douala',
    memberCount: 214,
    groupCount: 8,
    totalSavings: 98000000,
    groups: [
      {
        id: 'g4',
        name: 'Bonapriso Enterprise Pool',
        description:
          'Monthly business pool for owners planning inventory and working capital.',
        frequency: 'monthly',
        contributionAmount: 100000,
        currency: 'FCFA',
        memberCount: 12,
        totalPot: 1200000,
        nextPayoutMemberId: 'm4',
        nextPayoutDate: '2026-07-12',
        members: MOCK_MEMBERS,
        createdAt: '2024-11-08',
      },
    ],
  },
  {
    id: 'c5',
    name: 'Bamiléké Development Community',
    nameFr: 'Communauté de Développement Bamiléké',
    description:
      'Community focused on solidarity, investment and mutual support.',
    descriptionFr:
      'Communauté axée sur la solidarité, les investissements et le soutien mutuel.',
    imageUrl: '/assets/image/communities/bamileke.jpg',
    location: 'Cameroon',
    memberCount: 618,
    groupCount: 22,
    totalSavings: 241000000,
    groups: [
      {
        id: 'g5',
        name: 'Bamileke Solidarity Fund',
        description:
          'Large monthly solidarity group for investment, ceremonies and mutual aid.',
        frequency: 'monthly',
        contributionAmount: 75000,
        currency: 'FCFA',
        memberCount: 30,
        totalPot: 2250000,
        nextPayoutMemberId: 'm5',
        nextPayoutDate: '2026-07-01',
        members: MOCK_MEMBERS,
        createdAt: '2024-09-21',
      },
    ],
  },
  {
    id: 'c6',
    name: 'Cameroon Diaspora France',
    nameFr: 'Diaspora Camerounaise de France',
    description:
      'Cameroonians living in France contributing to common goals.',
    descriptionFr:
      'Camerounais vivant en France contribuant à des objectifs communs.',
    imageUrl: '/assets/image/communities/diaspora-france.jpg',
    location: 'France',
    memberCount: 187,
    groupCount: 6,
    totalSavings: 91000000,
    groups: [
      {
        id: 'g6',
        name: 'Paris Home Project Circle',
        description:
          'Diaspora group coordinating monthly contributions for projects back home.',
        frequency: 'monthly',
        contributionAmount: 65000,
        currency: 'FCFA',
        memberCount: 14,
        totalPot: 910000,
        nextPayoutMemberId: 'm1',
        nextPayoutDate: '2026-07-10',
        members: MOCK_MEMBERS,
        createdAt: '2025-02-16',
      },
    ],
  },
  {
    id: 'c7',
    name: 'Douala Market Traders Association',
    nameFr: 'Association des Commerçants de Douala',
    description:
      'Market traders and small business owners pooling resources together.',
    descriptionFr:
      'Commerçants et petits entrepreneurs mettant leurs ressources en commun.',
    imageUrl: '/assets/image/communities/douala-market.jpg',
    location: 'Douala',
    memberCount: 431,
    groupCount: 15,
    totalSavings: 132000000,
    groups: [
      {
        id: 'g7',
        name: 'Mboppi Traders Weekly',
        description:
          'Fast weekly rotation for market traders buying stock and covering stall fees.',
        frequency: 'weekly',
        contributionAmount: 10000,
        currency: 'FCFA',
        memberCount: 28,
        totalPot: 280000,
        nextPayoutMemberId: 'm2',
        nextPayoutDate: '2026-06-21',
        members: MOCK_MEMBERS,
        createdAt: '2025-07-30',
      },
    ],
  },
  {
    id: 'c10',
    name: 'Bonanjo Business Community',
    nameFr: "Communauté d'Affaires de Bonanjo",
    description:
      'Business-focused community for entrepreneurs and company owners.',
    descriptionFr:
      "Communauté orientée vers les affaires pour entrepreneurs et dirigeants.",
    imageUrl: '/assets/image/communities/bonanjo.jpg',
    location: 'Douala',
    memberCount: 228,
    groupCount: 8,
    totalSavings: 145000000,
    groups: [
      {
        id: 'g8',
        name: 'Bonanjo Executive Circle',
        description:
          'Monthly executive savings circle for business expansion and liquidity planning.',
        frequency: 'monthly',
        contributionAmount: 125000,
        currency: 'FCFA',
        memberCount: 10,
        totalPot: 1250000,
        nextPayoutMemberId: 'm3',
        nextPayoutDate: '2026-07-15',
        members: MOCK_MEMBERS,
        createdAt: '2024-12-03',
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly _communities = signal<Community[]>(MOCK_GROUPS);

  communities = computed(() => this._communities());
  groups = computed(() => this._communities().flatMap((c) => c.groups));

  getCommunityById(id: string): Community | undefined {
    return this._communities().find((c) => c.id === id);
  }

  getGroupById(id: string): Group | undefined {
    return this.groups().find((g) => g.id === id);
  }
}