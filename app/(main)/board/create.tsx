import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { boardApi } from '@/src/api/board';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { BoardType } from '@/src/types/board';

export default function CreatePostScreen() {
  const router = useRouter();
  const t = useT();
  const language = useAuthStore((s) => s.profile?.language ?? 'KO');

  const BOARD_TYPES: { value: BoardType; label: string }[] = [
    { value: 'FRESHMAN', label: t.boardFreshman },
    { value: 'FREE', label: t.boardFree },
    { value: 'GRADUATE', label: t.boardGraduate },
  ];

  const [boardType, setBoardType] = useState<BoardType>('FREE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    setBoardType('FREE');
    setTitle('');
    setContent('');
    setIsAnonymous(false);
    setError('');
  }, []));

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError(t.titleContentRequired);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await boardApi.createPost({ title, content, boardType, isAnonymous, language: language as any });
      router.back();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.createPostFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.createPost}</Text>
        <Button label={t.postButton} onPress={handleSubmit} loading={loading} size="sm" />
      </View>

      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* 게시판 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.boardLabel}</Text>
          <View style={styles.chips}>
            {BOARD_TYPES.map((bt) => (
              <TouchableOpacity
                key={bt.value}
                onPress={() => setBoardType(bt.value)}
                style={[styles.chip, boardType === bt.value && styles.chipActive]}
              >
                <Text style={[styles.chipText, boardType === bt.value && styles.chipTextActive]}>
                  {bt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 제목 */}
        <View style={styles.titleInput}>
          <TextInput
            placeholder={t.titlePlaceholder}
            placeholderTextColor={Colors.textTertiary}
            style={styles.titleText}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* 내용 */}
        <TextInput
          placeholder={t.contentPlaceholder}
          placeholderTextColor={Colors.textTertiary}
          style={styles.contentText}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* 익명 설정 */}
        <View style={styles.anonymousRow}>
          <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.anonymousLabel}>{t.postAnonymously}</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: Colors.border, true: Colors.primaryMuted }}
            thumbColor={isAnonymous ? Colors.primary : Colors.textTertiary}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  scroll: { flex: 1, backgroundColor: Colors.surface },
  section: {
    padding: Spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
  },
  chips: { flexDirection: 'row', gap: Spacing[2] },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  chipTextActive: { color: Colors.primary },
  titleInput: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  titleText: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    padding: 0,
  },
  contentText: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    fontSize: Typography.base,
    color: Colors.textPrimary,
    minHeight: 300,
    lineHeight: Typography.base * Typography.relaxed,
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  anonymousLabel: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  error: {
    fontSize: Typography.sm,
    color: Colors.error,
    textAlign: 'center',
    padding: Spacing[4],
  },
});
