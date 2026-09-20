export type Language = 'en' | 'hi';

export type UserRole = 'Owner' | 'Admin' | 'Video Editor' | 'Content Strategist' | 'Reviewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  passcode: string; // e.g. "1234"
  passcodeEnabled: boolean;
  faceScanEnabled: boolean;
  mfaEnabled: boolean;
  mfaSecret: string;
}

export type PlatformType = 'youtube' | 'facebook' | 'instagram';

export interface SocialChannel {
  id: string;
  platform: PlatformType;
  channelName: string;
  handle: string;
  avatarUrl: string;
  followersCount: number;
  isConnected: boolean;
  apiQuotaUsed: number;
  apiQuotaMax: number;
  status: 'optimal' | 'rate_limited' | 'disconnected';
  lastSynced: string;
}

export type UploadPlatformStatus = 'idle' | 'queued' | 'chunking' | 'uploading' | 'transcoding' | 'published' | 'failed';

export interface PlatformPublishState {
  progress: number; // 0 to 100
  status: UploadPlatformStatus;
  liveUrl?: string;
  error?: string;
  destinationFormat?: 'Reels' | 'Shorts' | 'Feed Post' | 'Standard Video';
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
  category: string;
  selectedPlatforms: PlatformType[];
  platformStates: Record<PlatformType, PlatformPublishState>;
  overallStatus: 'draft' | 'scheduled' | 'uploading' | 'published' | 'partial_failure';
  videoDuration: string;
  fileSize: string;
  thumbnailUrl: string;
  videoUri?: string;
  scheduledSlotId?: string;
  scheduledTime?: string;
  scheduledDate?: string;
  createdAt: string;
  source: 'direct' | 'gmail_harvest' | 'api_ingest';
}

export interface ScheduleSlot {
  id: string;
  slotNumber: number; // 1, 2, 3, 4
  time: string; // "09:00", "13:00", "18:00", "21:00"
  labelEn: string;
  labelHi: string;
  descriptionEn: string;
  descriptionHi: string;
  status: 'vacant' | 'assigned' | 'published';
  assignedVideo?: VideoItem;
}

export interface DailySchedulePlan {
  date: string; // YYYY-MM-DD
  slots: ScheduleSlot[];
}

export interface GmailHarvestEmail {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  receivedTime: string;
  videoFileName: string;
  videoSize: string;
  driveLink?: string;
  hasAttachment: boolean;
  harvestStatus: 'new' | 'harvested' | 'auto_scheduled' | 'dismissed';
  suggestedSlot?: string;
  thumbnail: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'invited';
  lastActive: string;
  permissions: {
    canUpload: boolean;
    canSchedule: boolean;
    canApproveDrafts: boolean;
    canWithdrawEarnings: boolean;
    canManageTeam: boolean;
  };
}

export interface DraftApprovalWorkflow {
  id: string;
  videoId: string;
  videoTitle: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'changes_requested';
  feedbackNotes?: string;
  reviewerName?: string;
  thumbnail: string;
}

export type SubscriptionPlanId = 'trial' | '1month' | '2months' | '3months';

export interface SubscriptionInfo {
  currentPlanId: SubscriptionPlanId;
  name: string;
  monthlyRate: number; // e.g. 500
  totalPaid: number;
  startDate: string;
  expiryDate: string;
  isTrial: boolean;
  trialDaysLeft: number;
  totalTrialDays: number;
  videosPublishedThisMonth: number;
  monthlyVideoQuota: number;
  status: 'active' | 'trial_active' | 'expired';
}

export interface WalletTransaction {
  id: string;
  type: 'syndication_revenue' | 'ad_payout' | 'affiliate_earning' | 'withdrawal';
  amount: number;
  status: 'Completed' | 'Processing' | 'Pending';
  method?: 'UPI' | 'PhonePe' | 'Google Pay' | 'Bank IMPS';
  destinationAccount?: string;
  timestamp: string;
  refNumber: string;
  description: string;
}

export interface WalletState {
  availableBalance: number; // in INR ₹
  lifetimeEarnings: number;
  pendingClearance: number;
  minWithdrawal: number;
  transactions: WalletTransaction[];
}

export interface AiGenerationResult {
  titles: { title: string; ctrScore: number; hookType: string }[];
  description: string;
  hashtags: string[];
  tags: string[];
}
