import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

interface DashboardScreenProps {
  onNavigateTab: (tabKey: string) => void;
  onOpenPlans: () => void;
  onOpenWithdraw: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateTab,
  onOpenPlans,
  onOpenWithdraw,
}) => {
  const {
    t,
    videos,
    channels,
    schedule,
    wallet,
    subscription,
    gmailHarvests,
    runManualGmailHarvest,
    isHarvesterActive,
    refreshChannelStatus,
  } = useApp();

  const filledSlotsCount = schedule.slots.filter((s) => s.status !== 'vacant').length;
  const activeUploads = videos.filter((v) => v.overallStatus === 'uploading');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner / Welcome */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroBadge}>MULTI-DESTINATION ENGINE</Text>
            <Text style={styles.heroTitle}>{t.dashboardTitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.heroActionBtn}
            onPress={() => onNavigateTab('studio')}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload" size={16} color="#041B2D" />
            <Text style={styles.heroActionText}>{t.quickUpload}</Text>
          </TouchableOpacity>
        </View>

        {/* 4-Video High Volume Quota Meter */}
        <View style={styles.quotaMeterCard}>
          <View style={styles.quotaTopRow}>
            <View style={styles.quotaLabelGroup}>
              <Ionicons name="calendar" size={16} color="#06B6D4" />
              <Text style={styles.quotaTitle}>{t.todayQuota}</Text>
            </View>
            <Text style={styles.quotaCountText}>
              {filledSlotsCount} / 4 Slots Filled
            </Text>
          </View>

          {/* 4-Segment Progress Bar */}
          <View style={styles.slotSegmentsRow}>
            {schedule.slots.map((slot, idx) => {
              const isFilled = slot.status !== 'vacant';
              return (
                <View
                  key={slot.id}
                  style={[
                    styles.slotSegment,
                    isFilled ? styles.slotSegmentFilled : styles.slotSegmentVacant,
                  ]}
                >
                  <Text style={styles.slotSegTime}>{slot.time}</Text>
                  <Ionicons
                    name={isFilled ? 'checkmark-circle' : 'ellipse-outline'}
                    size={12}
                    color={isFilled ? '#10B981' : '#64748B'}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.quotaFooter}>
            <Text style={styles.quotaNotice}>
              High-volume throughput targeted at 4 daily prime times (09:00, 13:00, 18:00, 21:00)
            </Text>
            <TouchableOpacity onPress={() => onNavigateTab('schedule')}>
              <Text style={styles.quotaLink}>{t.viewSchedule} →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Metrics Row */}
      <View style={styles.metricsRow}>
        {/* Wallet Balance Card */}
        <TouchableOpacity
          style={styles.metricCard}
          onPress={onOpenWithdraw}
          activeOpacity={0.8}
        >
          <View style={styles.metricTop}>
            <Text style={styles.metricLabel}>{t.walletSummary}</Text>
            <View style={styles.metricIconCircle}>
              <Ionicons name="wallet-outline" size={16} color="#10B981" />
            </View>
          </View>
          <Text style={styles.metricValue}>₹{wallet.availableBalance.toLocaleString('en-IN')}</Text>
          <View style={styles.metricBottom}>
            <Text style={styles.metricSub}>Min ₹500 • Instant UPI</Text>
            <Ionicons name="arrow-forward" size={13} color="#10B981" />
          </View>
        </TouchableOpacity>

        {/* Subscription / Trial Card */}
        <TouchableOpacity
          style={styles.metricCard}
          onPress={onOpenPlans}
          activeOpacity={0.8}
        >
          <View style={styles.metricTop}>
            <Text style={styles.metricLabel}>
              {subscription.isTrial ? '7-Day Free Trial' : 'Subscription'}
            </Text>
            <View style={[styles.metricIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="diamond-outline" size={16} color="#F59E0B" />
            </View>
          </View>
          <Text style={[styles.metricValue, { color: '#F59E0B' }]}>
            {subscription.isTrial ? `${subscription.trialDaysLeft} Days Left` : '₹500 / mo'}
          </Text>
          <View style={styles.metricBottom}>
            <Text style={styles.metricSub}>3 Months Pack Available</Text>
            <Ionicons name="arrow-forward" size={13} color="#F59E0B" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Gmail Harvester Bot Status Bar */}
      <View style={styles.harvesterBanner}>
        <View style={styles.harvesterLeft}>
          <View style={styles.mailIconBox}>
            <Ionicons name="mail" size={20} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.harvesterTitleRow}>
              <Text style={styles.harvesterTitle}>{t.gmailHarvesterState}</Text>
              <View style={[styles.harvDot, isHarvesterActive ? styles.dotLive : styles.dotOff]} />
            </View>
            <Text style={styles.harvesterSub}>
              {gmailHarvests.filter((g) => g.harvestStatus === 'new').length} video drafts detected in inbox
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.harvTriggerBtn}
          onPress={() => runManualGmailHarvest()}
          activeOpacity={0.7}
        >
          <Ionicons name="sync" size={14} color="#06B6D4" />
          <Text style={styles.harvTriggerText}>Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Connected Channel Destinations (YouTube, Facebook, Instagram) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.connectedChannels}</Text>
        <Text style={styles.sectionSubtitle}>API Quotas & Status</Text>
      </View>

      <View style={styles.channelsGrid}>
        {channels.map((chan) => {
          const iconColor =
            chan.platform === 'youtube'
              ? '#FF0000'
              : chan.platform === 'facebook'
              ? '#1877F2'
              : '#E1306C';

          const iconName =
            chan.platform === 'youtube'
              ? 'logo-youtube'
              : chan.platform === 'facebook'
              ? 'logo-facebook'
              : 'logo-instagram';

          const pct = Math.round((chan.apiQuotaUsed / chan.apiQuotaMax) * 100);

          return (
            <View key={chan.id} style={styles.channelCard}>
              <View style={styles.chanTop}>
                <View style={styles.chanIconBox}>
                  <Ionicons name={iconName as any} size={22} color={iconColor} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.chanName} numberOfLines={1}>
                    {chan.channelName}
                  </Text>
                  <Text style={styles.chanHandle}>{chan.handle}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => refreshChannelStatus(chan.id)}
                  style={styles.syncChanBtn}
                >
                  <Ionicons name="refresh" size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={styles.chanStatsRow}>
                <View>
                  <Text style={styles.statKey}>Audience</Text>
                  <Text style={styles.statVal}>
                    {(chan.followersCount / 1000).toFixed(1)}k
                  </Text>
                </View>
                <View>
                  <Text style={styles.statKey}>API Quota</Text>
                  <Text style={styles.statVal}>{pct}%</Text>
                </View>
                <View>
                  <Text style={styles.statKey}>Health</Text>
                  <View style={styles.optimalBadge}>
                    <Text style={styles.optimalText}>Optimal</Text>
                  </View>
                </View>
              </View>

              {/* API usage bar */}
              <View style={styles.quotaBarBg}>
                <View style={[styles.quotaBarFill, { width: `${pct}%`, backgroundColor: iconColor }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Active & Recent Simultaneous Upload Streams */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.recentActivity}</Text>
        <TouchableOpacity onPress={() => onNavigateTab('studio')}>
          <Text style={styles.seeAllText}>{t.seeAll} →</Text>
        </TouchableOpacity>
      </View>

      {videos.slice(0, 3).map((video) => (
        <View key={video.id} style={styles.videoStreamCard}>
          <Image source={{ uri: video.thumbnailUrl }} style={styles.videoThumb} />
          <View style={styles.videoDetails}>
            <View style={styles.videoHeaderRow}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
            </View>

            <View style={styles.streamPlatsRow}>
              {video.selectedPlatforms.map((plat) => {
                const st = video.platformStates[plat];
                const isLive = st?.status === 'published';
                return (
                  <View
                    key={plat}
                    style={[styles.platTag, isLive ? styles.platLive : styles.platProgress]}
                  >
                    <Ionicons
                      name={
                        plat === 'youtube'
                          ? 'logo-youtube'
                          : plat === 'facebook'
                          ? 'logo-facebook'
                          : 'logo-instagram'
                      }
                      size={11}
                      color={isLive ? '#10B981' : '#06B6D4'}
                    />
                    <Text style={[styles.platTagText, isLive && styles.platLiveText]}>
                      {plat.toUpperCase()} {isLive ? '✓' : `${st?.progress || 0}%`}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.videoFooterRow}>
              <Text style={styles.videoTime}>{video.createdAt}</Text>
              <Text style={styles.videoMeta}>{video.videoDuration} • {video.fileSize}</Text>
            </View>
          </View>
        </View>
      ))}

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
  heroCard: {
    backgroundColor: '#0D1527',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 18,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroBadge: {
    color: '#06B6D4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  heroActionText: {
    color: '#041B2D',
    fontSize: 12.5,
    fontWeight: '800',
  },
  quotaMeterCard: {
    backgroundColor: '#111D35',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  quotaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quotaLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quotaTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  quotaCountText: {
    color: '#10B981',
    fontSize: 12.5,
    fontWeight: '800',
  },
  slotSegmentsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  slotSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  slotSegmentFilled: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  slotSegmentVacant: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderColor: '#334155',
  },
  slotSegTime: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
  },
  quotaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  quotaNotice: {
    color: '#94A3B8',
    fontSize: 11,
    flex: 1,
    marginRight: 10,
  },
  quotaLink: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  metricIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  metricBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricSub: {
    color: '#64748B',
    fontSize: 10,
  },
  harvesterBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 20,
  },
  harvesterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  mailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  harvesterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  harvesterTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  harvDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotLive: {
    backgroundColor: '#10B981',
  },
  dotOff: {
    backgroundColor: '#64748B',
  },
  harvesterSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  harvTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  harvTriggerText: {
    color: '#06B6D4',
    fontSize: 11.5,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 11.5,
  },
  seeAllText: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
  channelsGrid: {
    gap: 10,
    marginBottom: 20,
  },
  channelCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
  },
  chanTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chanIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chanName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  chanHandle: {
    color: '#94A3B8',
    fontSize: 11,
  },
  syncChanBtn: {
    padding: 6,
  },
  chanStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statKey: {
    color: '#64748B',
    fontSize: 10,
    marginBottom: 2,
  },
  statVal: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
  },
  optimalBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optimalText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  quotaBarBg: {
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
  },
  quotaBarFill: {
    height: '100%',
  },
  videoStreamCard: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  videoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#1E293B',
  },
  videoDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoHeaderRow: {
    marginBottom: 4,
  },
  videoTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  streamPlatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  platTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  platProgress: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  platLive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  platTagText: {
    color: '#06B6D4',
    fontSize: 9.5,
    fontWeight: '700',
  },
  platLiveText: {
    color: '#10B981',
  },
  videoFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoTime: {
    color: '#64748B',
    fontSize: 10.5,
  },
  videoMeta: {
    color: '#94A3B8',
    fontSize: 10.5,
  },
});
