import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenSecurity?: () => void;
  onOpenPlans?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSecurity, onOpenPlans }) => {
  const { language, toggleLanguage, subscription, lockApp, isHarvesterActive } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="sparkles" size={16} color="#06B6D4" />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>OmniStream</Text>
            <Text style={styles.aiGlow}> AI</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.pulseDot, isHarvesterActive ? styles.dotGreen : styles.dotAmber]} />
            <Text style={styles.statusText}>
              {isHarvesterActive ? 'Harvester Bot Live' : 'Harvester Idle'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightActions}>
        {/* Subscription / Trial status badge */}
        <TouchableOpacity
          style={[styles.badgeBtn, subscription.isTrial ? styles.trialBadge : styles.proBadge]}
          onPress={onOpenPlans}
          activeOpacity={0.7}
        >
          <Ionicons
            name={subscription.isTrial ? 'time-outline' : 'shield-checkmark'}
            size={12}
            color={subscription.isTrial ? '#F59E0B' : '#10B981'}
          />
          <Text style={[styles.badgeText, subscription.isTrial ? styles.trialText : styles.proText]}>
            {subscription.isTrial ? `${subscription.trialDaysLeft}d Trial` : 'Pro Active'}
          </Text>
        </TouchableOpacity>

        {/* Dynamic Hindi / English Switcher */}
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage} activeOpacity={0.7}>
          <Ionicons name="globe-outline" size={14} color="#06B6D4" />
          <Text style={styles.langBtnText}>{language === 'en' ? 'हिन्दी' : 'EN'}</Text>
        </TouchableOpacity>

        {/* Security Quick Lock */}
        <TouchableOpacity style={styles.lockBtn} onPress={lockApp} activeOpacity={0.7}>
          <Ionicons name="finger-print" size={18} color="#8B5CF6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0A0F1D',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.35)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  aiGlow: {
    color: '#06B6D4',
    fontSize: 17,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotGreen: {
    backgroundColor: '#10B981',
  },
  dotAmber: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  trialBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  proBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trialText: {
    color: '#F59E0B',
  },
  proText: {
    color: '#10B981',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  langBtnText: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
  lockBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
