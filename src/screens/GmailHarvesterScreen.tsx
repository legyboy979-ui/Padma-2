import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

export const GmailHarvesterScreen: React.FC = () => {
  const {
    t,
    gmailHarvests,
    isHarvesterActive,
    toggleHarvester,
    runManualGmailHarvest,
    autoRouteHarvestItem,
  } = useApp();

  const [isPolling, setIsPolling] = useState(false);
  const [autoRouteEnabled, setAutoRouteEnabled] = useState(true);

  const handleManualPoll = async () => {
    setIsPolling(true);
    try {
      const count = await runManualGmailHarvest();
      Alert.alert(t.success, `Gmail poll completed! Found ${count} new video submission(s).`);
    } catch {
      Alert.alert(t.error, 'Failed to poll Gmail inbox');
    } finally {
      setIsPolling(false);
    }
  };

  const handlePushToSchedule = (id: string) => {
    autoRouteHarvestItem(id);
    Alert.alert(t.success, 'Video auto-routed into today’s vacant daily slot!');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Harvester Engine Banner */}
      <View style={styles.headerCard}>
        <View style={styles.topRow}>
          <View style={styles.botBadge}>
            <Ionicons name="mail-open" size={13} color="#EF4444" />
            <Text style={styles.botBadgeText}>AUTOMATED GMAIL INGESTION</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {isHarvesterActive ? t.harvesterActive : t.harvesterIdle}
            </Text>
            <Switch
              value={isHarvesterActive}
              onValueChange={toggleHarvester}
              trackColor={{ false: '#334155', true: '#06B6D4' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.headerTitle}>{t.harvesterTitle}</Text>
        <Text style={styles.headerSubtitle}>{t.harvesterSubtitle}</Text>

        {/* Monitored Account Info */}
        <View style={styles.inboxInfoCard}>
          <View style={styles.mailRow}>
            <Ionicons name="mail" size={16} color="#06B6D4" />
            <Text style={styles.inboxEmail}>creator.media.inbox@gmail.com</Text>
          </View>
          <View style={styles.syncRow}>
            <View style={styles.pulseGreen} />
            <Text style={styles.syncStatusText}>{t.inboxStatus}</Text>
          </View>
        </View>

        {/* Manual Poll Button */}
        <TouchableOpacity
          style={[styles.pollBtn, isPolling && styles.pollBtnDisabled]}
          onPress={handleManualPoll}
          disabled={isPolling}
          activeOpacity={0.8}
        >
          {isPolling ? (
            <>
              <ActivityIndicator size="small" color="#041B2D" />
              <Text style={styles.pollBtnText}>{t.extracting}</Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-download-outline" size={18} color="#041B2D" />
              <Text style={styles.pollBtnText}>{t.harvestNow}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Ingestion Rules Configuration */}
      <View style={styles.rulesCard}>
        <Text style={styles.rulesHeading}>{t.autoRoutingRule}</Text>
        <View style={styles.ruleOptionRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.ruleOptionTitle}>{t.routeToSchedule}</Text>
            <Text style={styles.ruleOptionSub}>
              Immediately balance into the 4 daily prime slots (09:00, 13:00, 18:00, 21:00)
            </Text>
          </View>
          <Switch
            value={autoRouteEnabled}
            onValueChange={setAutoRouteEnabled}
            trackColor={{ false: '#334155', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Harvested Email Video Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.receivedHarvests}</Text>
        <Text style={styles.sectionSubtitle}>
          {gmailHarvests.length} Videos Harvested
        </Text>
      </View>

      {gmailHarvests.map((item) => {
        const isScheduled = item.harvestStatus === 'auto_scheduled';
        const isNew = item.harvestStatus === 'new';

        return (
          <View key={item.id} style={styles.harvestItemCard}>
            <View style={styles.itemTopRow}>
              <View style={styles.senderGroup}>
                <Ionicons name="person-circle-outline" size={18} color="#94A3B8" />
                <View>
                  <Text style={styles.senderName}>{item.senderName}</Text>
                  <Text style={styles.senderEmail}>{item.senderEmail}</Text>
                </View>
              </View>
              <Text style={styles.receivedTime}>{item.receivedTime}</Text>
            </View>

            <Text style={styles.emailSubject}>{item.subject}</Text>

            {/* Video File Specs */}
            <View style={styles.assetPreviewBox}>
              <Image source={{ uri: item.thumbnail }} style={styles.assetThumb} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.fileRow}>
                  <Ionicons name="videocam" size={14} color="#06B6D4" />
                  <Text style={styles.fileName}>{item.videoFileName}</Text>
                </View>
                <Text style={styles.fileSizeText}>
                  {t.size}: {item.videoSize}
                </Text>
                {item.driveLink && (
                  <View style={styles.driveLinkRow}>
                    <Ionicons name="logo-google" size={12} color="#F59E0B" />
                    <Text style={styles.driveLinkText} numberOfLines={1}>
                      Google Drive Link Verified
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action Bar */}
            <View style={styles.itemActionRow}>
              <View style={styles.suggestedSlotBadge}>
                <Ionicons name="time-outline" size={12} color="#64748B" />
                <Text style={styles.suggestedSlotText}>
                  {item.suggestedSlot || '09:00 PM Slot'}
                </Text>
              </View>

              {isScheduled ? (
                <View style={styles.scheduledPill}>
                  <Ionicons name="checkmark-done" size={14} color="#10B981" />
                  <Text style={styles.scheduledPillText}>Auto-Scheduled</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.pushScheduleBtn}
                  onPress={() => handlePushToSchedule(item.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="calendar-outline" size={13} color="#041B2D" />
                  <Text style={styles.pushScheduleBtnText}>
                    Push to 4x Schedule
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

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
    marginBottom: 10,
  },
  botBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  botBadgeText: {
    color: '#EF4444',
    fontSize: 9.5,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
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
    marginBottom: 14,
  },
  inboxInfoCard: {
    backgroundColor: '#111D35',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    marginBottom: 14,
  },
  mailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  inboxEmail: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  syncStatusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
  },
  pollBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#06B6D4',
    paddingVertical: 12,
    borderRadius: 12,
  },
  pollBtnDisabled: {
    opacity: 0.6,
  },
  pollBtnText: {
    color: '#041B2D',
    fontSize: 13.5,
    fontWeight: '800',
  },
  rulesCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 18,
  },
  rulesHeading: {
    color: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  ruleOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ruleOptionTitle: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  ruleOptionSub: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
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
  harvestItemCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 12,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  senderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  senderName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  senderEmail: {
    color: '#64748B',
    fontSize: 10.5,
  },
  receivedTime: {
    color: '#64748B',
    fontSize: 10.5,
  },
  emailSubject: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  assetPreviewBox: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  assetThumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  fileName: {
    color: '#06B6D4',
    fontSize: 11.5,
    fontWeight: '700',
  },
  fileSizeText: {
    color: '#94A3B8',
    fontSize: 10.5,
  },
  driveLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  driveLinkText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '600',
  },
  itemActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestedSlotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  suggestedSlotText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  scheduledPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  scheduledPillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  pushScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pushScheduleBtnText: {
    color: '#041B2D',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
