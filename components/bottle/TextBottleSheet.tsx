import React, { memo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GlassCard } from '@/components/ui';

const PRESET_TAGS = ['心情', '日常', '秘密', '梦想', '吐槽', '晚安'] as const;
const MAX_CHARS = 500;

interface TextBottleSheetProps {
  onSubmit: (text: string, tags: string[]) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

function TextBottleSheetComponent({
  onSubmit,
  onClose,
  isSubmitting,
}: TextBottleSheetProps) {
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedText = text.trim();
    if (trimmedText.length > 0 && !isSubmitting) {
      onSubmit(trimmedText, selectedTags);
    }
  }, [text, selectedTags, isSubmitting, onSubmit]);

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit = text.trim().length > 0 && !isOverLimit && !isSubmitting;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>取消</Text>
          </Pressable>
          <Text style={styles.title}>写一个漂流瓶</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="把你的心事写下来，投向星海..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            value={text}
            onChangeText={setText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={MAX_CHARS + 50}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
          <Text style={[styles.charCount, isOverLimit && styles.charCountOver]}>
            {charCount}/{MAX_CHARS}
          </Text>
        </View>

        <View style={styles.tagsSection}>
          <Text style={styles.tagsLabel}>选择标签</Text>
          <View style={styles.tagsRow}>
            {PRESET_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  style={[styles.tag, isSelected && styles.tagSelected]}
                  onPress={() => toggleTag(tag)}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.submitSection}>
          <GlassCard
            onPress={canSubmit ? handleSubmit : undefined}
            glowColor={canSubmit ? '#FFD166' : '#5BC0BE'}
            padding="none"
            style={styles.submitCard}
          >
            <View
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
            >
              <Text style={styles.submitText}>
                {isSubmitting ? '投递中...' : '投入星海'}
              </Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  inputContainer: {
    backgroundColor: 'rgba(11, 19, 43, 0.8)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(91, 192, 190, 0.2)',
    padding: 16,
    minHeight: 180,
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: '#5BC0BE',
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    minHeight: 140,
  },
  charCount: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  charCountOver: {
    color: '#FF6B6B',
  },
  tagsSection: {
    marginTop: 24,
  },
  tagsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(91, 192, 190, 0.3)',
  },
  tagSelected: {
    backgroundColor: 'rgba(91, 192, 190, 0.25)',
    borderColor: '#5BC0BE',
  },
  tagText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tagTextSelected: {
    color: '#5BC0BE',
    fontWeight: '500',
  },
  submitSection: {
    marginTop: 32,
  },
  submitCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: '#FFD166',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(255, 209, 102, 0.4)',
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B132B',
    letterSpacing: 1,
  },
});

export default memo(TextBottleSheetComponent);
