export interface User {
  id: number;
  fullName: string | null;
  initials: string;
  email: string | null;
  phoneNumber: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  phoneVerified: boolean;
  pinSet: boolean;
  idStatus?: 'pending' | 'submitted' | 'approved' | 'rejected';
}

export interface AuthOtpRequest { phoneNumber: string; }
export interface AuthOtpVerifyRequest { phoneNumber: string; otp: string; }
export interface AuthOtpVerifyResponse {
  token: string;
  user: User;
  isNewUser: boolean;
  pinRequired: boolean;
}
export interface PinSetRequest { pin: string; }
export interface PinVerifyRequest { pin: string; }
export interface PinVerifyResponse { pinToken: string; expiresInSeconds: number; }
export interface PinLoginRequest { phoneNumber: string; pin: string; }

export interface Community {
  id: string;
  name: string;
  description: string;
  nameFr: string | null;
  descriptionFr: string | null;
  imageUrl: string | null;
  category: string | null;
  status: string;
  groupCount: number;
  totalSavings: number;
  groups: Group[];
  location?: string;
  memberCount?: number;
}

export type GroupFrequency = 'weekly' | 'biweekly' | 'monthly';
export type MemberStatus = 'next' | 'paid' | 'pending' | 'late';

export interface Group {
  id: string;
  name: string;
  description: string;
  frequency: GroupFrequency;
  contributionAmount: number;
  currency: string;
  memberCount: number;
  totalPot: number;
  nextPayoutMemberId: number | string | null;
  nextPayoutDate: string | null;
  members: GroupMember[];
  createdAt: string;
}

export interface GroupMember {
  id: string;
  userId?: number;
  name: string;
  initials: string;
  status: MemberStatus;
  position: number;
  approved?: boolean;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  frequency: string;
  contributionAmount: number;
  currency?: string;
  communityId: string;
  nextPayoutDate?: string;
}

export interface CreateCommunityRequest {
  name: string;
  description: string;
  nameFr?: string;
  descriptionFr?: string;
  imageUrl?: string;
  category?: string;
}

export type ContributionStatus = 'paid' | 'pending' | 'late';

export interface Contribution {
  id: string;
  groupId: string;
  memberId: number;
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
  memberId: number;
  memberName: string;
  amount: number;
  status: PayoutStatus;
  payoutDate: string;
  date?: string;
}

export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Meeting {
  id: string;
  groupId: string;
  title: string;
  status: MeetingStatus;
  meetingDate: string;
  date?: string;
  durationMinutes?: number;
  attendeeCount?: number;
  notes?: string;
  hasAiSummary?: boolean;
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
  category?: string;
  status: ComplaintStatus;
  createdAt: string;
}

export type NotificationType = 'payout' | 'contribution_due' | 'meeting' | 'complaint' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  groupId?: string;
}

export type WalletTransactionType = 'deposit' | 'withdrawal' | 'contribution_paid' | 'payout_received' | 'transfer_out' | 'transfer_in' | 'admin_credit' | 'admin_debit';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  label: string;
  groupName?: string;
  referenceType?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  balance: number;
  availableBalance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface IdVerification {
  id: string;
  userId?: number;
  fullName: string;
  phoneNumber: string;
  documentType: string;
  documentNumber?: string;
  frontFileName: string;
  backFileName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'analyzed';
  reviewNote?: string;
  createdAt: string;
  reviewedAt?: string;
}

