// Core domain models shared across the app.
// Keep these in sync with the real API DTOs once the backend is wired in.

export interface User {
  id: string;
  fullName: string;
  initials: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export type MemberStatus = 'next' | 'paid' | 'pending' | 'late';

export interface GroupMember {
  id: string;
  name: string;
  initials: string;
  status: MemberStatus;
  position: number; // order in the rotation
}

export interface Community {
  id: string;

  // English
  name: string;
  description: string;
  // French
  nameFr: string;
  descriptionFr: string;

  imageUrl: string;

  location: string;

  memberCount: number;
  groupCount: number;
  totalSavings: number;

  groups: Group[];
}

export type GroupFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface Group {
  id: string;
  name: string;
  description: string;
  frequency: GroupFrequency;
  contributionAmount: number; // per member, per cycle
  currency: string; // e.g. 'FCFA'
  memberCount: number;
  totalPot: number;
  nextPayoutMemberId: string;
  nextPayoutDate: string; // ISO date
  members: GroupMember[];
  createdAt: string;
}

export type ContributionStatus = 'paid' | 'pending' | 'late';

export interface Contribution {
  id: string;
  groupId: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: ContributionStatus;
  dueDate: string;
  paidDate?: string;
}

export type PayoutStatus = 'completed' | 'scheduled' | 'processing';

export interface Payout {
  id: string;
  groupId: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: PayoutStatus;
  date: string;
}

export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Meeting {
  id: string;
  groupId: string;
  title: string;
  status: MeetingStatus;
  date: string;
  durationMinutes?: number;
  attendeeCount?: number;
  hasAiSummary: boolean;
}

export interface MeetingSummary {
  meetingId: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: { owner: string; task: string }[];
  generatedAt: string;
}

export type ComplaintStatus = 'open' | 'in_review' | 'resolved' | 'rejected';

export interface Complaint {
  id: string;
  groupId?: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  reporterName: string;
}

export type WalletTransactionType = 'deposit' | 'withdrawal' | 'contribution' | 'payout';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  date: string;
  label: string;
}

export interface Wallet {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export type NotificationType = 'payout' | 'contribution_due' | 'meeting' | 'complaint' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  date: string;
  read: boolean;
  groupId?: string;
}