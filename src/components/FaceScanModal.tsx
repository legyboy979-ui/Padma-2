import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

interface FaceScanModalProps {
  visible: boolean;
  onSuccess: () => void;
  onFallbackToPasscode: () => void;
  onClose?: () => void;
}

export const FaceScanModal: React.FC<FaceScanModalProps> = ({
  visible,
  onSuccess,
  onFallbackToPasscode,
  onClose,
}) => {
  const { t } = useApp();
  const [scanStage, setScanStage] = useState<'idle' | 'scanning' | 'analyzing' | 'success'>('idle');
  const [statusMessage, setStatusMessage] = useState('Position face inside retinal frame');

  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setScanStage('scanning');
      setStatusMessage('Acquiring 468-point Facial Mesh...');

      // Laser sweep animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Progress through stages
      const t1 = setTimeout(() => {
        setScanStage('analyzing');
        setStatusMessage('Liveness Check: Blink & Depth Confirmed');
      }, 1500);

      const t2 = setTimeout(() => {
        setScanStage('success');
        setStatusMessage('Biometric Identity Verified');
      }, 2600);

      const t3 = setTimeout(() => {
        onSuccess();
      }, 3200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setScanStage('idle');
      scanAnim.setValue(0);
    }
  }, [visible]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-110, 110],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.secureBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#06B6D4" />
              <Text style={styles.secureBadgeText}>OMNI-SECURE 3D BIOMETRICS</Text>
            </View>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title}>{t.faceScanTitle}</Text>
          <Text style={styles.subtitle}>{t.faceScanPrompt}</Text>

          {/* Viewfinder Reticle */}
          <View style={styles.viewfinderContainer}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Oval Face Guide */}
            <Animated.View
              style={[
                styles.faceOval,
                {
                  transform: [{ scale: pulseAnim }],
                  borderColor:
                    scanStage === 'success'
                      ? '#10B981'
                      : scanStage === 'analyzing'
                      ? '#8B5CF6'
                      : '#06B6D4',
                },
              ]}
            >
              {/* Landmark crosshairs */}
              <View style={styles.crosshairCenter}>
                <Ionicons
                  name={
                    scanStage === 'success'
                      ? 'checkmark-circle'
                      : scanStage === 'analyzing'
                      ? 'scan-circle'
                      : 'person-circle-outline'
                  }
                  size={90}
                  color={
                    scanStage === 'success'
                      ? '#10B981'
                      : scanStage === 'analyzing'
                      ? '#8B5CF6'
                      : 'rgba(6, 182, 212, 0.7)'
                  }
                />
              </View>

              {/* Glowing Laser Sweep */}
              {scanStage !== 'success' && (
                <Animated.View
                  style={[
                    styles.laserBeam,
                    {
                      transform: [{ translateY }],
                    },
                  ]}
                />
              )}
            </Animated.View>

            {/* Depth nodes */}
            <View style={[styles.nodePoint, { top: '35%', left: '32%' }]} />
            <View style={[styles.nodePoint, { top: '35%', right: '32%' }]} />
            <View style={[styles.nodePoint, { top: '50%', left: '48%' }]} />
            <View style={[styles.nodePoint, { top: '65%', left: '40%' }]} />
            <View style={[styles.nodePoint, { top: '65%', right: '40%' }]} />
          </View>

          {/* Status info */}
          <View style={styles.statusBox}>
            <View
              style={[
                styles.statusDot,
                scanStage === 'success' ? styles.statusSuccess : styles.statusActive,
              ]}
            />
            <Text
              style={[
                styles.statusLabel,
                scanStage === 'success' && { color: '#10B981', fontWeight: '700' },
              ]}
            >
              {statusMessage}
            </Text>
          </View>

          {/* Live Biometric Telemetry */}
          <View style={styles.telemetryGrid}>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemKey}>ALGORITHM</Text>
              <Text style={styles.telemVal}>NeuralFace v4.2</Text>
            </View>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemKey}>LIVENESS</Text>
              <Text style={[styles.telemVal, { color: scanStage === 'idle' ? '#94A3B8' : '#10B981' }]}>
                {scanStage === 'idle' ? 'Pending' : 'Anti-Spoof ON'}
              </Text>
            </View>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemKey}>AUTH LEVEL</Text>
              <Text style={styles.telemVal}>Tier-3 Encrypted</Text>
            </View>
          </View>

          {/* Fallback to Passcode */}
          <TouchableOpacity
            style={styles.fallbackBtn}
            onPress={onFallbackToPasscode}
            activeOpacity={0.8}
          >
            <Ionicons name="keypad-outline" size={16} color="#06B6D4" />
            <Text style={styles.fallbackText}>Use 4-Digit Passcode PIN Instead</Text>
          </TouchableOpacity>
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
    backgroundColor: '#0B1120',
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
    marginBottom: 14,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  secureBadgeText: {
    color: '#06B6D4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
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
    textAlign: 'center',
    marginBottom: 20,
  },
  viewfinderContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#06B6D4',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  faceOval: {
    width: 170,
    height: 210,
    borderRadius: 85,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  crosshairCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  laserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#06B6D4',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  nodePoint: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#06B6D4',
  },
  statusSuccess: {
    backgroundColor: '#10B981',
  },
  statusLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 18,
  },
  telemetryItem: {
    alignItems: 'center',
  },
  telemKey: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  telemVal: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  fallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  fallbackText: {
    color: '#06B6D4',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
