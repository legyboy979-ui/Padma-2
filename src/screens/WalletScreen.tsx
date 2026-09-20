import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { WalletWithdrawModal } from '../components/WalletWithdrawModal';
import { SubscriptionModal } from '../components/SubscriptionModal';

export const WalletScreen: React.FC = () => {
  const { t, wallet, subscription } = useApp();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Subscription & Freemium Model Header Card */}
      <View style={styles.planCard}>
        <View style={styles.planCardTop}>
          <View>
            <View style={styles.planTag}>
              <Ionicons name="diamond" size={12} color="#F59E0B" />
              <Text style={styles.planTagText}>
                {subscription.isTrial ? 'FREEMIUM MODEL' : 'PREMIUM SUBSCRIPTION'}
              </Text>
            </View>
            <Text style={styles.planTitle}>{subscription.name}</Text>
          </View>

          <TouchableOpacity
            style={styles.changePlanBtn}
            onPress={() => setIsPlansModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal" size={14} color="#041B2D" />
            <Text style={styles.changePlanText}>Plans</Text>
          </TouchableOpacity>
        </View>

        {/* 7-Day Trial or Paid status bar */}
        {subscription.isTrial ? (
          <View style={styles.trialHighlight}>
            <View style={styles.trialRow}>
              <Text style={styles.trialDaysVal}>
                {subscription.trialDaysLeft} Days Left
              </Text>
              <Text style={styles.trialRateText}>Public Access: ₹500/month</Text>
            </View>
            <View style={styles.trialTrack}>
              <View
                style={[
                  styles.trialFill,
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
            <Text style={styles.trialSubNotice}>
              7-day free trial includes 4x daily scheduling, multi-upload & Gmail harvester. Structured plans up to 3 months available.
            </Text>
          </View>
        ) : (
          <View style={styles.activePlanInfo}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.activePlanDateText}>
              Subscription active until {subscription.expiryDate} (Renewing at ₹500/mo)
            </Text>
          </View>
        )}
      </View>

      {/* Wallet Balance Hero Card */}
      <View style={styles.walletHeroCard}>
        <View style={styles.walletTopRow}>
          <View>
            <Text style={styles.walletSubTitle}>{t.balanceLabel}</Text>
            <Text style={styles.walletBalanceText}>
              ₹{wallet.availableBalance.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.walletBadgeIcon}>
            <Ionicons name="cash-outline" size={26} color="#10B981" />
          </View>
        </View>

        {/* Sub metrics */}
        <View style={styles.walletMetricsGrid}>
          <View style={styles.walletMetricItem}>
            <Text style={styles.wMetricKey}>{t.lifetimeEarnings}</Text>
            <Text style={styles.wMetricVal}>
              ₹{wallet.lifetimeEarnings.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.walletMetricItem}>
            <Text style={styles.wMetricKey}>{t.pendingPayout}</Text>
            <Text style={[styles.wMetricVal, { color: '#F59E0B' }]}>
              ₹{wallet.pendingClearance.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.walletMetricItem}>
            <Text style={styles.wMetricKey}>THRESHOLD</Text>
            <Text style={styles.wMetricVal}>₹{wallet.minWithdrawal}</Text>
          </View>
        </View>

        {/* Withdraw Action CTA */}
        <TouchableOpacity
          style={styles.withdrawBtn}
          onPress={() => setIsWithdrawModalOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-up-circle" size={20} color="#FFFFFF" />
          <Text style={styles.withdrawBtnText}>{t.withdrawButton}</Text>
        </TouchableOpacity>

        <View style={styles.withdrawalInfoRow}>
          <Ionicons name="shield-checkmark" size={12} color="#94A3B8" />
          <Text style={styles.withdrawalInfoText}>
            Instant withdrawal to UPI (GPay / PhonePe / Paytm) & Bank IMPS. Min: ₹500
          </Text>
        </View>
      </View>

      {/* Revenue Sources Breakdown */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cross-Platform Monetization</Text>
      </View>

      <View style={styles.sourcesGrid}>
        <View style={styles.sourceCard}>
          <View style={styles.sourceTop}>
            <Ionicons name="logo-youtube" size={18} color="#FF0000" />
            <Text style={styles.sourceAmount}>₹14,200</Text>
          </View>
          <Text style={styles.sourceName}>YouTube AdSense & Shorts</Text>
        </View>

        <View style={styles.sourceCard}>
          <View style={styles.sourceTop}>
            <Ionicons name="logo-facebook" size={18} color="#1877F2" />
            <Text style={styles.sourceAmount}>₹10,800</Text>
          </View>
          <Text style={styles.sourceName}>FB Reels Creator Bonus</Text>
        </View>

        <View style={styles.sourceCard}>
          <View style={styles.sourceTop}>
            <Ionicons name="logo-instagram" size={18} color="#E1306C" />
            <Text style={styles.sourceAmount}>₹7,600</Text>
          </View>
          <Text style={styles.sourceName}>IG Brand Collabs</Text>
        </View>
      </View>

      {/* Transaction & Payout History Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.transactionHistory}</Text>
        <Text style={styles.sectionSubtitle}>
          {wallet.transactions.length} Records
        </Text>
      </View>

      {wallet.transactions.map((tx) => {
        const isWithdrawal = tx.type === 'withdrawal';
        const isCompleted = tx.status === 'Completed';

        return (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.txIconBox}>
              <Ionicons
                name={isWithdrawal ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={22}
                color={isWithdrawal ? '#EF4444' : '#10B981'}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.txDesc} numberOfLines={1}>
                {tx.description}
              </Text>
              <View style={styles.txMetaRow}>
                <Text style={styles.txTime}>{tx.timestamp}</Text>
                <Text style={styles.txRef}>Ref: {tx.refNumber}</Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
              <Text
                style={[
                  styles.txAmount,
                  isWithdrawal ? styles.txAmountRed : styles.txAmountGreen,
                ]}
              >
                {isWithdrawal ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
              </Text>
              <View
                style={[
                  styles.statusTag,
                  isCompleted ? styles.statusTagDone : styles.statusTagProc,
                ]}
              >
                <Text
                  style={[
                    styles.statusTagText,
                    isCompleted ? styles.statusTextDone : styles.statusTextProc,
                  ]}
                >
                  {tx.status}
                </Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Modals */}
      <WalletWithdrawModal
        visible={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />

      <SubscriptionModal
        visible={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
      />

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
  planCard: {
    backgroundColor: '#0D1527',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    marginBottom: 16,
  },
  planCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  planTagText: {
    color: '#F59E0B',
    fontSize: 9.5,
    fontWeight: '800',
  },
  planTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  changePlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  changePlanText: {
    color: '#041B2D',
    fontSize: 12,
    fontWeight: '800',
  },
  trialHighlight: {
    backgroundColor: '#111D35',
    borderRadius: 12,
    padding: 12,
  },
  trialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trialDaysVal: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '800',
  },
  trialRateText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  trialTrack: {
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  trialFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  trialSubNotice: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  activePlanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activePlanDateText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  walletHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 18,
    marginBottom: 16,
  },
  walletTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletSubTitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  walletBalanceText: {
    color: '#10B981',
    fontSize: 32,
    fontWeight: '800',
  },
  walletBadgeIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  walletMetricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  walletMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  wMetricKey: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  wMetricVal: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '800',
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  withdrawalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  withdrawalInfoText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
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
  sourcesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  sourceCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
  },
  sourceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sourceAmount: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  sourceName: {
    color: '#94A3B8',
    fontSize: 10.5,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 10,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDesc: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  txMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  txTime: {
    color: '#64748B',
    fontSize: 10.5,
  },
  txRef: {
    color: '#64748B',
    fontSize: 10.5,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  txAmountGreen: {
    color: '#10B981',
  },
  txAmountRed: {
    color: '#EF4444',
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusTagDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusTagProc: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusTagText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  statusTextDone: {
    color: '#10B981',
  },
  statusTextProc: {
    color: '#F59E0B',
  },
});
