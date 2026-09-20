import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

export const ArchitectureDocsScreen: React.FC = () => {
  const { t } = useApp();
  const [activeCodeTab, setActiveCodeTab] = useState<'env' | 'docker' | 'cron' | 'api' | 'ci'>('env');

  const envContent = `# =========================================
# OmniStream AI Production Environment
# GitHub Deployment Specification
# =========================================

# Database & Cache
DATABASE_URL="postgresql://omni_admin:SecurePass2026@db.internal:5432/omnistream_prod"
REDIS_URL="redis://:RedisToken2026@redis.internal:6379/0"

# High-Volume Simultaneous Video APIs
YOUTUBE_CLIENT_ID="982349102-yt.apps.googleusercontent.com"
YOUTUBE_CLIENT_SECRET="GOCSPX-omni_secret_token_live"
META_GRAPH_APP_ID="982341908234"
META_GRAPH_APP_SECRET="fb_meta_app_secret_v20"
META_PAGE_ACCESS_TOKEN="EAAQx...long_lived_token"
INSTAGRAM_BUSINESS_ACCOUNT_ID="1784140029381923"

# Automated Gmail Video Harvester
GMAIL_SERVICE_ACCOUNT_EMAIL="harvester@omnistream-ai.iam.gserviceaccount.com"
GMAIL_PUBSUB_TOPIC="projects/omnistream-ai/topics/incoming-videos"
GMAIL_OAUTH_REFRESH_TOKEN="1//04x...gmail_refresh_token"

# OmniBrain AI Studio
OPENAI_API_KEY="sk-proj-omnistream_ai_curation_v2"
AI_DEFAULT_LOCALE="hi-IN,en-US"

# End-to-End Security & Biometrics
JWT_SECRET="OMNI_JWT_SUPER_SECRET_KEY_2026"
ENCRYPTION_KEY_AES256="4d7a8c9e1f2b3a4c5d6e7f8a9b0c1d2e"
TOTP_ISSUER="OmniStream AI"

# Creator Payout Wallet & UPI
RAZORPAYX_ACCOUNT_NUMBER="2323230091823"
RAZORPAYX_API_KEY="rzp_live_9812739182"
RAZORPAYX_API_SECRET="sec_rzp_live_token"
MIN_WITHDRAWAL_INR=500`;

  const dockerContent = `version: '3.8'

services:
  omnistream-api-gateway:
    build:
      context: .
      dockerfile: Dockerfile.gateway
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    env_file: .env.production
    depends_on:
      - redis
      - postgres
    restart: always

  transcoder-microservice:
    build:
      context: ./services/transcoder
      dockerfile: Dockerfile.ffmpeg
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 8G
    environment:
      - FFMPEG_HWACCEL=auto
      - CHUNK_SIZE_MB=8
    depends_on:
      - redis

  highvolume-cron-worker:
    build:
      context: ./services/scheduler
      dockerfile: Dockerfile.worker
    environment:
      - DAILY_QUOTA=4
      - SLOTS=09:00,13:00,18:00,21:00
    depends_on:
      - redis
      - postgres
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass RedisToken2026
    volumes:
      - redis-data:/data

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: omnistream_prod
      POSTGRES_USER: omni_admin
      POSTGRES_PASSWORD: SecurePass2026
    volumes:
      - pg-data:/var/lib/postgresql/data

volumes:
  redis-data:
  pg-data:`;

  const cronContent = `// services/scheduler/cronWorker.ts
// High-Volume 4x Daily Publishing Engine for YouTube, Facebook & Instagram

import cron from 'node-cron';
import { dispatchDailySlotQueue } from '../pipelines/multiUpload';
import { pollGmailInboxSubmissions } from '../harvester/gmailBot';

// 1. Process 4 Daily High-Volume Prime Slots
// Slots: 09:00 Morning, 13:00 Midday, 18:00 Evening, 21:00 Prime Night
cron.schedule('0 9,13,18,21 * * *', async () => {
  console.log('[OmniStream Cron] Triggering Prime Slot Execution...');
  const result = await dispatchDailySlotQueue({
    destinations: ['youtube', 'facebook', 'instagram'],
    concurrency: 3,
    autoTranscode: true
  });
  console.log('[OmniStream Cron] 4x Dispatch Success:', result);
});

// 2. Automated Gmail Video Harvester Bot (Every 15 minutes)
cron.schedule('*/15 * * * *', async () => {
  console.log('[Gmail Harvester] Scanning creator.media.inbox@gmail.com...');
  await pollGmailInboxSubmissions({
    filterFormats: ['mp4', 'mov', 'webm', 'drive.google.com'],
    autoBalanceSchedule: true
  });
});`;

  const apiContent = `// REST & Webhook API Endpoints Specification
// Base URL: https://api.omnistream.ai/v1

1. SIMULTANEOUS UPLOAD
POST /v1/studio/upload-simultaneous
Headers: Authorization: Bearer <JWT>, X-Biometric-Hash: <Hex>
Payload: {
  title: string,
  description: string,
  tags: string[],
  hashtags: string[],
  destinations: ["youtube", "facebook", "instagram"],
  videoUrl: string
}
Response: { taskId: "tsk_9812", status: "chunking", streams: { youtube: "queued", facebook: "queued", instagram: "queued" } }

2. DAILY 4X BATCH SCHEDULER
POST /v1/schedule/daily-batch
Payload: {
  date: "2026-09-20",
  slots: [
    { slot: 1, time: "09:00", videoId: "vid_101" },
    { slot: 2, time: "13:00", videoId: "vid_102" },
    { slot: 3, time: "18:00", videoId: "vid_103" },
    { slot: 4, time: "21:00", videoId: "vid_104" }
  ]
}

3. GMAIL HARVEST WEBHOOK
POST /v1/harvester/gmail-pubsub-webhook
Headers: X-Goog-Signature: <Hmac>
Response: { harvestedVideos: 2, routedToSlot: "09:00 PM" }

4. CREATOR WALLET PAYOUT
POST /v1/wallet/withdraw
Payload: {
  amount: 2500,
  method: "UPI",
  destinationAccount: "creator@okaxis"
}
Response: { transactionId: "tx_8891", status: "Completed", timestamp: "2026-09-20T10:30:00Z" }`;

  const ciContent = `# .github/workflows/deploy.yml
name: OmniStream AI Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - name: Docker Build & Push
        run: |
          docker build -t omnistream/gateway:latest .
          docker build -t omnistream/transcoder:latest ./services/transcoder
      - name: Deploy to Cloud Cluster
        run: |
          echo "Deploying OmniStream 4x High-Volume Automation..."`;

  const handleCopy = () => {
    Alert.alert(t.success, t.copiedAlert);
  };

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'env':
        return envContent;
      case 'docker':
        return dockerContent;
      case 'cron':
        return cronContent;
      case 'api':
        return apiContent;
      case 'ci':
        return ciContent;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Ionicons name="git-branch" size={13} color="#06B6D4" />
            <Text style={styles.badgeText}>GITHUB DEPLOYMENT BLUEPRINT</Text>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.8}>
            <Ionicons name="copy-outline" size={14} color="#041B2D" />
            <Text style={styles.copyBtnText}>Copy Repo Bundle</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>{t.architectureTitle}</Text>
        <Text style={styles.headerSubtitle}>{t.architectureSubtitle}</Text>

        {/* System Topology Diagram Card */}
        <View style={styles.topologyCard}>
          <Text style={styles.topologyTitle}>{t.sysDiagram}</Text>

          <View style={styles.topoNodeRow}>
            <View style={styles.topoNodeClient}>
              <Ionicons name="phone-portrait-outline" size={18} color="#06B6D4" />
              <Text style={styles.topoClientText}>React Native App</Text>
              <Text style={styles.topoSubText}>Expo SDK 52 (Dark UI)</Text>
            </View>

            <Ionicons name="arrow-down" size={16} color="#64748B" style={styles.topoArrow} />

            <View style={styles.topoNodeGateway}>
              <Ionicons name="server-outline" size={18} color="#8B5CF6" />
              <Text style={styles.topoGatewayText}>Node.js API Gateway</Text>
              <Text style={styles.topoSubText}>JWT + Face Biometrics + RBAC</Text>
            </View>

            <View style={styles.topoSplitRow}>
              <View style={styles.topoSubBox}>
                <Ionicons name="layers-outline" size={14} color="#F59E0B" />
                <Text style={styles.topoSubBoxTitle}>Redis BullMQ</Text>
                <Text style={styles.topoSubBoxSub}>4x Daily Cron Engine</Text>
              </View>

              <View style={styles.topoSubBox}>
                <Ionicons name="videocam-outline" size={14} color="#10B981" />
                <Text style={styles.topoSubBoxTitle}>FFmpeg Engine</Text>
                <Text style={styles.topoSubBoxSub}>Simultaneous Transcoder</Text>
              </View>
            </View>

            <Ionicons name="arrow-down" size={16} color="#64748B" style={styles.topoArrow} />

            {/* Destination APIs */}
            <View style={styles.destBoxRow}>
              <View style={[styles.destChip, { borderColor: 'rgba(255, 0, 0, 0.4)' }]}>
                <Ionicons name="logo-youtube" size={13} color="#FF0000" />
                <Text style={styles.destChipText}>YouTube Data v3</Text>
              </View>
              <View style={[styles.destChip, { borderColor: 'rgba(24, 119, 242, 0.4)' }]}>
                <Ionicons name="logo-facebook" size={13} color="#1877F2" />
                <Text style={styles.destChipText}>Meta Graph v20</Text>
              </View>
              <View style={[styles.destChip, { borderColor: 'rgba(225, 48, 108, 0.4)' }]}>
                <Ionicons name="logo-instagram" size={13} color="#E1306C" />
                <Text style={styles.destChipText}>Instagram Graph</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Code Spec Navigation Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {[
          { id: 'env', label: '.env.production' },
          { id: 'docker', label: 'docker-compose.yml' },
          { id: 'cron', label: 'cronWorker.ts (4x Daily)' },
          { id: 'api', label: 'REST API Specs' },
          { id: 'ci', label: 'GitHub Actions CI/CD' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.codeTab, activeCodeTab === tab.id && styles.codeTabActive]}
            onPress={() => setActiveCodeTab(tab.id as any)}
          >
            <Text
              style={[
                styles.codeTabText,
                activeCodeTab === tab.id && styles.codeTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Code Display Terminal */}
      <View style={styles.terminalCard}>
        <View style={styles.terminalHeader}>
          <View style={styles.termDots}>
            <View style={[styles.termDot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.termDot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.termDot, { backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.terminalFilename}>
            {activeCodeTab === 'env'
              ? '.env.production'
              : activeCodeTab === 'docker'
              ? 'docker-compose.yml'
              : activeCodeTab === 'cron'
              ? 'services/scheduler/cronWorker.ts'
              : activeCodeTab === 'api'
              ? 'docs/openapi-schema.json'
              : '.github/workflows/deploy.yml'}
          </Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyTermBtn}>
            <Ionicons name="copy" size={14} color="#06B6D4" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.codeHorizontalScroll}>
          <Text style={styles.codeText}>{getActiveCode()}</Text>
        </ScrollView>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerCard: {
    backgroundColor: '#0D1527',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 18,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  badgeText: {
    color: '#06B6D4',
    fontSize: 9.5,
    fontWeight: '800',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: {
    color: '#041B2D',
    fontSize: 11,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 16,
  },
  topologyCard: {
    backgroundColor: '#111D35',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  topologyTitle: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topoNodeRow: {
    alignItems: 'center',
    gap: 8,
  },
  topoNodeClient: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  topoClientText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  topoGatewayText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  topoSubText: {
    color: '#94A3B8',
    fontSize: 10.5,
  },
  topoArrow: {
    marginVertical: -2,
  },
  topoNodeGateway: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  topoSplitRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  topoSubBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  topoSubBoxTitle: {
    color: '#F8FAFC',
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },
  topoSubBoxSub: {
    color: '#94A3B8',
    fontSize: 9.5,
  },
  destBoxRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  destChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  destChipText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  tabsScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  codeTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginRight: 8,
  },
  codeTabActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06B6D4',
  },
  codeTabText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  codeTabTextActive: {
    color: '#06B6D4',
    fontWeight: '700',
  },
  terminalCard: {
    backgroundColor: '#040711',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 20,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 10,
    marginBottom: 10,
  },
  termDots: {
    flexDirection: 'row',
    gap: 6,
  },
  termDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  terminalFilename: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  copyTermBtn: {
    padding: 4,
  },
  codeHorizontalScroll: {
    maxHeight: 400,
  },
  codeText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 11.5,
    lineHeight: 18,
  },
});
