import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { PlatformType } from '../types';
import { AiStudioModal } from '../components/AiStudioModal';

export const StudioUploadScreen: React.FC = () => {
  const { t, startSimultaneousUpload, videos, retryPlatformUpload } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('');
  const [category, setCategory] = useState('Science & Technology');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    'youtube',
    'facebook',
    'instagram',
  ]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
  );
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const sampleThumbnails = [
    {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      label: 'Cyber AI',
    },
    {
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80',
      label: 'Neural Graph',
    },
    {
      url: 'https://images.unsplash.com/photo-1633493106115-fa6e6f966144?w=400&auto=format&fit=crop&q=80',
      label: '3D Render',
    },
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
      label: 'Retro Tech',
    },
  ];

  const togglePlatform = (p: PlatformType) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) {
        Alert.alert('Required', 'At least one destination platform must be selected');
        return;
      }
      setSelectedPlatforms((prev) => prev.filter((item) => item !== p));
    } else {
      setSelectedPlatforms((prev) => [...prev, p]);
    }
  };

  const handleStartUpload = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please provide a title or generate one with OmniBrain AI.');
      return;
    }

    const tagsArr = tagsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const hashtagsArr = hashtagsStr
      .split(' ')
      .map((s) => s.trim())
      .filter(Boolean);

    startSimultaneousUpload({
      title: title.trim(),
      description: description.trim() || 'Syndicated via OmniStream AI automated cloud pipeline.',
      tags: tagsArr.length ? tagsArr : ['omnistream', 'viral', 'ai'],
      hashtags: hashtagsArr.length ? hashtagsArr : ['#OmniStream', '#Shorts', '#Reels'],
      category,
      selectedPlatforms,
      videoDuration: '00:54',
      fileSize: '31.4 MB',
      thumbnailUrl: selectedThumbnail,
      source: 'direct',
    });

    Alert.alert(
      t.success,
      `Simultaneous multi-destination pipeline initiated across ${selectedPlatforms.join(', ').toUpperCase()}!`
    );

    // Reset fields
    setTitle('');
    setDescription('');
    setTagsStr('');
    setHashtagsStr('');
  };

  const handleApplyAiData = (data: {
    title: string;
    description: string;
    tags: string[];
    hashtags: string[];
  }) => {
    setTitle(data.title);
    setDescription(data.description);
    setTagsStr(data.tags.join(', '));
    setHashtagsStr(data.hashtags.join(' '));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Studio Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerBadgeRow}>
          <View style={styles.activeTag}>
            <Ionicons name="flash" size={13} color="#06B6D4" />
            <Text style={styles.activeTagText}>SIMULTANEOUS PIPELINE</Text>
          </View>
          <Text style={styles.headerQuota}>3-Platform Direct Feed</Text>
        </View>
        <Text style={styles.headerTitle}>{t.uploadTitle}</Text>
        <Text style={styles.headerSubtitle}>{t.uploadSubtitle}</Text>
      </View>

      {/* Target Destination Switchers */}
      <Text style={styles.sectionHeading}>{t.selectDestinations}</Text>
      <View style={styles.destinationsRow}>
        {/* YouTube */}
        <TouchableOpacity
          style={[
            styles.destinationCard,
            selectedPlatforms.includes('youtube') && styles.destSelectedYt,
          ]}
          onPress={() => togglePlatform('youtube')}
          activeOpacity={0.8}
        >
          <View style={styles.destTop}>
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            <Ionicons
              name={selectedPlatforms.includes('youtube') ? 'checkbox' : 'square-outline'}
              size={20}
              color={selectedPlatforms.includes('youtube') ? '#FF0000' : '#64748B'}
            />
          </View>
          <Text style={styles.destName}>YouTube</Text>
          <Text style={styles.destFormat}>Shorts & 4K Video</Text>
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity
          style={[
            styles.destinationCard,
            selectedPlatforms.includes('facebook') && styles.destSelectedFb,
          ]}
          onPress={() => togglePlatform('facebook')}
          activeOpacity={0.8}
        >
          <View style={styles.destTop}>
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            <Ionicons
              name={selectedPlatforms.includes('facebook') ? 'checkbox' : 'square-outline'}
              size={20}
              color={selectedPlatforms.includes('facebook') ? '#1877F2' : '#64748B'}
            />
          </View>
          <Text style={styles.destName}>Facebook</Text>
          <Text style={styles.destFormat}>Reels & Page Feed</Text>
        </TouchableOpacity>

        {/* Instagram */}
        <TouchableOpacity
          style={[
            styles.destinationCard,
            selectedPlatforms.includes('instagram') && styles.destSelectedIg,
          ]}
          onPress={() => togglePlatform('instagram')}
          activeOpacity={0.8}
        >
          <View style={styles.destTop}>
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            <Ionicons
              name={selectedPlatforms.includes('instagram') ? 'checkbox' : 'square-outline'}
              size={20}
              color={selectedPlatforms.includes('instagram') ? '#E1306C' : '#64748B'}
            />
          </View>
          <Text style={styles.destName}>Instagram</Text>
          <Text style={styles.destFormat}>Reel & Grid Share</Text>
        </TouchableOpacity>
      </View>

      {/* OmniBrain AI Generator Trigger Banner */}
      <TouchableOpacity
        style={styles.aiTriggerBanner}
        onPress={() => setIsAiModalOpen(true)}
        activeOpacity={0.8}
      >
        <View style={styles.aiTriggerLeft}>
          <View style={styles.aiSparkleBox}>
            <Ionicons name="sparkles" size={20} color="#06B6D4" />
          </View>
          <View>
            <Text style={styles.aiTriggerTitle}>{t.openAiStudio}</Text>
            <Text style={styles.aiTriggerSub}>
              Generate viral high-CTR titles, Hindi/English descriptions & tags
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#06B6D4" />
      </TouchableOpacity>

      {/* Video Metadata Form */}
      <View style={styles.formCard}>
        {/* Title Input */}
        <Text style={styles.fieldLabel}>{t.videoTitleInput}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder={t.videoTitlePlaceholder}
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Thumbnail Selector */}
        <Text style={styles.fieldLabel}>Video Visual Cover / Thumbnail</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
          {sampleThumbnails.map((th, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.thumbOption,
                selectedThumbnail === th.url && styles.thumbSelected,
              ]}
              onPress={() => setSelectedThumbnail(th.url)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: th.url }} style={styles.thumbImg} />
              <View style={styles.thumbLabelBox}>
                <Text style={styles.thumbLabelText}>{th.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Description Input */}
        <Text style={styles.fieldLabel}>{t.videoDescInput}</Text>
        <View style={[styles.inputWrapper, { height: 90, alignItems: 'flex-start' }]}>
          <TextInput
            style={[styles.inputField, { height: 80, textAlignVertical: 'top' }]}
            placeholder={t.videoDescPlaceholder}
            placeholderTextColor="#64748B"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Tags */}
        <Text style={styles.fieldLabel}>{t.tagsInput}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder={t.tagsPlaceholder}
            placeholderTextColor="#64748B"
            value={tagsStr}
            onChangeText={setTagsStr}
          />
        </View>

        {/* Hashtags */}
        <Text style={styles.fieldLabel}>Hashtags</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="#Viral #Shorts #Reels #AI"
            placeholderTextColor="#64748B"
            value={hashtagsStr}
            onChangeText={setHashtagsStr}
          />
        </View>

        {/* Submit simultaneous upload */}
        <TouchableOpacity
          style={styles.startUploadBtn}
          onPress={handleStartUpload}
          activeOpacity={0.85}
        >
          <Ionicons name="rocket" size={20} color="#041B2D" />
          <Text style={styles.startUploadBtnText}>{t.uploadNow}</Text>
        </TouchableOpacity>
      </View>

      {/* Live Upload Pipelines Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.uploadProgressTitle}</Text>
        <Text style={styles.sectionSubtitle}>{videos.length} Streams Tracked</Text>
      </View>

      {videos.map((vid) => (
        <View key={vid.id} style={styles.pipelineCard}>
          <View style={styles.pipelineTop}>
            <Image source={{ uri: vid.thumbnailUrl }} style={styles.pipeThumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.pipeTitle} numberOfLines={2}>
                {vid.title}
              </Text>
              <View style={styles.pipeMetaRow}>
                <Text style={styles.pipeTime}>{vid.createdAt}</Text>
                <Text style={styles.pipeDuration}>{vid.videoDuration} • {vid.fileSize}</Text>
              </View>
            </View>
          </View>

          {/* Platform status bars */}
          <View style={styles.platformBarsList}>
            {(vid.selectedPlatforms as PlatformType[]).map((platform) => {
              const state = vid.platformStates[platform];
              const prog = state?.progress || 0;
              const isLive = state?.status === 'published';
              const isFailed = state?.status === 'failed';

              const platformColor =
                platform === 'youtube'
                  ? '#FF0000'
                  : platform === 'facebook'
                  ? '#1877F2'
                  : '#E1306C';

              return (
                <View key={platform} style={styles.platformBarItem}>
                  <View style={styles.platformBarHeader}>
                    <View style={styles.platformLabelRow}>
                      <Ionicons
                        name={
                          platform === 'youtube'
                            ? 'logo-youtube'
                            : platform === 'facebook'
                            ? 'logo-facebook'
                            : 'logo-instagram'
                        }
                        size={14}
                        color={platformColor}
                      />
                      <Text style={styles.platformBarName}>
                        {platform.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.platformStatusRight}>
                      <Text
                        style={[
                          styles.platformStatusText,
                          isLive && { color: '#10B981' },
                          isFailed && { color: '#EF4444' },
                        ]}
                      >
                        {isLive
                          ? t.statusPublished
                          : isFailed
                          ? t.statusFailed
                          : `${state?.status?.toUpperCase()} (${prog}%)`}
                      </Text>
                      {isFailed && (
                        <TouchableOpacity
                          style={styles.retryBtn}
                          onPress={() => retryPlatformUpload(vid.id, platform)}
                        >
                          <Ionicons name="refresh" size={12} color="#06B6D4" />
                          <Text style={styles.retryText}>{t.retryUpload}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Progress Line */}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${prog}%`,
                          backgroundColor: isLive ? '#10B981' : platformColor,
                        },
                      ]}
                    />
                  </View>

                  {isLive && state?.liveUrl && (
                    <View style={styles.liveUrlRow}>
                      <Ionicons name="link" size={12} color="#06B6D4" />
                      <Text style={styles.liveUrlText} numberOfLines={1}>
                        {state.liveUrl}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}

      {/* AI Modal */}
      <AiStudioModal
        visible={isAiModalOpen}
        initialTopic={title}
        onApply={handleApplyAiData}
        onClose={() => setIsAiModalOpen(false)}
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
  headerBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  activeTagText: {
    color: '#06B6D4',
    fontSize: 10,
    fontWeight: '800',
  },
  headerQuota: {
    color: '#94A3B8',
    fontSize: 11,
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
  },
  sectionHeading: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 4,
  },
  destinationsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  destinationCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 12,
  },
  destSelectedYt: {
    borderColor: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.06)',
  },
  destSelectedFb: {
    borderColor: '#1877F2',
    backgroundColor: 'rgba(24, 119, 242, 0.06)',
  },
  destSelectedIg: {
    borderColor: '#E1306C',
    backgroundColor: 'rgba(225, 48, 108, 0.06)',
  },
  destTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  destName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  destFormat: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  aiTriggerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    padding: 14,
    marginBottom: 16,
  },
  aiTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  aiSparkleBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTriggerTitle: {
    color: '#06B6D4',
    fontSize: 14,
    fontWeight: '800',
  },
  aiTriggerSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  inputWrapper: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    height: 46,
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputField: {
    color: '#F8FAFC',
    fontSize: 13.5,
  },
  thumbScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  thumbOption: {
    width: 100,
    height: 65,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbSelected: {
    borderColor: '#06B6D4',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbLabelBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 7, 18, 0.75)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  thumbLabelText: {
    color: '#E2E8F0',
    fontSize: 9.5,
    fontWeight: '700',
  },
  startUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 14,
  },
  startUploadBtnText: {
    color: '#041B2D',
    fontSize: 15,
    fontWeight: '800',
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
  pipelineCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 12,
  },
  pipelineTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pipeThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  pipeTitle: {
    color: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 18,
  },
  pipeMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  pipeTime: {
    color: '#64748B',
    fontSize: 10.5,
  },
  pipeDuration: {
    color: '#94A3B8',
    fontSize: 10.5,
  },
  platformBarsList: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 10,
  },
  platformBarItem: {},
  platformBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  platformLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  platformBarName: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  platformStatusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platformStatusText: {
    color: '#06B6D4',
    fontSize: 10.5,
    fontWeight: '600',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderRadius: 4,
  },
  retryText: {
    color: '#06B6D4',
    fontSize: 9.5,
    fontWeight: '700',
  },
  barTrack: {
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  liveUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  liveUrlText: {
    color: '#38BDF8',
    fontSize: 10.5,
  },
});
