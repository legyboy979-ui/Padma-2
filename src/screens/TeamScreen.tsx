import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { UserRole, TeamMember } from '../types';

export const TeamScreen: React.FC = () => {
  const {
    t,
    teamMembers,
    addTeamMember,
    removeTeamMember,
    draftApprovals,
    approveDraft,
    requestDraftChanges,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'members' | 'approvals' | 'audit'>('members');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Video Editor');

  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  const handleSendInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      Alert.alert('Required', 'Please provide teammate name and email.');
      return;
    }

    addTeamMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: '+91 98000 00000',
      role: inviteRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      permissions: {
        canUpload: inviteRole === 'Owner' || inviteRole === 'Admin' || inviteRole === 'Video Editor',
        canSchedule: inviteRole === 'Owner' || inviteRole === 'Admin' || inviteRole === 'Content Strategist',
        canApproveDrafts: inviteRole === 'Owner' || inviteRole === 'Admin' || inviteRole === 'Reviewer',
        canWithdrawEarnings: inviteRole === 'Owner',
        canManageTeam: inviteRole === 'Owner' || inviteRole === 'Admin',
      },
    });

    Alert.alert(t.success, `Invitation dispatched to ${inviteEmail} as ${inviteRole}!`);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const handleApprove = (id: string) => {
    approveDraft(id);
    Alert.alert(t.success, 'Draft approved and queued for 4x daily scheduling!');
  };

  const handleRequestChanges = () => {
    if (selectedApproval) {
      requestDraftChanges(selectedApproval, feedbackNote || 'Please revise thumbnail & retention hook.');
      setSelectedApproval(null);
      setFeedbackNote('');
      Alert.alert(t.success, 'Revision request sent to the editor.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.teamBadge}>
              <Ionicons name="people" size={13} color="#8B5CF6" />
              <Text style={styles.teamBadgeText}>RBAC ACCESS CONTROL</Text>
            </View>
            <Text style={styles.headerTitle}>{t.teamTitle}</Text>
          </View>

          <TouchableOpacity
            style={styles.inviteBtn}
            onPress={() => setIsInviteModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add" size={14} color="#FFFFFF" />
            <Text style={styles.inviteBtnText}>{t.inviteMember}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.headerSubtitle}>{t.teamSubtitle}</Text>

        {/* Tab switchers */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'members' && styles.tabBtnActive]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'members' && styles.tabBtnTextActive]}>
              Teammates ({teamMembers.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'approvals' && styles.tabBtnActive]}
            onPress={() => setActiveTab('approvals')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'approvals' && styles.tabBtnTextActive]}>
              Approvals ({draftApprovals.filter((d) => d.status === 'pending').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'audit' && styles.tabBtnActive]}
            onPress={() => setActiveTab('audit')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'audit' && styles.tabBtnTextActive]}>
              Activity Log
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <View style={styles.membersList}>
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberTop}>
                <Image source={{ uri: member.avatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View
                      style={[
                        styles.rolePill,
                        member.role === 'Owner' && styles.roleOwner,
                        member.role === 'Admin' && styles.roleAdmin,
                        member.role === 'Video Editor' && styles.roleEditor,
                        member.role === 'Content Strategist' && styles.roleStrategist,
                        member.role === 'Reviewer' && styles.roleReviewer,
                      ]}
                    >
                      <Text style={styles.roleText}>{member.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  <Text style={styles.memberActive}>{member.lastActive}</Text>
                </View>

                {member.role !== 'Owner' && (
                  <TouchableOpacity
                    onPress={() => removeTeamMember(member.id)}
                    style={styles.trashBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Permission Matrix Pills */}
              <View style={styles.permRow}>
                {member.permissions.canUpload && (
                  <View style={styles.permTag}>
                    <Ionicons name="cloud-upload" size={10} color="#06B6D4" />
                    <Text style={styles.permText}>Upload</Text>
                  </View>
                )}
                {member.permissions.canSchedule && (
                  <View style={styles.permTag}>
                    <Ionicons name="calendar" size={10} color="#10B981" />
                    <Text style={styles.permText}>Schedule</Text>
                  </View>
                )}
                {member.permissions.canApproveDrafts && (
                  <View style={styles.permTag}>
                    <Ionicons name="checkmark-circle" size={10} color="#8B5CF6" />
                    <Text style={styles.permText}>Approve</Text>
                  </View>
                )}
                {member.permissions.canWithdrawEarnings && (
                  <View style={styles.permTag}>
                    <Ionicons name="cash" size={10} color="#F59E0B" />
                    <Text style={styles.permText}>Finance</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'approvals' && (
        <View style={styles.approvalsList}>
          {draftApprovals.map((appr) => {
            const isApproved = appr.status === 'approved';
            const isPending = appr.status === 'pending';

            return (
              <View key={appr.id} style={styles.approvalCard}>
                <View style={styles.approvalTop}>
                  <Image source={{ uri: appr.thumbnail }} style={styles.apprThumb} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.apprTitle} numberOfLines={2}>
                      {appr.videoTitle}
                    </Text>
                    <Text style={styles.apprSubmitter}>
                      By: {appr.submittedBy} • {appr.submittedAt}
                    </Text>
                  </View>
                </View>

                {appr.feedbackNotes && (
                  <View style={styles.feedbackBox}>
                    <Ionicons name="chatbubble-outline" size={12} color="#F59E0B" />
                    <Text style={styles.feedbackText}>{appr.feedbackNotes}</Text>
                  </View>
                )}

                {/* Status or Action Buttons */}
                <View style={styles.apprActionRow}>
                  {isApproved ? (
                    <View style={styles.approvedBadge}>
                      <Ionicons name="checkmark-done-circle" size={16} color="#10B981" />
                      <Text style={styles.approvedText}>
                        Approved by {appr.reviewerName || 'Reviewer'}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => setSelectedApproval(appr.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="create-outline" size={14} color="#EF4444" />
                        <Text style={styles.rejectBtnText}>{t.requestChanges}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => handleApprove(appr.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        <Text style={styles.approveBtnText}>{t.approveDraft}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {activeTab === 'audit' && (
        <View style={styles.auditList}>
          {[
            { user: 'Devendra Sharma', action: 'Approved draft "Startups Fail in India"', time: '11:00 AM' },
            { user: 'Vikas Malhotra', action: 'Uploaded Ep 44 Master Render via Gmail Harvester', time: '10:45 AM' },
            { user: 'OmniStream Harvester', action: 'Auto-ingested 2 video attachments from inbox', time: '09:30 AM' },
            { user: 'Priya Narayanan', action: 'Generated AI titles & tags for Morning Commute', time: '08:50 AM' },
            { user: 'Automated Bot', action: 'Dispatched simultaneous stream to YouTube, FB & IG', time: '09:00 AM' },
          ].map((item, idx) => (
            <View key={idx} style={styles.auditItem}>
              <View style={styles.auditDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.auditUser}>{item.user}</Text>
                <Text style={styles.auditAction}>{item.action}</Text>
              </View>
              <Text style={styles.auditTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Invite Member Modal */}
      <Modal
        visible={isInviteModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsInviteModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.inviteMember}</Text>
              <TouchableOpacity
                onPress={() => setIsInviteModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>{t.fullName}</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g. Rahul Verma"
              placeholderTextColor="#64748B"
              value={inviteName}
              onChangeText={setInviteName}
            />

            <Text style={styles.fieldLabel}>{t.emailAddress}</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g. rahul.editor@agency.com"
              placeholderTextColor="#64748B"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>Role & Permissions</Text>
            <View style={styles.rolesRow}>
              {(['Admin', 'Video Editor', 'Content Strategist', 'Reviewer'] as UserRole[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleSelectChip, inviteRole === r && styles.roleSelectChipActive]}
                  onPress={() => setInviteRole(r)}
                >
                  <Text
                    style={[
                      styles.roleSelectText,
                      inviteRole === r && styles.roleSelectTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.sendInviteBtn}
              onPress={handleSendInvite}
              activeOpacity={0.8}
            >
              <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
              <Text style={styles.sendInviteBtnText}>Send Team Invitation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Request Changes Note Modal */}
      <Modal
        visible={!!selectedApproval}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedApproval(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.requestChanges}</Text>
              <TouchableOpacity
                onPress={() => setSelectedApproval(null)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>{t.sendFeedback}</Text>
            <TextInput
              style={[styles.inputField, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Specify what needs editing (e.g. Cut first 3 seconds, add sound sync)..."
              placeholderTextColor="#64748B"
              value={feedbackNote}
              onChangeText={setFeedbackNote}
              multiline
            />

            <TouchableOpacity
              style={[styles.sendInviteBtn, { backgroundColor: '#EF4444' }]}
              onPress={handleRequestChanges}
              activeOpacity={0.8}
            >
              <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
              <Text style={styles.sendInviteBtnText}>Submit Revision Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  teamBadgeText: {
    color: '#8B5CF6',
    fontSize: 9.5,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  inviteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#111D35',
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#1E293B',
  },
  tabBtnText: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#06B6D4',
    fontWeight: '700',
  },
  membersList: {
    gap: 12,
    marginBottom: 20,
  },
  memberCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
  },
  memberTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#1E293B',
  },
  roleOwner: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  roleAdmin: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
  },
  roleEditor: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  roleStrategist: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  roleReviewer: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  roleText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
  },
  memberEmail: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  memberActive: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  trashBtn: {
    padding: 6,
  },
  permRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 8,
  },
  permTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  permText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  approvalsList: {
    gap: 12,
    marginBottom: 20,
  },
  approvalCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
  },
  approvalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  apprThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  apprTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  apprSubmitter: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  feedbackText: {
    color: '#F59E0B',
    fontSize: 11.5,
    flex: 1,
  },
  apprActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approvedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  rejectBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 10,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  auditList: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    gap: 14,
    marginBottom: 20,
  },
  auditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  auditDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06B6D4',
  },
  auditUser: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '700',
  },
  auditAction: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  auditTime: {
    color: '#64748B',
    fontSize: 10.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.94)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  inputField: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    height: 46,
    color: '#F8FAFC',
    fontSize: 13.5,
    marginBottom: 10,
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  roleSelectChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  roleSelectChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8B5CF6',
  },
  roleSelectText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  roleSelectTextActive: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
  sendInviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  sendInviteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
