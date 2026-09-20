import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Vibration,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

interface OtpVerificationModalProps {
  visible: boolean;
  targetAddress: string;
  expectedOtp?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  visible,
  targetAddress,
  expectedOtp = '789012',
  onSuccess,
  onClose,
}) => {
  const { t, verifyOtp } = useApp();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible) {
      setTimer(45);
      setDigits(['', '', '', '', '', '']);
      setErrorMsg('');
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible]);

  const handleDigitChange = (val: string, index: number) => {
    setErrorMsg('');
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    // If all 6 digits entered, auto-verify
    if (val && index === 5 && newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleVerify = (otpToTest?: string) => {
    const code = otpToTest || digits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const ok = verifyOtp(code, expectedOtp);
      if (ok) {
        onSuccess();
      } else {
        Vibration.vibrate(200);
        setErrorMsg('Invalid OTP. Please check or use demo code.');
      }
    }, 700);
  };

  const autofillDemoOtp = () => {
    const arr = expectedOtp.split('');
    setDigits(arr);
    handleVerify(expectedOtp);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Ionicons name="chatbox-ellipses" size={16} color="#06B6D4" />
              <Text style={styles.badgeText}>SMS & EMAIL OTP VERIFIER</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{t.otpModalTitle}</Text>
          <Text style={styles.subtitle}>
            {t.otpSentTo}{' '}
            <Text style={styles.highlightPhone}>{targetAddress || '+91 98765 43210'}</Text>
          </Text>

          {/* Quick Demo Autofill helper */}
          <TouchableOpacity
            style={styles.autofillBanner}
            onPress={autofillDemoOtp}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={14} color="#F59E0B" />
            <Text style={styles.autofillText}>
              Tap to Autofill Test OTP ({expectedOtp})
            </Text>
          </TouchableOpacity>

          {/* 6 Digit Input Row */}
          <View style={styles.inputsRow}>
            {digits.map((digit, idx) => (
              <TextInput
                key={idx}
                style={[
                  styles.digitBox,
                  digit ? styles.digitBoxFilled : null,
                  errorMsg ? styles.digitBoxError : null,
                ]}
                value={digit}
                onChangeText={(val) => handleDigitChange(val.slice(-1), idx)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Action button */}
          <TouchableOpacity
            style={[styles.verifyBtn, isVerifying && styles.verifyBtnDisabled]}
            onPress={() => handleVerify()}
            disabled={isVerifying}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.verifyBtnText}>
              {isVerifying ? 'Verifying...' : t.verifyAndProceed}
            </Text>
          </TouchableOpacity>

          {/* Resend timer */}
          <View style={styles.resendRow}>
            <Text style={styles.resendInfo}>Didn't receive code? </Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(45)}>
                <Text style={styles.resendLink}>{t.resendOtp}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 24,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  badgeText: {
    color: '#06B6D4',
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
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  highlightPhone: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  autofillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 20,
  },
  autofillText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  digitBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  digitBoxFilled: {
    borderColor: '#06B6D4',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  digitBoxError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  verifyBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  verifyBtnDisabled: {
    opacity: 0.6,
  },
  verifyBtnText: {
    color: '#041B2D',
    fontSize: 15,
    fontWeight: '800',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  resendInfo: {
    color: '#64748B',
    fontSize: 12,
  },
  timerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  resendLink: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
