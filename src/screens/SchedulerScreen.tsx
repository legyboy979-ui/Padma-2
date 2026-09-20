import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { ScheduleSlot, VideoItem } from '../types';

export const SchedulerScreen: React.FC = () => {
  const {
    t,
    schedule,
    videos,
    assignVideoToSlot,
    clearSlot,
    autoBalanceSchedule,
    language,
  } = useApp();

  const [activeDateTab, setActiveDateTab] = useState<'today' | 'tomorrow'>('today');
  const [selectedSlotForAssignment, setSelectedSlotForAssignment] = useState<ScheduleSlot | null>(null);

  const filledCount = schedule.slots.filter((s) => s.status !== 'vacant').length;

  const handlePickVideoForSlot = (video: VideoItem) => {
    if (selectedSlotForAssignment) {
      assignVideoToSlot(selectedSlotForAssignment.id, video.id);
      setSelectedSlotForAssignment(null);
      Alert.alert(t.success, `Video assigned to ${selectedSlotForAssignment.time} slot!`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Engine Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.engineBadge}>
              <Ionicons name="hardware-chip-outline" size={12} color="#06B6D4" />
              <Text style={styles.engineBadgeText}>4X HIGH-VOLUME ENGINE</Text>
            </View>
            <Text style={styles.headerTitle}>{t.schedulerTitle}</Text>
          </View>

          <TouchableOpacity
            style={styles.autoBalanceBtn}
            onPress={autoBalanceSchedule}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={14} color="#041B2D" />
            <Text style={styles.autoBalanceText}>{t.autoBalanceSlots}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.headerSubtitle}>{t.schedulerSubtitle}</Text>

        {/* Throughput Metric Dashboard */}
        <View style={styles.throughputGrid}>
          <View style={styles.throughputItem}>
            <Text style={styles.throughputKey}>DAILY QUOTA</Text>
            <Text style={styles.throughputVal}>{filledCount} / 4 Done</Text>
          </View>
          <View style={styles.throughputItem}>
            <Text style={styles.throughputKey}>EST. 24H REACH</Text>
            <Text style={[styles.throughputVal, { color: '#10B981' }]}>148.5K</Text>
          </View>
          <View style={styles.throughputItem}>
            <Text style={styles.throughputKey}>CONFLICTS</Text>
            <Text style={[styles.throughputVal, { color: '#06B6D4' }]}>0 Detected</Text>
          </View>
        </View>
      </View>

      {/* Date Switcher */}
      <View style={styles.dateTabsRow}>
        <TouchableOpacity
          style={[styles.dateTab, activeDateTab === 'today' && styles.dateTabActive]}
          onPress={() => setActiveDateTab('today')}
        >
          <Ionicons
            name="today-outline"
            size={14}
            color={activeDateTab === 'today' ? '#06B6D4' : '#64748B'}
          />
          <Text
            style={[
              styles.dateTabText,
              activeDateTab === 'today' && styles.dateTabTextActive,
            ]}
          >
            {t.todaySchedule} (20 Sep 2026)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateTab, activeDateTab === 'tomorrow' && styles.dateTabActive]}
          onPress={() => setActiveDateTab('tomorrow')}
        >
          <Ionicons
            name="calendar-outline"
            size={14}
            color={activeDateTab === 'tomorrow' ? '#06B6D4' : '#64748B'}
          />
          <Text
            style={[
              styles.dateTabText,
              activeDateTab === 'tomorrow' && styles.dateTabTextActive,
            ]}
          >
            {t.tomorrowSchedule} (21 Sep 2026)
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4 Prime Time Slots Timeline */}
      <View style={styles.slotsList}>
        {schedule.slots.map((slot) => {
          const isPublished = slot.status === 'published';
          const isAssigned = slot.status === 'assigned';
          const isVacant = slot.status === 'vacant';

          const slotTitle = language === 'hi' ? slot.labelHi : slot.labelEn;
          const slotDesc = language === 'hi' ? slot.descriptionHi : slot.descriptionEn;

          return (
            <View
              key={slot.id}
              style={[
                styles.slotCard,
                isPublished && styles.slotCardPublished,
                isAssigned && styles.slotCardAssigned,
                isVacant && styles.slotCardVacant,
              ]}
            >
              {/* Slot Header */}
              <View style={styles.slotHeaderRow}>
                <View style={styles.slotTimeBadge}>
                  <Ionicons name="time" size={14} color="#06B6D4" />
                  <Text style={styles.slotTimeText}>{slot.time}</Text>
                  <Text style={styles.slotIndexBadge}>SLOT {slot.slotNumber}</Text>
                </View>

                <View style={styles.slotStatusPill}>
                  <Ionicons
                    name={
                      isPublished
                        ? 'checkmark-circle'
                        : isAssigned
                        ? 'hourglass-outline'
                        : 'add-circle-outline'
                    }
                    size={14}
                    color={isPublished ? '#10B981' : isAssigned ? '#06B6D4' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.slotStatusText,
                      isPublished && { color: '#10B981' },
                      isAssigned && { color: '#06B6D4' },
                    ]}
                  >
                    {isPublished
                      ? t.slotPublished
                      : isAssigned
                      ? t.slotAssigned
                      : t.slotVacant}
                  </Text>
                </View>
              </View>

              <Text style={styles.slotTitleText}>{slotTitle}</Text>
              <Text style={styles.slotDescText}>{slotDesc}</Text>

              {/* Slot Content or Vacant action */}
              {slot.assignedVideo ? (
                <View style={styles.assignedVideoBox}>
                  <Image
                    source={{ uri: slot.assignedVideo.thumbnailUrl }}
                    style={styles.assignedThumb}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.assignedTitle} numberOfLines={2}>
                      {slot.assignedVideo.title}
                    </Text>
                    <View style={styles.assignedMetaRow}>
                      <Text style={styles.assignedMeta}>
                        {slot.assignedVideo.videoDuration} • {slot.assignedVideo.fileSize}
                      </Text>
                      {/* Platforms */}
                      <View style={styles.targetPlats}>
                        {slot.assignedVideo.selectedPlatforms.map((p) => (
                          <Ionicons
                            key={p}
                            name={
                              p === 'youtube'
                                ? 'logo-youtube'
                                : p === 'facebook'
                                ? 'logo-facebook'
                                : 'logo-instagram'
                            }
                            size={12}
                            color="#94A3B8"
                          />
                        ))}
                      </View>
                    </View>
                  </View>

                  {!isPublished && (
                    <TouchableOpacity
                      style={styles.clearSlotBtn}
                      onPress={() => clearSlot(slot.id)}
                    >
                      <Ionicons name="close-circle" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.assignSlotBtn}
                  onPress={() => setSelectedSlotForAssignment(slot)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={18} color="#06B6D4" />
                  <Text style={styles.assignSlotText}>{t.assignVideoToSlot}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Video Assignment Picker Modal */}
      <Modal
        visible={!!selectedSlotForAssignment}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSlotForAssignment(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose Video to Assign</Text>
                <Text style={styles.modalSubtitle}>
                  Slot: {selectedSlotForAssignment?.time} (
                  {selectedSlotForAssignment?.labelEn})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedSlotForAssignment(null)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              {videos.map((vid) => (
                <TouchableOpacity
                  key={vid.id}
                  style={styles.videoPickItem}
                  onPress={() => handlePickVideoForSlot(vid)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: vid.thumbnailUrl }} style={styles.pickThumb} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.pickTitle} numberOfLines={2}>
                      {vid.title}
                    </Text>
                    <Text style={styles.pickMeta}>
                      {vid.videoDuration} • Source: {vid.source}
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={22} color="#06B6D4" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  engineBadgeText: {
    color: '#06B6D4',
    fontSize: 9.5,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  autoBalanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  autoBalanceText: {
    color: '#041B2D',
    fontSize: 12,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  throughputGrid: {
    flexDirection: 'row',
    backgroundColor: '#111D35',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
  },
  throughputItem: {
    flex: 1,
    alignItems: 'center',
  },
  throughputKey: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 3,
  },
  throughputVal: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  dateTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dateTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  dateTabActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: '#06B6D4',
  },
  dateTabText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  dateTabTextActive: {
    color: '#06B6D4',
    fontWeight: '700',
  },
  slotsList: {
    gap: 14,
    marginBottom: 20,
  },
  slotCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 16,
  },
  slotCardPublished: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
  slotCardAssigned: {
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  slotCardVacant: {
    borderStyle: 'dashed',
    borderColor: '#334155',
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotTimeText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  slotIndexBadge: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  slotStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slotStatusText: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '600',
  },
  slotTitleText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  slotDescText: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginBottom: 12,
  },
  assignedVideoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 10,
  },
  assignedThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  assignedTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  assignedMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  assignedMeta: {
    color: '#94A3B8',
    fontSize: 10.5,
  },
  targetPlats: {
    flexDirection: 'row',
    gap: 4,
  },
  clearSlotBtn: {
    padding: 6,
  },
  assignSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  assignSlotText: {
    color: '#06B6D4',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.94)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  videoPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  pickThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  pickTitle: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 17,
  },
  pickMeta: {
    color: '#94A3B8',
    fontSize: 10.5,
    marginTop: 2,
  },
});
