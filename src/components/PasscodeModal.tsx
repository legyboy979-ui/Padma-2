import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

interface PasscodeModalProps {
  visible: boolean;
  mode?: 'unlock' | 'change';
  onSuccess: () => void;
  onFaceScanRequest?: () => void;
  onClose?: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  visible,
  mode = 'unlock',
  onSuccess,
  onFaceScanRequest,
  onClose,
}) => {
  const { t, unlockWithPasscode, updatePasscode, user } = useApp();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyPress = (num: string) => {
    setErrorMessage('');
    if (mode === 'unlock') {
      const nextPin = pin + num;
      if (nextPin.length <= 4) {
        setPin(nextPin);
        if (nextPin.length === 4) {
          const valid = unlockWithPasscode(nextPin);
          if (valid) {
            setPin('');
            onSuccess();
          } else {
            Vibration.vibrate(200);
            setErrorMessage(t.wrongPasscode);
            setTimeout(() => setPin(''), 500);
          }
        }
      }
    } else {
      // mode === 'change'
      if (step === 'enter') {
        const nextPin = pin + num;
        if (nextPin.length <= 4) {
          setPin(nextPin);
          if (nextPin.length === 4) {
            setStep('confirm');
          }
        }
      } else {
        const nextConfirm = confirmPin + num;
        if (nextConfirm.length <= 4) {
          setConfirmPin(nextConfirm);
          if (nextConfirm.length === 4) {
            if (nextConfirm === pin) {
              updatePasscode(nextConfirm);
              setPin('');
              setConfirmPin('');
              setStep('enter');
              onSuccess();
            } else {
              Vibration.vibrate(200);
              setErrorMessage(t.passcodeMismatch);
              setTimeout(() => {
                setConfirmPin('');
                setPin('');
                setStep('enter');
              }, 700);
            }
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (mode === 'unlock' || step === 'enter') {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
    setErrorMessage('');
  };

  const activeValue = mode === 'unlock' || step === 'enter' ? pin : confirmPin;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={20} color="#8B5CF6" />
            </View>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title}>
            {mode === 'unlock'
              ? t.enterPasscode
              : step === 'enter'
              ? t.setPasscode
              : t.confirmPasscode}
          </Text>

          <Text style={styles.subtitle}>
            {mode === 'unlock'
              ? `Securing OmniStream AI • Role: ${user.role}`
              : 'Choose a memorable 4-digit security PIN'}
          </Text>

          {/* PIN Dots Display */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = activeValue.length > idx;
              return (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    isFilled && styles.dotFilled,
                    errorMessage ? styles.dotError : null,
                  ]}
                />
              );
            })}
          </View>

          {/* Error Message */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {/* Keypad */}
          <View style={styles.keypad}>
            {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].map((row, rIdx) => (
              <View key={rIdx} style={styles.keyRow}>
                {row.map((digit) => (
                  <TouchableOpacity
                    key={digit}
                    style={styles.keyBtn}
                    onPress={() => handleKeyPress(digit)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.keyText}>{digit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.keyRow}>
              {/* Face Biometric Shortcut Button */}
              {mode === 'unlock' && onFaceScanRequest ? (
                <TouchableOpacity
                  style={[styles.keyBtn, styles.specialKey]}
                  onPress={onFaceScanRequest}
                  activeOpacity={0.6}
                >
                  <Ionicons name="scan" size={24} color="#06B6D4" />
                </TouchableOpacity>
              ) : (
                <View style={styles.keyBtnEmpty} />
              )}

              <TouchableOpacity
                style={styles.keyBtn}
                onPress={() => handleKeyPress('0')}
                activeOpacity={0.6}
              >
                <Text style={styles.keyText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.keyBtn, styles.specialKey]}
                onPress={handleDelete}
                activeOpacity={0.6}
              >
                <Ionicons name="backspace-outline" size={22} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'unlock' && (
            <View style={styles.hintBox}>
              <Ionicons name="information-circle-outline" size={14} color="#94A3B8" />
              <Text style={styles.hintText}>Demo Default PIN: 1234</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
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
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 6,
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
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 18,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  dotError: {
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 12,
  },
  keypad: {
    width: '100%',
    gap: 12,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyBtn: {
    width: 72,
    height: 62,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  specialKey: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },
  keyBtnEmpty: {
    width: 72,
    height: 62,
  },
  keyText: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 8,
  },
  hintText: {
    color: '#94A3B8',
    fontSize: 11,
  },
});
