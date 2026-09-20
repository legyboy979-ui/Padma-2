import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { OtpVerificationModal } from '../components/OtpVerificationModal';

interface AuthRegisterScreenProps {
  onSuccess: () => void;
}

export const AuthRegisterScreen: React.FC<AuthRegisterScreenProps> = ({ onSuccess }) => {
  const { t, language, toggleLanguage, registerWithOtp } = useApp();

  const [name, setName] = useState('Devendra Sharma');
  const [email, setEmail] = useState('creator.media@omnistream.ai');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('789012');

  const handleSendOtp = async () => {
    const otp = await registerWithOtp(name, email, phone);
    setGeneratedOtp(otp);
    setIsOtpModalOpen(true);
  };

  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false);
    onSuccess();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top language switch */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Ionicons name="sparkles" size={16} color="#06B6D4" />
            </View>
            <Text style={styles.brandName}>OmniStream <Text style={{ color: '#06B6D4' }}>AI</Text></Text>
          </View>

          <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
            <Ionicons name="globe-outline" size={14} color="#06B6D4" />
            <Text style={styles.langText}>{language === 'en' ? 'हिन्दी' : 'EN'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroBox}>
          <View style={styles.trialPill}>
            <Ionicons name="gift-outline" size={12} color="#F59E0B" />
            <Text style={styles.trialPillText}>{t.trialBadge} INCLUDED</Text>
          </View>
          <Text style={styles.title}>{t.authRegisterTitle}</Text>
          <Text style={styles.subtitle}>{t.authRegisterSubtitle}</Text>
        </View>

        {/* Freemium Benefits Banner */}
        <View style={styles.freemiumCard}>
          <Text style={styles.freemiumHeading}>Freemium Trial Features (7 Days Free)</Text>
          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.bulletText}>Simultaneous 3-Platform Upload (YouTube + FB + IG)</Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.bulletText}>Guaranteed 4 Videos Daily High-Volume Scheduler</Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.bulletText}>Automated Gmail Ingestion & Monetization Wallet</Text>
          </View>
          <Text style={styles.afterTrialText}>
            Public access continues at only ₹500 / month after trial with instant UPI withdrawal.
          </Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>{t.fullName}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Devendra Sharma"
              placeholderTextColor="#64748B"
            />
          </View>

          <Text style={styles.inputLabel}>{t.emailAddress}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="creator.media@omnistream.ai"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>{t.phoneNumber}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={18} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
            />
          </View>

          {/* OTP Action Button */}
          <TouchableOpacity
            style={styles.sendOtpBtn}
            onPress={handleSendOtp}
            activeOpacity={0.85}
          >
            <Ionicons name="shield-checkmark" size={18} color="#041B2D" />
            <Text style={styles.sendOtpBtnText}>{t.sendOtp}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Skip */}
        <TouchableOpacity style={styles.demoSkipBtn} onPress={onSuccess} activeOpacity={0.7}>
          <Text style={styles.demoSkipText}>Demo Quick Access (Bypass OTP)</Text>
          <Ionicons name="arrow-forward" size={14} color="#06B6D4" />
        </TouchableOpacity>
      </ScrollView>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        visible={isOtpModalOpen}
        targetAddress={phone || email}
        expectedOtp={generatedOtp}
        onSuccess={handleOtpSuccess}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  langText: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
  heroBox: {
    marginBottom: 16,
  },
  trialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 8,
  },
  trialPillText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  freemiumCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    padding: 14,
    marginBottom: 18,
  },
  freemiumHeading: {
    color: '#10B981',
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  bulletText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  afterTrialText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.15)',
    paddingTop: 6,
  },
  formCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },
  sendOtpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  sendOtpBtnText: {
    color: '#041B2D',
    fontSize: 14,
    fontWeight: '800',
  },
  demoSkipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  demoSkipText: {
    color: '#06B6D4',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
