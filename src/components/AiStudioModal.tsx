import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

interface AiStudioModalProps {
  visible: boolean;
  initialTopic?: string;
  onApply: (data: {
    title: string;
    description: string;
    tags: string[];
    hashtags: string[];
  }) => void;
  onClose: () => void;
}

export const AiStudioModal: React.FC<AiStudioModalProps> = ({
  visible,
  initialTopic = '',
  onApply,
  onClose,
}) => {
  const { t, language } = useApp();
  const [topic, setTopic] = useState(initialTopic);
  const [selectedTone, setSelectedTone] = useState<'viral' | 'pro' | 'engaging' | 'hinglish' | 'seo'>('viral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Generated outputs
  const [titleOptions, setTitleOptions] = useState<{ title: string; ctr: number; hook: string }[]>([]);
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);

      const isHi = language === 'hi' || selectedTone === 'hinglish';

      let mockTitles = [];
      let mockDesc = '';
      let mockHash = [];
      let mockTags = [];

      if (isHi) {
        mockTitles = [
          {
            title: `🚨 सिर्फ 30 सेकंड में समझें: ${topic} का असली सच!`,
            ctr: 96,
            hook: 'Curiosity Gap + Urgency',
          },
          {
            title: `${topic} से 2026 में 10X ग्रोथ कैसे पाएं? (स्टेप बाय स्टेप)`,
            ctr: 93,
            hook: 'High Value + Actionable',
          },
          {
            title: `99% लोग ${topic} में यह बड़ी गलती करते हैं! #MustWatch`,
            ctr: 90,
            hook: 'FOMO + Problem Solving',
          },
        ];
        mockDesc = `क्या आप ${topic} के बारे में सब कुछ जानना चाहते हैं? इस वीडियो में हमने यूट्यूब, फेसबुक और इंस्टाग्राम पर सबसे ज्यादा वायरल होने वाले सीक्रेट्स का खुलासा किया है।\n\n📌 मुख्य बिंदु:\n00:00 - मुख्य हुक और समस्या\n00:25 - 2026 का नया एल्गोरिदम ब्रेकडाउन\n00:45 - 3 प्रैक्टिकल टिप्स\n\n🔔 चैनल को सब्सक्राइब करें और रील्स को सेव कर लें ताकि कोई अपडेट न छूटे!\n\n#OmniStreamAI #HindiCreators #ViralTech2026`;
        mockHash = ['#HindiTech', '#CreatorIndia', '#ViralReels', '#YouTubeShortsHindi', '#DigitalIndia', '#Shorts2026', '#SocialMediaTips'];
        mockTags = [topic, 'hindi tutorial', 'youtube automation india', 'instagram growth reels', 'facebook monetisation', 'ai tools 2026'];
      } else {
        mockTitles = [
          {
            title: `Stop Doing This With ${topic} (Do This Instead)`,
            ctr: 97,
            hook: 'Negative Pattern Interrupt',
          },
          {
            title: `The 2026 ${topic} Blueprint Nobody Is Talking About`,
            ctr: 94,
            hook: 'Exclusive Insider Knowledge',
          },
          {
            title: `I Tested ${topic} For 30 Days (Shocking Results)`,
            ctr: 91,
            hook: 'Social Proof + Case Study',
          },
        ];
        mockDesc = `Everything you need to master ${topic} in 2026! We analyzed over 100,000 top-performing videos across YouTube, Facebook, and Instagram to extract the exact algorithmic blueprint.\n\n⏱️ Timestamps:\n00:00 - The Big Shift in 2026\n00:18 - 3 High-Retention Tactics\n00:42 - Cross-Platform Syndication Strategy\n\n💡 Subscribe for daily automated content growth breakdowns!\n\n#OmniStreamAI #Automation #CreatorEconomy`;
        mockHash = ['#ViralShorts', '#InstagramReels', '#YouTubeGrowth', '#AIAutomation', '#CreatorHacks', '#ContentMarketing', '#Trending2026'];
        mockTags = [topic, 'social automation', 'youtube algorithm', 'reels viral hook', 'meta syndication', 'omnistream', 'high retention'];
      }

      setTitleOptions(mockTitles);
      setSelectedTitleIdx(0);
      setGeneratedDesc(mockDesc);
      setGeneratedHashtags(mockHash);
      setGeneratedTags(mockTags);
    }, 1400);
  };

  const handleApplyAll = () => {
    const chosenTitle = titleOptions[selectedTitleIdx]?.title || topic;
    onApply({
      title: chosenTitle,
      description: generatedDesc,
      tags: generatedTags,
      hashtags: generatedHashtags,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Ionicons name="sparkles" size={16} color="#06B6D4" />
              <Text style={styles.badgeText}>OMNIBRAIN AI ENGINE</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{t.aiStudioTitle}</Text>
          <Text style={styles.subtitle}>{t.aiStudioSubtitle}</Text>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Input topic */}
            <Text style={styles.sectionLabel}>{t.promptTopic}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={t.promptTopicPlaceholder}
                placeholderTextColor="#64748B"
                value={topic}
                onChangeText={setTopic}
                multiline
              />
            </View>

            {/* Tone Selector */}
            <Text style={styles.sectionLabel}>{t.selectTone}</Text>
            <View style={styles.tonesGrid}>
              {[
                { id: 'viral', label: t.toneViral },
                { id: 'pro', label: t.toneProfessional },
                { id: 'engaging', label: t.toneEngaging },
                { id: 'hinglish', label: t.toneHinglish },
                { id: 'seo', label: t.toneSeo },
              ].map((tone) => (
                <TouchableOpacity
                  key={tone.id}
                  style={[styles.toneChip, selectedTone === tone.id && styles.toneChipActive]}
                  onPress={() => setSelectedTone(tone.id as any)}
                >
                  <Text
                    style={[
                      styles.toneText,
                      selectedTone === tone.id && styles.toneTextActive,
                    ]}
                  >
                    {tone.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Generate Trigger Button */}
            <TouchableOpacity
              style={[styles.generateBtn, !topic.trim() && styles.btnDisabled]}
              onPress={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              activeOpacity={0.8}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator size="small" color="#041B2D" />
                  <Text style={styles.generateBtnText}>{t.aiGenerating}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="flash" size={18} color="#041B2D" />
                  <Text style={styles.generateBtnText}>{t.generateAiContent}</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Generated Results Preview */}
            {hasGenerated && (
              <View style={styles.resultsContainer}>
                {/* Titles */}
                <Text style={styles.resultHeading}>{t.viralTitleVariants}</Text>
                {titleOptions.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.titleCard,
                      selectedTitleIdx === idx && styles.titleCardSelected,
                    ]}
                    onPress={() => setSelectedTitleIdx(idx)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.titleTopRow}>
                      <View style={styles.ctrBadge}>
                        <Ionicons name="trending-up" size={12} color="#10B981" />
                        <Text style={styles.ctrScoreText}>{item.ctr}% CTR</Text>
                      </View>
                      <Text style={styles.hookLabel}>{item.hook}</Text>
                    </View>
                    <Text style={styles.titleCardText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}

                {/* Description */}
                <Text style={styles.resultHeading}>{t.generatedDescription}</Text>
                <View style={styles.descBox}>
                  <Text style={styles.descText}>{generatedDesc}</Text>
                </View>

                {/* Hashtags */}
                <Text style={styles.resultHeading}>{t.generatedHashtags}</Text>
                <View style={styles.chipsRow}>
                  {generatedHashtags.map((h, i) => (
                    <View key={i} style={styles.hashChip}>
                      <Text style={styles.hashText}>{h}</Text>
                    </View>
                  ))}
                </View>

                {/* Algorithmic Tags */}
                <Text style={styles.resultHeading}>{t.generatedTags}</Text>
                <View style={styles.chipsRow}>
                  {generatedTags.map((tg, i) => (
                    <View key={i} style={styles.tagChip}>
                      <Text style={styles.tagText}>{tg}</Text>
                    </View>
                  ))}
                </View>

                {/* Apply button */}
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyAll}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkbox" size={20} color="#FFFFFF" />
                  <Text style={styles.applyBtnText}>{t.applyAllToUpload}</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
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
    marginBottom: 12,
  },
  headerBadge: {
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
    marginBottom: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 16,
  },
  scrollBody: {
    marginBottom: 10,
  },
  sectionLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    minHeight: 70,
  },
  textInput: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 20,
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  toneChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  toneChipActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06B6D4',
  },
  toneText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  toneTextActive: {
    color: '#06B6D4',
    fontWeight: '700',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  generateBtnText: {
    color: '#041B2D',
    fontSize: 15,
    fontWeight: '800',
  },
  resultsContainer: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 16,
    marginBottom: 24,
  },
  resultHeading: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  titleCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 12,
    marginBottom: 10,
  },
  titleCardSelected: {
    borderColor: '#06B6D4',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  titleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ctrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ctrScoreText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  hookLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  titleCardText: {
    color: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 19,
  },
  descBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  descText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hashChip: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  hashText: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '600',
  },
  tagChip: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  tagText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
