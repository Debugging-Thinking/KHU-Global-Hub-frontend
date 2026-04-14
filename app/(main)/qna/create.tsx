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
import { qnaApi } from '@/src/api/qna';
import { useAuthStore } from '@/src/store/authStore';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function CreateQnAScreen() {
  const router = useRouter();
  const language = useAuthStore((s) => s.profile?.language ?? 'KO');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    setTitle('');
    setContent('');
    setIsAnonymous(false);
    setError('');
  }, []));

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await qnaApi.createQna({ title, content, isAnonymous, language });
      router.replace('/(main)/qna');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '질문 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>질문 작성</Text>
        <Button label="등록" onPress={handleSubmit} loading={loading} size="sm" />
      </View>

      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.titleInput}>
          <TextInput
            placeholder="제목을 입력하세요"
            placeholderTextColor={Colors.textTertiary}
            style={styles.titleText}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>
        <TextInput
          placeholder="질문 내용을 자세히 작성하면 더 좋은 답변을 받을 수 있어요"
          placeholderTextColor={Colors.textTertiary}
          style={styles.contentText}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <View style={styles.anonymousRow}>
          <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.anonymousLabel}>익명으로 게시</Text>
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
