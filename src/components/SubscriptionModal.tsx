import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SubscriptionPlanId } from '../types';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ visible, onClose }) => {
  const { t, subscription, upgradeSubscription } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>('3months');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: '1month' as SubscriptionPlanId,
      name: t.plan1MonthTitle,
      price: t.plan1MonthPrice,
      period: t.plan1MonthPeriod,
      description: t.plan1MonthDesc,
      popular: false,
      savings: null,
      features: [
        'Simultaneous 3-platform upload (YT, FB, IG)',
        '4 videos daily high-volume scheduling',
        'OmniBrain AI description & hashtag engine',
        'Gmail inbox automated harvester bot',
      ],
    },
    {
      id: '2months' as SubscriptionPlanId,
      name: t.plan2MonthsTitle,
      price: t.plan2MonthsPrice,
      period: t.plan2MonthsPeriod,
      description: t.plan2MonthsDesc,
      popular: false,
      savings: 'Save ₹50 (5% OFF)',
      features: [
        'All 1-Month features included',
        'Priority 4K CDN transcoding queue',
        'Team access management (up to 5 editors)',
        'Earnings monetization wallet integration',
      ],
    },
    {
      id: '3months' as SubscriptionPlanId,
      name: t.plan3MonthsTitle,
      price: t.plan3MonthsPrice,
      period: t.plan3MonthsPeriod,
      description: t.plan3MonthsDesc,
      popular: true,
      savings: 'Save ₹150 (10% OFF)',
      features: [
        'Full 90-day Quarterly Creator Pass',
        'Unlimited automated Gmail video harvesting',
        'Full RBAC team permissions & draft approval',
        'Direct UPI & Bank instant earnings withdrawals',
        'Automated conflict resolver & slot auto-balancer',
      ],
    },
  ];

  const handleActivate = (planId: SubscriptionPlanId) => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeSubscription(planId);
      setIsProcessing(false);
      Alert.alert(t.success, t.paymentSuccess);
      onClose();
    }, 1000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Ionicons name="diamond" size={15} color="#F59E0B" />
              <Text style={styles.badgeText}>FREEMIUM & SUBSCRIPTIONS</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{t.plansTitle}</Text>
          <Text style={styles.subtitle}>{t.plansSubtitle}</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* 7-Day Free Trial Tracker */}
            <View style={styles.trialCard}>
              <View style={styles.trialTop}>
                <View style={styles.trialIcon}>
                  <Ionicons name="gift-outline" size={24} color="#F59E0B" />
                </View>
                <View style={styles.trialInfo}>
                  <Text style={styles.trialTitle}>{t.trialHeader}</Text>
                  <Text style={styles.trialSub}>
                    {subscription.isTrial
                      ? `${subscription.trialDaysLeft} days remaining of 7-day trial`
                      : 'Free trial converted to active paid tier'}
                  </Text>
                </View>
                {subscription.isTrial && (
                  <View style={styles.trialPill}>
                    <Text style={styles.trialPillText}>{subscription.trialDaysLeft}D LEFT</Text>
                  </View>
                )}
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.round(
                        ((subscription.totalTrialDays - subscription.trialDaysLeft) /
                          subscription.totalTrialDays) *
                          100
                      )}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.trialFeaturesText}>
                Includes full access to 4x daily scheduling, YouTube, FB, IG multi-upload, and Gmail harvester.
              </Text>
            </View>

            {/* Plans List Header */}
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionTitle}>{t.plansCoverPeriod}</Text>
            </View>

            {/* Plans Cards */}
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              const isCurrent = subscription.currentPlanId === p.id && !subscription.isTrial;

              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                    p.popular && styles.planCardPopular,
                  ]}
                  onPress={() => setSelectedPlan(p.id)}
                  activeOpacity={0.85}
                >
                  {p.popular && (
                    <View style={styles.popularBanner}>
                      <Ionicons name="flame" size={12} color="#FFFFFF" />
                      <Text style={styles.popularBannerText}>MOST POPULAR • BEST ROI</Text>
                    </View>
                  )}

                  <View style={styles.planHeaderRow}>
                    <View>
                      <Text style={styles.planName}>{p.name}</Text>
                      {p.savings && (
                        <View style={styles.savingsTag}>
                          <Text style={styles.savingsTagText}>{p.savings}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.priceContainer}>
                      <Text style={styles.priceVal}>{p.price}</Text>
                      <Text style={styles.periodVal}>{p.period}</Text>
                    </View>
                  </View>

                  <Text style={styles.planDesc}>{p.description}</Text>

                  {/* Feature Bullets */}
                  <View style={styles.featuresList}>
                    {p.features.map((feat, fIdx) => (
                      <View key={fIdx} style={styles.featRow}>
                        <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                        <Text style={styles.featText}>{feat}</Text>
                      </View>
                    ))}
                  </View>

                  {isCurrent ? (
                    <View style={styles.activePlanBadge}>
                      <Ionicons name="checkmark-done" size={16} color="#10B981" />
                      <Text style={styles.activePlanText}>{t.currentPlanBadge}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.selectBtn, isSelected && styles.selectBtnActive]}
                      onPress={() => handleActivate(p.id)}
                      disabled={isProcessing}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.selectBtnText,
                          isSelected && styles.selectBtnTextActive,
                        ]}
                      >
                        {isProcessing && selectedPlan === p.id
                          ? 'Activating...'
                          : `Choose ${p.name}`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.94)',
    justifyContent: 'flex-end',
  },
  card: {
    maxHeight: '92%',
    backgroundColor: '#0A0F1D',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    marginBottom: 16,
  },
  scroll: {
    marginBottom: 10,
  },
  trialCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.07)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 16,
    marginBottom: 16,
  },
  trialTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  trialIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trialInfo: {
    flex: 1,
  },
  trialTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  trialSub: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
  },
  trialPill: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trialPillText: {
    color: '#0A0F1D',
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  trialFeaturesText: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
  },
  sectionDivider: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  planCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    padding: 16,
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: '#06B6D4',
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
  },
  planCardPopular: {
    borderColor: '#8B5CF6',
  },
  popularBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  popularBannerText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    marginTop: 4,
  },
  planName: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },
  savingsTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  savingsTagText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceVal: {
    color: '#06B6D4',
    fontSize: 22,
    fontWeight: '800',
  },
  periodVal: {
    color: '#94A3B8',
    fontSize: 11,
  },
  planDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  featuresList: {
    gap: 8,
    marginBottom: 16,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featText: {
    color: '#CBD5E1',
    fontSize: 12.5,
  },
  selectBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectBtnActive: {
    backgroundColor: '#06B6D4',
    borderColor: '#06B6D4',
  },
  selectBtnText: {
    color: '#E2E8F0',
    fontSize: 13.5,
    fontWeight: '700',
  },
  selectBtnTextActive: {
    color: '#041B2D',
    fontWeight: '800',
  },
  activePlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  activePlanText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});
