import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function confirmAction(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: onConfirm },
    ]);
  }
}
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { qnaApi } from '@/src/api/qna';
import { useAuthStore } from '@/src/store/authStore';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { AnswerResponse, QnADetail } from '@/src/types/qna';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function AnswerCard({
  answer,
  isQnaOwner,
  qnaId,
  onAdopt,
  onLike,
  onDelete,
}: {
  answer: AnswerResponse;
  isQnaOwner: boolean;
  qnaId: number;
  onAdopt: (answerId: number) => void;
  onLike: (answerId: number) => void;
  onDelete: (answerId: number) => void;
}) {
  return (
    <View style={[styles.answerCard, answer.isAdopted && styles.answerAdopted]}>
      {answer.isAdopted && (
        <View style={styles.adoptedBanner}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
          <Text style={styles.adoptedBannerText}>채택된 답변</Text>
        </View>
      )}
      <View style={styles.answerHeader}>
        <Text style={styles.answerAuthor}>{answer.authorName}</Text>
        <Text style={styles.answerTime}>{timeAgo(answer.createdAt)}</Text>
        {answer.isOwner && (
          <TouchableOpacity onPress={() => onDelete(answer.answerId)} style={{ marginLeft: 'auto' }}>
            <Ionicons name="trash-outline" size={14} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.answerContent}>{answer.content}</Text>
      <View style={styles.answerActions}>
        <TouchableOpacity onPress={() => onLike(answer.answerId)} style={styles.likeBtn}>
          <Ionicons
            name={answer.isLiked ? 'heart' : 'heart-outline'}
            size={14}
            color={answer.isLiked ? Colors.error : Colors.textTertiary}
          />
          <Text style={styles.likeText}>{answer.likeCount}</Text>
        </TouchableOpacity>
        {isQnaOwner && !answer.isAdopted && (
          <TouchableOpacity onPress={() => onAdopt(answer.answerId)} style={styles.adoptBtn}>
            <Text style={styles.adoptBtnText}>채택하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function QnADetailScreen() {
  const router = useRouter();
  const { qnaId } = useLocalSearchParams<{ qnaId: string }>();
  const myId = useAuthStore((s) => s.profile?.memberId);
  const language = useAuthStore((s) => s.profile?.language ?? 'KO');

  const [qna, setQna] = useState<QnADetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [answerAnonymous, setAnswerAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const id = Number(qnaId);

  const reload = () => qnaApi.getQna(id).then(setQna);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [qnaId]);

  const handleLikeQna = async () => {
    await qnaApi.likeQna(id);
    reload();
  };

  const handleAdopt = async (answerId: number) => {
    await qnaApi.adoptAnswer(id, answerId);
    reload();
  };

  const handleLikeAnswer = async (answerId: number) => {
    await qnaApi.likeAnswer(id, answerId);
    reload();
  };

  const handleDeleteQna = () => {
    confirmAction('Q&A 삭제', '정말 삭제하시겠습니까?', async () => {
      try {
        await qnaApi.deleteQna(id);
        router.back();
      } catch {}
    });
  };

  const handleDeleteAnswer = (answerId: number) => {
    confirmAction('답변 삭제', '답변을 삭제하시겠습니까?', async () => {
      try {
        await qnaApi.deleteAnswer(id, answerId);
        reload();
      } catch {}
    });
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      await qnaApi.createAnswer(id, { content: answerText, isAnonymous: answerAnonymous, language });
      setAnswerText('');
      reload();
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      if (Platform.OS === 'web') {
        window.alert(msg ?? '답변 등록에 실패했습니다.');
      } else {
        Alert.alert('오류', msg ?? '답변 등록에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!qna) return null;

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Q&A</Text>
        {qna.isOwner ? (
          <TouchableOpacity onPress={handleDeleteQna}>
            <Ionicons name="trash-outline" size={22} color={Colors.error} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 질문 */}
        <View style={styles.question}>
          <Text style={styles.questionTitle}>{qna.title}</Text>
          <View style={styles.questionMeta}>
            <Text style={styles.metaText}>{qna.authorName}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{timeAgo(qna.createdAt)}</Text>
          </View>
          <Text style={styles.questionContent}>{qna.content}</Text>
          <TouchableOpacity onPress={handleLikeQna} style={styles.likeBtn}>
            <Ionicons
              name={qna.isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={qna.isLiked ? Colors.error : Colors.textTertiary}
            />
            <Text style={styles.likeText}>{qna.likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* 답변 목록 */}
        <View style={styles.answersSection}>
          <Text style={styles.answersTitle}>답변 {qna.answers.length}</Text>
          {qna.answers.map((a) => (
            <AnswerCard
              key={a.answerId}
              answer={a}
              isQnaOwner={qna.isOwner}
              qnaId={id}
              onAdopt={handleAdopt}
              onLike={handleLikeAnswer}
              onDelete={handleDeleteAnswer}
            />
          ))}
          <View style={{ height: Spacing[16] }} />
        </View>
      </ScrollView>

      {/* 답변 입력 */}
      <View style={styles.inputBar}>
        <View style={styles.inputTop}>
          <TouchableOpacity
            onPress={() => setAnswerAnonymous(v => !v)}
            style={styles.anonymousToggle}
          >
            <Ionicons
              name={answerAnonymous ? 'checkbox' : 'square-outline'}
              size={16}
              color={answerAnonymous ? Colors.primary : Colors.textTertiary}
            />
            <Text style={[styles.anonymousLabel, answerAnonymous && { color: Colors.primary }]}>
              익명
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="답변을 입력하세요..."
            placeholderTextColor={Colors.textTertiary}
            value={answerText}
            onChangeText={setAnswerText}
            multiline
          />
          <TouchableOpacity
            onPress={handleSubmitAnswer}
            disabled={!answerText.trim() || submitting}
            style={[styles.sendBtn, (!answerText.trim() || submitting) && styles.sendDisabled]}
          >
            <Ionicons name="send" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginHorizontal: Spacing[2],
  },
  question: {
    backgroundColor: Colors.surface,
    padding: Spacing[5],
    gap: Spacing[3],
  },
  questionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.xl * Typography.normal,
  },
  questionMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  metaText: { fontSize: Typography.sm, color: Colors.textTertiary },
  metaDot: { fontSize: Typography.sm, color: Colors.textTertiary },
  questionContent: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.relaxed,
  },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1], alignSelf: 'flex-start' },
  likeText: { fontSize: Typography.sm, color: Colors.textTertiary },
  answersSection: { padding: Spacing[5], gap: Spacing[4] },
  answersTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  answerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    gap: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  answerAdopted: { borderColor: Colors.success, backgroundColor: Colors.successLight },
  adoptedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  adoptedBannerText: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: Typography.semibold,
  },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  answerAuthor: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  answerTime: { fontSize: Typography.xs, color: Colors.textTertiary },
  answerContent: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.sm * Typography.relaxed,
  },
  answerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adoptBtn: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
  },
  adoptBtnText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  inputBar: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[4],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing[2],
  },
  inputTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  anonymousLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[3],
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { backgroundColor: Colors.border },
});
