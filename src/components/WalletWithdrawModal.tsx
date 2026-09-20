import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

interface WalletWithdrawModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WalletWithdrawModal: React.FC<WalletWithdrawModalProps> = ({ visible, onClose }) => {
  const { t, wallet, requestWithdrawal } = useApp();
  const [amount, setAmount] = useState('1000');
  const [method, setMethod] = useState<'UPI' | 'PhonePe' | 'Google Pay' | 'Bank IMPS'>('UPI');
  const [accountDetail, setAccountDetail] = useState('creator@okaxis');
  const [bankIfsc, setBankIfsc] = useState('HDFC0001234');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [500, 1000, 2500, wallet.availableBalance];

  const handleWithdraw = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert(t.error, 'Please enter a valid amount');
      return;
    }
    if (num < wallet.minWithdrawal) {
      Alert.alert(t.error, t.minWithdrawalNotice);
      return;
    }
    if (num > wallet.availableBalance) {
      Alert.alert(t.error, t.insufficientBalance);
      return;
    }

    const destination = method === 'Bank IMPS' ? `${accountDetail} (${bankIfsc})` : accountDetail;
    if (!destination.trim()) {
      Alert.alert(t.error, 'Please enter valid payout account details');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = requestWithdrawal(num, method, destination);
      setIsSubmitting(false);
      if (res.success) {
        Alert.alert(t.success, res.message);
        onClose();
      } else {
        Alert.alert(t.error, res.message);
      }
    }, 800);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Ionicons name="cash" size={15} color="#10B981" />
              <Text style={styles.badgeText}>INSTANT EARNINGS PAYOUT</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{t.withdrawModalTitle}</Text>
          <Text style={styles.subtitle}>{t.walletSubtitle}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Balance Card */}
            <View style={styles.balanceInfoBox}>
              <View>
                <Text style={styles.balKey}>{t.balanceLabel}</Text>
                <Text style={styles.balVal}>₹{wallet.availableBalance.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.thresholdBadge}>
                <Ionicons name="information-circle" size={13} color="#F59E0B" />
                <Text style={styles.thresholdText}>Min: ₹{wallet.minWithdrawal}</Text>
              </View>
            </View>

            {/* Amount input */}
            <Text style={styles.fieldLabel}>{t.withdrawAmount}</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="500"
                placeholderTextColor="#64748B"
              />
            </View>

            {/* Quick preset buttons */}
            <View style={styles.presetsRow}>
              {presets.map((val, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.presetBtn, amount === val.toString() && styles.presetBtnActive]}
                  onPress={() => setAmount(val.toString())}
                >
                  <Text
                    style={[
                      styles.presetText,
                      amount === val.toString() && styles.presetTextActive,
                    ]}
                  >
                    {val === wallet.availableBalance ? 'Max' : `₹${val}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payout Channels */}
            <Text style={styles.fieldLabel}>{t.payoutMethod}</Text>
            <View style={styles.methodsRow}>
              {(['UPI', 'PhonePe', 'Google Pay', 'Bank IMPS'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodChip, method === m && styles.methodChipActive]}
                  onPress={() => {
                    setMethod(m);
                    if (m === 'UPI') setAccountDetail('creator@okaxis');
                    else if (m === 'PhonePe') setAccountDetail('+91 98765 43210');
                    else if (m === 'Google Pay') setAccountDetail('creator@okhdfcbank');
                    else if (m === 'Bank IMPS') setAccountDetail('5010023491823');
                  }}
                >
                  <Text
                    style={[styles.methodText, method === m && styles.methodTextActive]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Account input */}
            <Text style={styles.fieldLabel}>
              {method === 'UPI' || method === 'Google Pay'
                ? t.upiIdLabel
                : method === 'PhonePe'
                ? t.phonePeLabel
                : t.bankAccountLabel}
            </Text>
            <View style={styles.accountInputWrapper}>
              <TextInput
                style={styles.textInput}
                value={accountDetail}
                onChangeText={setAccountDetail}
                placeholder={
                  method === 'UPI' ? 'username@upi' : method === 'PhonePe' ? '+91 98765 43210' : 'Account Number'
                }
                placeholderTextColor="#64748B"
                autoCapitalize="none"
              />
            </View>

            {method === 'Bank IMPS' && (
              <>
                <Text style={styles.fieldLabel}>Bank IFSC Code</Text>
                <View style={styles.accountInputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={bankIfsc}
                    onChangeText={setBankIfsc}
                    placeholder="e.g. HDFC0001234"
                    placeholderTextColor="#64748B"
                    autoCapitalize="characters"
                  />
                </View>
              </>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleWithdraw}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Processing Payout...' : t.confirmWithdrawal}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 20,
    paddingBottom: 30,
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
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeText: {
    color: '#10B981',
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
  balanceInfoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  balKey: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 2,
  },
  balVal: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: '800',
  },
  thresholdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  thresholdText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 10,
  },
  currencyPrefix: {
    color: '#06B6D4',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  presetBtnActive: {
    borderColor: '#06B6D4',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
  },
  presetText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  presetTextActive: {
    color: '#06B6D4',
  },
  methodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  methodChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  methodChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  methodText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  methodTextActive: {
    color: '#10B981',
    fontWeight: '800',
  },
  accountInputWrapper: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
    marginBottom: 14,
  },
  textInput: {
    color: '#F8FAFC',
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
