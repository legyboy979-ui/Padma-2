import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Language,
  UserProfile,
  SocialChannel,
  VideoItem,
  DailySchedulePlan,
  GmailHarvestEmail,
  TeamMember,
  DraftApprovalWorkflow,
  SubscriptionInfo,
  SubscriptionPlanId,
  WalletState,
  WalletTransaction,
  PlatformType,
} from '../types';
import { translations } from '../localization/translations';

interface AppContextType {
  language: Language;
  t: typeof translations.en;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;

  user: UserProfile;
  isAuthenticated: boolean;
  isLocked: boolean;
  lockApp: () => void;
  unlockWithPasscode: (pin: string) => boolean;
  unlockWithBiometric: () => void;
  updatePasscode: (pin: string) => void;
  toggleBiometric: (val: boolean) => void;
  togglePasscodeLock: (val: boolean) => void;
  toggleMfa: (val: boolean) => void;

  channels: SocialChannel[];
  refreshChannelStatus: (channelId: string) => void;

  videos: VideoItem[];
  startSimultaneousUpload: (newVideo: Omit<VideoItem, 'id' | 'createdAt' | 'platformStates' | 'overallStatus'>) => VideoItem;
  retryPlatformUpload: (videoId: string, platform: PlatformType) => void;

  schedule: DailySchedulePlan;
  assignVideoToSlot: (slotId: string, videoId: string) => void;
  clearSlot: (slotId: string) => void;
  autoBalanceSchedule: () => void;

  gmailHarvests: GmailHarvestEmail[];
  isHarvesterActive: boolean;
  toggleHarvester: () => void;
  runManualGmailHarvest: () => Promise<number>;
  autoRouteHarvestItem: (emailId: string) => void;

  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'status' | 'lastActive'>) => void;
  removeTeamMember: (id: string) => void;

  draftApprovals: DraftApprovalWorkflow[];
  approveDraft: (id: string) => void;
  requestDraftChanges: (id: string, notes: string) => void;

  subscription: SubscriptionInfo;
  upgradeSubscription: (planId: SubscriptionPlanId) => void;

  wallet: WalletState;
  requestWithdrawal: (amount: number, method: 'UPI' | 'PhonePe' | 'Google Pay' | 'Bank IMPS', account: string) => { success: boolean; message: string };

  registerWithOtp: (name: string, email: string, phone: string) => Promise<string>;
  verifyOtp: (enteredOtp: string, expectedOtp: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  id: 'usr-omni-001',
  name: 'Devendra Sharma',
  email: 'creator.media@omnistream.ai',
  phone: '+91 98765 43210',
  role: 'Owner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  passcode: '1234',
  passcodeEnabled: true,
  faceScanEnabled: true,
  mfaEnabled: true,
  mfaSecret: 'OMNI-7829-X9A2-2026',
};

const INITIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'yt-channel-01',
    platform: 'youtube',
    channelName: 'TechVision Prime (YT)',
    handle: '@techvisionprime',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followersCount: 184500,
    isConnected: true,
    apiQuotaUsed: 2450,
    apiQuotaMax: 10000,
    status: 'optimal',
    lastSynced: '2 mins ago',
  },
  {
    id: 'fb-channel-01',
    platform: 'facebook',
    channelName: 'Viral Clips Official (FB)',
    handle: 'facebook.com/viralclipsofficial',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followersCount: 92300,
    isConnected: true,
    apiQuotaUsed: 420,
    apiQuotaMax: 5000,
    status: 'optimal',
    lastSynced: '5 mins ago',
  },
  {
    id: 'ig-channel-01',
    platform: 'instagram',
    channelName: 'OmniStream Reels Hub',
    handle: '@omnistream.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followersCount: 241000,
    isConnected: true,
    apiQuotaUsed: 1890,
    apiQuotaMax: 4800,
    status: 'optimal',
    lastSynced: 'Just now',
  },
];

const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-001',
    title: 'Top 5 AI Tools That Will Replace Junior Developers in 2026',
    description: 'Explore the newest artificial intelligence pipelines transforming software architecture, auto-debugging, and deployment. #AI #Coding #Tech2026',
    tags: ['ai tools 2026', 'software engineering', 'chatgpt 5', 'automation', 'future of work'],
    hashtags: ['#AI2026', '#CodeAutomation', '#TechNews', '#Shorts', '#Reels'],
    category: 'Science & Technology',
    selectedPlatforms: ['youtube', 'facebook', 'instagram'],
    platformStates: {
      youtube: { progress: 100, status: 'published', liveUrl: 'https://youtube.com/shorts/omni_x987a' },
      facebook: { progress: 100, status: 'published', liveUrl: 'https://facebook.com/reel/fb_289410' },
      instagram: { progress: 100, status: 'published', liveUrl: 'https://instagram.com/reel/C89218h' },
    },
    overallStatus: 'published',
    videoDuration: '00:58',
    fileSize: '24.8 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    scheduledSlotId: 'slot-1',
    scheduledTime: '09:00 AM',
    scheduledDate: '2026-09-20',
    createdAt: 'Today, 08:45 AM',
    source: 'direct',
  },
  {
    id: 'vid-002',
    title: 'How To Build An Automated Content Machine (Hindi + Eng Guide)',
    description: 'पूर्ण गाइड: कैसे आप रोज़ाना 4 से अधिक वीडियो यूट्यूब, फेसबुक और इंस्टाग्राम पर बिना किसी रुकावट के ऑटोमेट कर सकते हैं! #Automation #CreatorEconomy',
    tags: ['automation', 'social media growth', 'hindi tech', 'instagram reels viral', 'creator economy'],
    hashtags: ['#HindiTech', '#CreatorEconomy', '#ViralReels', '#YouTubeShorts', '#FacebookReels'],
    category: 'How-to & Style',
    selectedPlatforms: ['youtube', 'facebook', 'instagram'],
    platformStates: {
      youtube: { progress: 100, status: 'published', liveUrl: 'https://youtube.com/shorts/omni_b2234' },
      facebook: { progress: 100, status: 'published', liveUrl: 'https://facebook.com/reel/fb_99812' },
      instagram: { progress: 100, status: 'published', liveUrl: 'https://instagram.com/reel/C899120' },
    },
    overallStatus: 'published',
    videoDuration: '01:12',
    fileSize: '36.2 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80',
    scheduledSlotId: 'slot-2',
    scheduledTime: '01:00 PM',
    scheduledDate: '2026-09-20',
    createdAt: 'Today, 12:40 PM',
    source: 'gmail_harvest',
  },
  {
    id: 'vid-003',
    title: '3 Secret Psychological Triggers Behind 10M+ Viral Reels',
    description: 'Breakdown of retention hooks, sound sync psychology, and visual pacing that forces algorithms to push your shorts. #ViralGrowth #Marketing',
    tags: ['viral growth', 'algorithm hacks', 'reels tips', 'youtube algorithm', 'retention editing'],
    hashtags: ['#ViralHacks', '#ReelsGrowth', '#ShortsAlgorithm', '#OmniStream'],
    category: 'Education',
    selectedPlatforms: ['youtube', 'facebook', 'instagram'],
    platformStates: {
      youtube: { progress: 85, status: 'transcoding' },
      facebook: { progress: 90, status: 'uploading' },
      instagram: { progress: 78, status: 'uploading' },
    },
    overallStatus: 'uploading',
    videoDuration: '00:46',
    fileSize: '19.5 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633493106115-fa6e6f966144?w=400&auto=format&fit=crop&q=80',
    scheduledSlotId: 'slot-3',
    scheduledTime: '06:00 PM',
    scheduledDate: '2026-09-20',
    createdAt: 'Today, 05:30 PM',
    source: 'direct',
  },
];

const INITIAL_SCHEDULE: DailySchedulePlan = {
  date: '2026-09-20',
  slots: [
    {
      id: 'slot-1',
      slotNumber: 1,
      time: '09:00 AM',
      labelEn: 'Morning Commute',
      labelHi: 'सुबह का सफ़र (मॉर्निंग स्लॉट)',
      descriptionEn: 'High retention during morning commute transit & breakfast',
      descriptionHi: 'सुबह के सफर और नाश्ते के समय उच्च दर्शक एंगेजमेंट',
      status: 'published',
      assignedVideo: INITIAL_VIDEOS[0],
    },
    {
      id: 'slot-2',
      slotNumber: 2,
      time: '01:00 PM',
      labelEn: 'Midday Spike',
      labelHi: 'दोपहर का लंच पीक',
      descriptionEn: 'Lunch-break scrolling peak across Instagram and Shorts',
      descriptionHi: 'लंच ब्रेक के समय रील्स और शॉर्ट्स पर तेज उछाल',
      status: 'published',
      assignedVideo: INITIAL_VIDEOS[1],
    },
    {
      id: 'slot-3',
      slotNumber: 3,
      time: '06:00 PM',
      labelEn: 'Evening Transit',
      labelHi: 'शाम का ट्रांज़िट व घर वापसी',
      descriptionEn: 'Evening high-share window and casual entertainment feed',
      descriptionHi: 'शाम के समय दोस्तों के साथ शेयरिंग का उच्चतम अवसर',
      status: 'assigned',
      assignedVideo: INITIAL_VIDEOS[2],
    },
    {
      id: 'slot-4',
      slotNumber: 4,
      time: '09:00 PM',
      labelEn: 'Prime Night',
      labelHi: 'प्राइम नाइट बिंज स्क्रोल',
      descriptionEn: 'Peak global bedtime binge viewing hours',
      descriptionHi: 'सोने से पहले देर रात तक वीडियो देखने का पीक समय',
      status: 'vacant',
      assignedVideo: undefined,
    },
  ],
};

const INITIAL_GMAIL_HARVESTS: GmailHarvestEmail[] = [
  {
    id: 'gm-harvest-101',
    senderName: 'Vikas Malhotra (Senior Editor)',
    senderEmail: 'vikas.editor@contentagency.in',
    subject: '[OmniStream Drop] Episode 44 Master Render (4K 60fps)',
    receivedTime: '35 mins ago',
    videoFileName: 'ep44_master_cut_v2.mp4',
    videoSize: '48.5 MB',
    driveLink: 'https://drive.google.com/file/d/18AzK9q-OmniStream',
    hasAttachment: true,
    harvestStatus: 'new',
    suggestedSlot: '09:00 PM Prime Night',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'gm-harvest-102',
    senderName: 'Client Dropbox Sync',
    senderEmail: 'bot@clientmediahub.com',
    subject: 'Batch Auto-Export: FinTech Trends Breakdown',
    receivedTime: '2 hours ago',
    videoFileName: 'fintech_trends_short.mp4',
    videoSize: '28.1 MB',
    driveLink: 'https://drive.google.com/open?id=fintech_ai_cut',
    hasAttachment: true,
    harvestStatus: 'auto_scheduled',
    suggestedSlot: '01:00 PM Midday Spike',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'gm-harvest-103',
    senderName: 'Pooja Verma (Motion Designer)',
    senderEmail: 'pooja.graphics@studioworks.com',
    subject: '[Motion Reel] 3D Animation Hook for IG & YT',
    receivedTime: 'Yesterday, 11:20 PM',
    videoFileName: '3d_hook_intro_9x16.mov',
    videoSize: '34.0 MB',
    hasAttachment: true,
    harvestStatus: 'harvested',
    suggestedSlot: '06:00 PM Evening Transit',
    thumbnail: 'https://images.unsplash.com/photo-1633493106115-fa6e6f966144?w=300&auto=format&fit=crop&q=80',
  },
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-01',
    name: 'Devendra Sharma',
    email: 'creator.media@omnistream.ai',
    phone: '+91 98765 43210',
    role: 'Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: 'Right now (Online)',
    permissions: {
      canUpload: true,
      canSchedule: true,
      canApproveDrafts: true,
      canWithdrawEarnings: true,
      canManageTeam: true,
    },
  },
  {
    id: 'tm-02',
    name: 'Priya Narayanan',
    email: 'priya.lead@omnistream.ai',
    phone: '+91 98200 11223',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '12 mins ago',
    permissions: {
      canUpload: true,
      canSchedule: true,
      canApproveDrafts: true,
      canWithdrawEarnings: false,
      canManageTeam: true,
    },
  },
  {
    id: 'tm-03',
    name: 'Vikas Malhotra',
    email: 'vikas.editor@contentagency.in',
    phone: '+91 98112 33445',
    role: 'Video Editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '45 mins ago',
    permissions: {
      canUpload: true,
      canSchedule: false,
      canApproveDrafts: false,
      canWithdrawEarnings: false,
      canManageTeam: false,
    },
  },
  {
    id: 'tm-04',
    name: 'Aarav Patel',
    email: 'aarav.growth@omnistream.ai',
    phone: '+91 97788 99001',
    role: 'Content Strategist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '1 hour ago',
    permissions: {
      canUpload: false,
      canSchedule: true,
      canApproveDrafts: true,
      canWithdrawEarnings: false,
      canManageTeam: false,
    },
  },
  {
    id: 'tm-05',
    name: 'Siddharth Roy (Brand Client)',
    email: 'siddharth@clientbrand.com',
    phone: '+91 99001 22334',
    role: 'Reviewer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    status: 'invited',
    lastActive: 'Pending Invite Acceptance',
    permissions: {
      canUpload: false,
      canSchedule: false,
      canApproveDrafts: true,
      canWithdrawEarnings: false,
      canManageTeam: false,
    },
  },
];

const INITIAL_APPROVALS: DraftApprovalWorkflow[] = [
  {
    id: 'appr-01',
    videoId: 'vid-004',
    videoTitle: 'Next-Gen Cyber Security Threats in Banking (Draft v1)',
    submittedBy: 'Vikas Malhotra (Video Editor)',
    submittedAt: 'Today, 02:15 PM',
    status: 'pending',
    feedbackNotes: 'Please verify the stats at 00:24 before final high-volume syndication.',
    reviewerName: 'Siddharth Roy',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'appr-02',
    videoId: 'vid-005',
    videoTitle: 'Why 90% of Startups Fail in India [Reel Teaser]',
    submittedBy: 'Aarav Patel (Strategist)',
    submittedAt: 'Today, 11:00 AM',
    status: 'approved',
    feedbackNotes: 'Hook is phenomenal. Approved for 09:00 PM Prime Night slot.',
    reviewerName: 'Devendra Sharma (Owner)',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&auto=format&fit=crop&q=80',
  },
];

const INITIAL_WALLET: WalletState = {
  availableBalance: 8450,
  lifetimeEarnings: 32600,
  pendingClearance: 1200,
  minWithdrawal: 500,
  transactions: [
    {
      id: 'tx-8891',
      type: 'syndication_revenue',
      amount: 2450,
      status: 'Completed',
      timestamp: 'Today, 10:30 AM',
      refNumber: 'SYN-2026-9812A',
      description: 'YouTube Shorts AdSense Rev-Share (Daily 4x Batch)',
    },
    {
      id: 'tx-8890',
      type: 'syndication_revenue',
      amount: 1800,
      status: 'Completed',
      timestamp: 'Yesterday, 07:15 PM',
      refNumber: 'FB-MON-38290',
      description: 'Facebook Reels Creator Bonus & In-Stream Ads',
    },
    {
      id: 'tx-8889',
      type: 'withdrawal',
      amount: 5000,
      status: 'Completed',
      method: 'UPI',
      destinationAccount: 'creator@okaxis',
      timestamp: '18 Sep 2026, 02:40 PM',
      refNumber: 'UPI-AXIS-774910',
      description: 'Instant UPI Payout to creator@okaxis',
    },
    {
      id: 'tx-8888',
      type: 'affiliate_earning',
      amount: 3200,
      status: 'Completed',
      timestamp: '15 Sep 2026, 11:20 AM',
      refNumber: 'AFF-OMNI-44102',
      description: 'OmniStream AI Referral Partnership Payout',
    },
  ],
};

const INITIAL_SUBSCRIPTION: SubscriptionInfo = {
  currentPlanId: 'trial',
  name: '7-Day Unlimited Free Trial',
  monthlyRate: 500,
  totalPaid: 0,
  startDate: '2026-09-18',
  expiryDate: '2026-09-25',
  isTrial: true,
  trialDaysLeft: 5,
  totalTrialDays: 7,
  videosPublishedThisMonth: 18,
  monthlyVideoQuota: 120, // 4 videos/day * 30 days
  status: 'trial_active',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [channels, setChannels] = useState<SocialChannel[]>(INITIAL_CHANNELS);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [schedule, setSchedule] = useState<DailySchedulePlan>(INITIAL_SCHEDULE);
  const [gmailHarvests, setGmailHarvests] = useState<GmailHarvestEmail[]>(INITIAL_GMAIL_HARVESTS);
  const [isHarvesterActive, setIsHarvesterActive] = useState<boolean>(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [draftApprovals, setDraftApprovals] = useState<DraftApprovalWorkflow[]>(INITIAL_APPROVALS);
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(INITIAL_SUBSCRIPTION);

  // Load persisted language or user preferences if available
  useEffect(() => {
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem('@omnistream_lang');
        if (storedLang === 'en' || storedLang === 'hi') {
          setLanguageState(storedLang);
        }
        const storedWallet = await AsyncStorage.getItem('@omnistream_wallet');
        if (storedWallet) {
          setWallet(JSON.parse(storedWallet));
        }
      } catch {
        // ignore fallback
      }
    })();
  }, []);

  const t = translations[language];

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguageState(next);
    AsyncStorage.setItem('@omnistream_lang', next).catch(() => {});
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem('@omnistream_lang', lang).catch(() => {});
  };

  const lockApp = () => {
    setIsLocked(true);
  };

  const unlockWithPasscode = (pin: string): boolean => {
    if (pin === user.passcode) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const unlockWithBiometric = () => {
    setIsLocked(false);
  };

  const updatePasscode = (pin: string) => {
    setUser((prev) => ({ ...prev, passcode: pin }));
  };

  const toggleBiometric = (val: boolean) => {
    setUser((prev) => ({ ...prev, faceScanEnabled: val }));
  };

  const togglePasscodeLock = (val: boolean) => {
    setUser((prev) => ({ ...prev, passcodeEnabled: val }));
  };

  const toggleMfa = (val: boolean) => {
    setUser((prev) => ({ ...prev, mfaEnabled: val }));
  };

  const refreshChannelStatus = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, lastSynced: 'Just now', status: 'optimal' } : c))
    );
  };

  // Simultaneous multi-platform upload engine with simulated real-time pipeline
  const startSimultaneousUpload = (
    newVideoData: Omit<VideoItem, 'id' | 'createdAt' | 'platformStates' | 'overallStatus'>
  ): VideoItem => {
    const newId = `vid-${Date.now()}`;
    const initialPlatformStates: Record<PlatformType, any> = {
      youtube: {
        progress: newVideoData.selectedPlatforms.includes('youtube') ? 10 : 0,
        status: newVideoData.selectedPlatforms.includes('youtube') ? 'chunking' : 'idle',
      },
      facebook: {
        progress: newVideoData.selectedPlatforms.includes('facebook') ? 10 : 0,
        status: newVideoData.selectedPlatforms.includes('facebook') ? 'chunking' : 'idle',
      },
      instagram: {
        progress: newVideoData.selectedPlatforms.includes('instagram') ? 10 : 0,
        status: newVideoData.selectedPlatforms.includes('instagram') ? 'chunking' : 'idle',
      },
    };

    const newVideo: VideoItem = {
      ...newVideoData,
      id: newId,
      createdAt: 'Just now',
      overallStatus: 'uploading',
      platformStates: initialPlatformStates,
    };

    setVideos((prev) => [newVideo, ...prev]);

    // Simulate multi-platform pipeline progression
    let step = 1;
    const interval = setInterval(() => {
      step++;
      setVideos((currentVideos) =>
        currentVideos.map((v) => {
          if (v.id !== newId) return v;

          const updatedStates = { ...v.platformStates };
          let allDone = true;

          (v.selectedPlatforms as PlatformType[]).forEach((plat) => {
            if (step === 2) {
              updatedStates[plat] = { progress: 40, status: 'uploading' };
              allDone = false;
            } else if (step === 3) {
              updatedStates[plat] = { progress: 75, status: 'transcoding' };
              allDone = false;
            } else if (step >= 4) {
              const liveUrl =
                plat === 'youtube'
                  ? `https://youtube.com/shorts/${newId}`
                  : plat === 'facebook'
                  ? `https://facebook.com/reel/fb_${newId}`
                  : `https://instagram.com/reel/ig_${newId}`;
              updatedStates[plat] = { progress: 100, status: 'published', liveUrl };
            }
          });

          return {
            ...v,
            platformStates: updatedStates,
            overallStatus: allDone && step >= 4 ? 'published' : 'uploading',
          };
        })
      );

      if (step >= 4) {
        clearInterval(interval);
        // Add syndication revenue to wallet!
        setWallet((w) => {
          const earned = 650;
          const newTx: WalletTransaction = {
            id: `tx-${Date.now()}`,
            type: 'syndication_revenue',
            amount: earned,
            status: 'Completed',
            timestamp: 'Just now',
            refNumber: `SYN-${Date.now().toString().slice(-6)}`,
            description: `Simultaneous Stream Revenue (${newVideo.title.slice(0, 24)}...)`,
          };
          return {
            ...w,
            availableBalance: w.availableBalance + earned,
            lifetimeEarnings: w.lifetimeEarnings + earned,
            transactions: [newTx, ...w.transactions],
          };
        });
      }
    }, 1800);

    return newVideo;
  };

  const retryPlatformUpload = (videoId: string, platform: PlatformType) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        return {
          ...v,
          overallStatus: 'uploading',
          platformStates: {
            ...v.platformStates,
            [platform]: { progress: 20, status: 'uploading' },
          },
        };
      })
    );

    setTimeout(() => {
      setVideos((prev) =>
        prev.map((v) => {
          if (v.id !== videoId) return v;
          return {
            ...v,
            overallStatus: 'published',
            platformStates: {
              ...v.platformStates,
              [platform]: {
                progress: 100,
                status: 'published',
                liveUrl: `https://${platform}.com/live_${Date.now().toString().slice(-5)}`,
              },
            },
          };
        })
      );
    }, 2000);
  };

  // Assign a video to one of the 4 daily slots
  const assignVideoToSlot = (slotId: string, videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (!video) return;

    setSchedule((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            status: 'assigned',
            assignedVideo: video,
          };
        }
        return s;
      }),
    }));

    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, scheduledSlotId: slotId, overallStatus: 'scheduled' } : v))
    );
  };

  const clearSlot = (slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            status: 'vacant',
            assignedVideo: undefined,
          };
        }
        return s;
      }),
    }));
  };

  // Auto-balance high-volume 4 daily slots
  const autoBalanceSchedule = () => {
    const vacantSlots = schedule.slots.filter((s) => s.status === 'vacant');
    if (vacantSlots.length === 0) return;

    // Pick unassigned videos or harvest items
    const unassigned = videos.filter((v) => !v.scheduledSlotId);
    if (unassigned.length > 0) {
      assignVideoToSlot(vacantSlots[0].id, unassigned[0].id);
    } else {
      // create quick video from harvest
      const harvest = gmailHarvests.find((g) => g.harvestStatus === 'new');
      if (harvest) {
        autoRouteHarvestItem(harvest.id);
      }
    }
  };

  const toggleHarvester = () => {
    setIsHarvesterActive((prev) => !prev);
  };

  // Manual trigger for Gmail harvester
  const runManualGmailHarvest = async (): Promise<number> => {
    await new Promise((res) => setTimeout(res, 1200));
    const newItems: GmailHarvestEmail[] = [
      {
        id: `gm-harvest-${Date.now()}`,
        senderName: 'Automation Engine Webhook',
        senderEmail: 'drive-export@omnistream.ai',
        subject: `[Auto-Ingest] Viral Reel #${Math.floor(Math.random() * 900 + 100)} (Render Complete)`,
        receivedTime: 'Just now',
        videoFileName: `auto_reel_${Date.now().toString().slice(-4)}.mp4`,
        videoSize: '29.4 MB',
        driveLink: 'https://drive.google.com/file/d/omni-auto-stream',
        hasAttachment: true,
        harvestStatus: 'new',
        suggestedSlot: '09:00 PM Prime Night',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      },
    ];

    setGmailHarvests((prev) => [...newItems, ...prev]);
    return newItems.length;
  };

  const autoRouteHarvestItem = (emailId: string) => {
    const item = gmailHarvests.find((g) => g.id === emailId);
    if (!item) return;

    const newVideo: VideoItem = {
      id: `vid-harvest-${Date.now()}`,
      title: item.subject.replace(/\[.*?\]\s*/g, ''),
      description: `Auto-harvested and scheduled from ${item.senderEmail}. Formatted for YouTube Shorts, FB Reels & IG Reels.`,
      tags: ['auto ingest', 'gmail harvest', 'omnistream', 'viral reels'],
      hashtags: ['#OmniStream', '#AIAutomation', '#Daily4x', '#CreatorReels'],
      category: 'Entertainment',
      selectedPlatforms: ['youtube', 'facebook', 'instagram'],
      platformStates: {
        youtube: { progress: 0, status: 'queued' },
        facebook: { progress: 0, status: 'queued' },
        instagram: { progress: 0, status: 'queued' },
      },
      overallStatus: 'scheduled',
      videoDuration: '00:52',
      fileSize: item.videoSize,
      thumbnailUrl: item.thumbnail,
      createdAt: 'Just now',
      source: 'gmail_harvest',
    };

    setVideos((prev) => [newVideo, ...prev]);

    // Find vacant slot among the 4 slots
    const vacant = schedule.slots.find((s) => s.status === 'vacant');
    if (vacant) {
      assignVideoToSlot(vacant.id, newVideo.id);
    }

    setGmailHarvests((prev) =>
      prev.map((g) => (g.id === emailId ? { ...g, harvestStatus: 'auto_scheduled' } : g))
    );
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'status' | 'lastActive'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `tm-${Date.now()}`,
      status: 'invited',
      lastActive: 'Invitation Dispatched',
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const approveDraft = (id: string) => {
    setDraftApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved', reviewerName: user.name } : a))
    );
  };

  const requestDraftChanges = (id: string, notes: string) => {
    setDraftApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'changes_requested', feedbackNotes: notes, reviewerName: user.name } : a))
    );
  };

  // Upgrade subscription to 1 month (₹500), 2 months (₹950), or 3 months (₹1,350)
  const upgradeSubscription = (planId: SubscriptionPlanId) => {
    let name = '1 Month Standard';
    let rate = 500;
    let days = 30;

    if (planId === '2months') {
      name = '2 Months Pack';
      rate = 950;
      days = 60;
    } else if (planId === '3months') {
      name = '3 Months Pro Quarterly';
      rate = 1350;
      days = 90;
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);

    const updated: SubscriptionInfo = {
      currentPlanId: planId,
      name,
      monthlyRate: 500,
      totalPaid: rate,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      isTrial: false,
      trialDaysLeft: 0,
      totalTrialDays: 7,
      videosPublishedThisMonth: subscription.videosPublishedThisMonth,
      monthlyVideoQuota: 120 * (days / 30),
      status: 'active',
    };

    setSubscription(updated);
  };

  // Instant earnings withdrawal
  const requestWithdrawal = (
    amount: number,
    method: 'UPI' | 'PhonePe' | 'Google Pay' | 'Bank IMPS',
    account: string
  ): { success: boolean; message: string } => {
    if (amount < wallet.minWithdrawal) {
      return { success: false, message: `Minimum withdrawal is ₹${wallet.minWithdrawal}` };
    }
    if (amount > wallet.availableBalance) {
      return { success: false, message: 'Requested amount exceeds available balance' };
    }

    const refNum = `WDL-${Date.now().toString().slice(-6)}`;
    const newTx: WalletTransaction = {
      id: `tx-wdl-${Date.now()}`,
      type: 'withdrawal',
      amount,
      status: 'Processing',
      method,
      destinationAccount: account,
      timestamp: 'Just now',
      refNumber: refNum,
      description: `Instant ${method} Payout to ${account}`,
    };

    const updatedWallet: WalletState = {
      ...wallet,
      availableBalance: wallet.availableBalance - amount,
      transactions: [newTx, ...wallet.transactions],
    };

    setWallet(updatedWallet);
    AsyncStorage.setItem('@omnistream_wallet', JSON.stringify(updatedWallet)).catch(() => {});

    // Automatically transition to completed after 4 seconds
    setTimeout(() => {
      setWallet((curr) => ({
        ...curr,
        transactions: curr.transactions.map((tx) =>
          tx.refNumber === refNum ? { ...tx, status: 'Completed' } : tx
        ),
      }));
    }, 4000);

    return { success: true, message: `Withdrawal of ₹${amount} initiated via ${method}` };
  };

  const registerWithOtp = async (name: string, email: string, phone: string): Promise<string> => {
    const demoOtp = '789012'; // 6-digit OTP code for demo verification
    setUser((prev) => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
      phone: phone || prev.phone,
    }));
    return demoOtp;
  };

  const verifyOtp = (enteredOtp: string, expectedOtp: string): boolean => {
    if (enteredOtp === expectedOtp || enteredOtp === '123456' || enteredOtp === '789012') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        t,
        toggleLanguage,
        setLanguage,
        user,
        isAuthenticated,
        isLocked,
        lockApp,
        unlockWithPasscode,
        unlockWithBiometric,
        updatePasscode,
        toggleBiometric,
        togglePasscodeLock,
        toggleMfa,
        channels,
        refreshChannelStatus,
        videos,
        startSimultaneousUpload,
        retryPlatformUpload,
        schedule,
        assignVideoToSlot,
        clearSlot,
        autoBalanceSchedule,
        gmailHarvests,
        isHarvesterActive,
        toggleHarvester,
        runManualGmailHarvest,
        autoRouteHarvestItem,
        teamMembers,
        addTeamMember,
        removeTeamMember,
        draftApprovals,
        approveDraft,
        requestDraftChanges,
        subscription,
        upgradeSubscription,
        wallet,
        requestWithdrawal,
        registerWithOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
