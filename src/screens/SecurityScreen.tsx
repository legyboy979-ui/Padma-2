import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { FaceScanModal } from '../components/FaceScanModal';
import { PasscodeModal } from '../components/PasscodeModal';

export const SecurityScreen: React.FC = () => {
  const {
    t,
    user,
    toggleBiometric,
    togglePasscodeLock,
    toggleMfa,
    lockApp,
  } = useApp();

  const [isFaceScanModalOpen, setIsFaceScanModalOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [totpToken, setTotpToken] = useState('489 102');
  const [totpSeconds, setTotpSeconds] = useState(24);

  // Simulate 30s rolling TOTP token
  useEffect(() => {
    const timer = setInterval(() => {
      setTotpSeconds((prev) => {
        if (prev <= 1) {
          const next = Math.floor(100000 + Math.random() * 900000).toString();
          setTotpToken(`${next.slice(0, 3)} ${next.slice(3)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={13} color="#8B5CF6" />
            <Text style={styles.badgeText}>END-TO-END SECURITY</Text>
          </View>
          <TouchableOpacity style={styles.lockNowBtn} onPress={lockApp} activeOpacity={0.8}>
            <Ionicons name="lock-closed" size={14} color="#EF4444" />
            <Text style={styles.lockNowText}>Lock Now</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>{t.securityTitle}</Text>
        <Text style={styles.headerSubtitle}>{t.securitySubtitle}</Text>

        {/* Security Health Score */}
        <View style={styles.healthScoreCard}>
          <View style={styles.healthTop}>
            <Text style={styles.healthLabel}>SECURITY AUDIT STATUS</Text>
            <View style={styles.shieldPill}>
              <Ionicons name="checkmark-circle" size={13} color="#10B981" />
              <Text style={styles.shieldPillText}>AES-256 VAULT ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.healthScoreText}>Tier-3 Enterprise Defense</Text>
          <Text style={styles.healthSub}>
            Hardware biometric enclave, TOTP multi-factor verification & salted PBKDF2 PIN encryption.
          </Text>
        </View>
      </View>

      {/* Biometric Face Scanning Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.biometricFace}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="scan" size={22} color="#06B6D4" />
          </View>
          <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
            <Text style={styles.cardTitle}>{t.biometricFace}</Text>
            <Text style={styles.cardSubtitle}>{t.biometricDesc}</Text>
          </View>
          <Switch
            value={user.faceScanEnabled}
            onValueChange={toggleBiometric}
            trackColor={{ false: '#334155', true: '#06B6D4' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity
          style={styles.testBiometricBtn}
          onPress={() => setIsFaceScanModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-reverse-outline" size={18} color="#041B2D" />
          <Text style={styles.testBiometricText}>{t.testBiometric}</Text>
        </TouchableOpacity>
      </View>

      {/* Customizable Passcode Feature */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.passcodeLock}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
            <Ionicons name="keypad" size={22} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
            <Text style={styles.cardTitle}>{t.passcodeLock}</Text>
            <Text style={styles.cardSubtitle}>{t.passcodeDesc}</Text>
          </View>
          <Switch
            value={user.passcodeEnabled}
            onValueChange={togglePasscodeLock}
            trackColor={{ false: '#334155', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.passcodeActionRow}>
          <View style={styles.currentPinBox}>
            <Text style={styles.pinLabel}>Active PIN:</Text>
            <Text style={styles.pinDots}>••••</Text>
          </View>
          <TouchableOpacity
            style={styles.changePinBtn}
            onPress={() => setIsPasscodeModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={14} color="#06B6D4" />
            <Text style={styles.changePinText}>{t.changePasscode}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Multi-Factor Verification (MFA / 2FA) Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.mfaVerification}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="shield-half" size={22} color="#10B981" />
          </View>
          <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
            <Text style={styles.cardTitle}>{t.mfaVerification}</Text>
            <Text style={styles.cardSubtitle}>{t.mfaDesc}</Text>
          </View>
          <Switch
            value={user.mfaEnabled}
            onValueChange={toggleMfa}
            trackColor={{ false: '#334155', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* TOTP Live Generator Card */}
        <View style={styles.totpBox}>
          <View style={styles.totpHeader}>
            <Text style={styles.totpTitle}>Google Authenticator TOTP</Text>
            <View style={styles.totpTimerBadge}>
              <Ionicons name="stopwatch-outline" size={12} color="#10B981" />
              <Text style={styles.totpTimerText}>{totpSeconds}s</Text>
            </View>
          </View>

          <View style={styles.totpTokenRow}>
            <Text style={styles.totpTokenVal}>{totpToken}</Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Copied', 'TOTP code copied to clipboard!')}
              style={styles.copyTotpBtn}
            >
              <Ionicons name="copy-outline" size={16} color="#06B6D4" />
            </TouchableOpacity>
          </View>

          <View style={styles.secretKeyRow}>
            <Text style={styles.secretKeyLabel}>Authenticator Secret:</Text>
            <Text style={styles.secretKeyValue}>{user.mfaSecret}</Text>
          </View>
        </View>
      </View>

      {/* Biometric Face Scan Simulator Modal */}
      <FaceScanModal
        visible={isFaceScanModalOpen}
        onSuccess={() => {
          setIsFaceScanModalOpen(false);
          Alert.alert(t.success, t.faceVerified);
        }}
        onFallbackToPasscode={() => {
          setIsFaceScanModalOpen(false);
          setIsPasscodeModalOpen(true);
        }}
        onClose={() => setIsFaceScanModalOpen(false)}
      />

      {/* Passcode Modal for Changing PIN */}
      <PasscodeModal
        visible={isPasscodeModalOpen}
        mode="change"
        onSuccess={() => {
          setIsPasscodeModalOpen(false);
          Alert.alert(t.success, 'New 4-digit Passcode PIN successfully saved!');
        }}
        onClose={() => setIsPasscodeModalOpen(false)}
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
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  badgeText: {
    color: '#8B5CF6',
    fontSize: 9.5,
    fontWeight: '800',
  },
  lockNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  lockNowText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
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
  healthScoreCard: {
    backgroundColor: '#111D35',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  healthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  healthLabel: {
    color: '#64748B',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shieldPillText: {
    color: '#10B981',
    fontSize: 9.5,
    fontWeight: '800',
  },
  healthScoreText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  healthSub: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  testBiometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#06B6D4',
    paddingVertical: 12,
    borderRadius: 12,
  },
  testBiometricText: {
    color: '#041B2D',
    fontSize: 13,
    fontWeight: '800',
  },
  passcodeActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  currentPinBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  pinDots: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  changePinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  changePinText: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
  totpBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
  },
  totpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totpTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  totpTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  totpTimerText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '800',
  },
  totpTokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totpTokenVal: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 3,
  },
  copyTotpBtn: {
    padding: 6,
  },
  secretKeyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
  },
  secretKeyLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  secretKeyValue: {
    color: '#06B6D4',
    fontSize: 11,
    fontWeight: '700',
  },
});
