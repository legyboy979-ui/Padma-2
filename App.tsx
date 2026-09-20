import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { FaceScanModal } from './src/components/FaceScanModal';
import { PasscodeModal } from './src/components/PasscodeModal';
import { SubscriptionModal } from './src/components/SubscriptionModal';
import { WalletWithdrawModal } from './src/components/WalletWithdrawModal';

import { DashboardScreen } from './src/screens/DashboardScreen';
import { StudioUploadScreen } from './src/screens/StudioUploadScreen';
import { SchedulerScreen } from './src/screens/SchedulerScreen';
import { GmailHarvesterScreen } from './src/screens/GmailHarvesterScreen';
import { TeamScreen } from './src/screens/TeamScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { ArchitectureDocsScreen } from './src/screens/ArchitectureDocsScreen';
import { AuthRegisterScreen } from './src/screens/AuthRegisterScreen';

type TabKey = 'hub' | 'studio' | 'schedule' | 'harvest' | 'team' | 'wallet' | 'security' | 'docs';

function MainApp() {
  const {
    t,
    isAuthenticated,
    isLocked,
    unlockWithPasscode,
    unlockWithBiometric,
    user,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<TabKey>('hub');
  const [isFaceScanOpen, setIsFaceScanOpen] = useState(false);
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // If not authenticated, show registration with OTP
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AuthRegisterScreen onSuccess={() => {}} />
      </SafeAreaView>
    );
  }

  // If locked, show high-security biometric / passcode unlock prompt
  if (isLocked) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.lockScreenContainer}>
          <View style={styles.lockIconBox}>
            <Ionicons name="finger-print" size={54} color="#06B6D4" />
          </View>
          <Text style={styles.lockTitle}>OmniStream AI Protected</Text>
          <Text style={styles.lockSub}>
            Authenticated Session for {user.name} ({user.role})
          </Text>

          <View style={styles.lockButtonsCol}>
            {user.faceScanEnabled && (
              <TouchableOpacity
                style={styles.unlockFaceBtn}
                onPress={() => setIsFaceScanOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="scan" size={20} color="#041B2D" />
                <Text style={styles.unlockFaceText}>Scan Face Biometric</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.unlockPinBtn}
              onPress={() => setIsPasscodeOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="keypad" size={18} color="#06B6D4" />
              <Text style={styles.unlockPinText}>Enter 4-Digit Passcode PIN</Text>
            </TouchableOpacity>
          </View>

          <FaceScanModal
            visible={isFaceScanOpen}
            onSuccess={() => {
              setIsFaceScanOpen(false);
              unlockWithBiometric();
            }}
            onFallbackToPasscode={() => {
              setIsFaceScanOpen(false);
              setIsPasscodeOpen(true);
            }}
            onClose={() => setIsFaceScanOpen(false)}
          />

          <PasscodeModal
            visible={isPasscodeOpen}
            mode="unlock"
            onSuccess={() => {
              setIsPasscodeOpen(false);
              unlockWithBiometric();
            }}
            onFaceScanRequest={() => {
              setIsPasscodeOpen(false);
              setIsFaceScanOpen(true);
            }}
            onClose={() => setIsPasscodeOpen(false)}
          />
        </View>
      </SafeAreaView>
    );
  }

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'hub':
        return (
          <DashboardScreen
            onNavigateTab={(tab) => setCurrentTab(tab as TabKey)}
            onOpenPlans={() => setIsSubscriptionOpen(true)}
            onOpenWithdraw={() => setIsWithdrawOpen(true)}
          />
        );
      case 'studio':
        return <StudioUploadScreen />;
      case 'schedule':
        return <SchedulerScreen />;
      case 'harvest':
        return <GmailHarvesterScreen />;
      case 'team':
        return <TeamScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'security':
        return <SecurityScreen />;
      case 'docs':
        return <ArchitectureDocsScreen />;
      default:
        return (
          <DashboardScreen
            onNavigateTab={(tab) => setCurrentTab(tab as TabKey)}
            onOpenPlans={() => setIsSubscriptionOpen(true)}
            onOpenWithdraw={() => setIsWithdrawOpen(true)}
          />
        );
    }
  };

  const tabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'hub', label: t.tabHub, icon: 'speedometer-outline' },
    { key: 'studio', label: t.tabStudio, icon: 'videocam-outline' },
    { key: 'schedule', label: t.tabSchedule, icon: 'calendar-outline' },
    { key: 'harvest', label: t.tabHarvest, icon: 'mail-outline' },
    { key: 'team', label: t.tabTeam, icon: 'people-outline' },
    { key: 'wallet', label: t.tabWallet, icon: 'wallet-outline' },
    { key: 'security', label: t.tabSecurity, icon: 'shield-checkmark-outline' },
    { key: 'docs', label: t.tabDocs, icon: 'git-branch-outline' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <Header
        onOpenPlans={() => setIsSubscriptionOpen(true)}
        onOpenSecurity={() => setCurrentTab('security')}
      />

      {/* Main Screen Content */}
      <View style={styles.mainContent}>{renderActiveScreen()}</View>

      {/* Bottom Navigation Tab Bar */}
      <View style={styles.bottomBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomTabBarContent}
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setCurrentTab(tab.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.tabIconCircle, isActive && styles.tabIconCircleActive]}>
                  <Ionicons
                    name={tab.icon}
                    size={17}
                    color={isActive ? '#06B6D4' : '#64748B'}
                  />
                </View>
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Global Modals accessible anywhere */}
      <SubscriptionModal
        visible={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      <WalletWithdrawModal
        visible={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070B14',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
  },
  bottomBarContainer: {
    backgroundColor: '#0A0F1D',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 6,
  },
  bottomTabBarContent: {
    paddingHorizontal: 8,
    gap: 6,
    alignItems: 'center',
  },
  tabItem: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  tabIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconCircleActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#06B6D4',
    fontWeight: '800',
  },
  lockScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#070B14',
  },
  lockIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  lockSub: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 32,
    textAlign: 'center',
  },
  lockButtonsCol: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  unlockFaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    borderRadius: 14,
  },
  unlockFaceText: {
    color: '#041B2D',
    fontSize: 15,
    fontWeight: '800',
  },
  unlockPinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  unlockPinText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '700',
  },
});
