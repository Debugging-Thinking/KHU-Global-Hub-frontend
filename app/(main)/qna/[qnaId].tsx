import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function confirmAction(title: string, message: string, cancelLabel: string, deleteLabel: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: cancelLabel, style: 'cancel' },
      { text: deleteLabel, style: 'destructive', onPress: onConfirm },
    ]);
  }
}
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { AuthorName } from '@/src/components/ui/AuthorName';
import { Attachment } from '@/src/components/ui/Attachment';
import { ImagePickerButton } from '@/src/components/ui/ImagePickerButton';
import { qnaApi } from '@/src/api/qna';
import { useAuthStore } from '@/src/store/authStore';
import { useT, timeAgo } from '@/src/i18n';
import { isPrestoredMode } from '@/src/i18n/preferredLanguage';
import { useItemTranslation } from '@/src/hooks/useTextTranslate';
import type { Language } from '@/src/i18n';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { AnswerResponse, QnADetail } from '@/src/types/qna';

function AnswerCard({
  answer,
  isQnaOwner,
  t,
  prestored,
  viewerBucket,
  preferredCode,
  onAdopt,
  onLike,
  onDelete,
  onAuthorPress,
}: {
  answer: AnswerResponse;
  isQnaOwner: boolean;
  t: ReturnType<typeof useT>;
  prestored: boolean;
  viewerBucket: Language;
  preferredCode: string;
  onAdopt: (answerId: number) => void;
  onLike: (answerId: number) => void;
  onDelete: (answerId: number) => void;
  onAuthorPress: (id: number) => void;
}) {
  const tr = useItemTranslation([answer.content], [answer.originalContent], answer.originalLanguage, prestored, viewerBucket, preferredCode);
  return (
    <View style={[styles.answerCard, answer.isAdopted && styles.answerAdopted]}>
      {answer.isAdopted && (
        <View style={styles.adoptedBanner}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
          <Text style={styles.adoptedBannerText}>{t.adoptedAnswer}</Text>
        </View>
      )}
      <View style={styles.answerHeader}>
        <AuthorName name={answer.authorName} authorId={answer.authorId} onPress={onAuthorPress} style={styles.answerAuthor} />
        <Text style={styles.answerTime}>{timeAgo(answer.createdAt, t)}</Text>
        {answer.isOwner && (
          <TouchableOpacity onPress={() => onDelete(answer.answerId)} style={{ marginLeft: 'auto' }}>
            <Ionicons name="trash-outline" size={14} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.answerContent}>{tr.displays[0]}</Text>
      {answer.imageUrl ? <Attachment url={answer.imageUrl} imageStyle={styles.qnaImage} /> : null}
      <View style={styles.answerActions}>
        <TouchableOpacity onPress={() => onLike(answer.answerId)} style={styles.likeBtn}>
          <Ionicons
            name={answer.isLiked ? 'heart' : 'heart-outline'}
            size={14}
            color={answer.isLiked ? Colors.error : Colors.textTertiary}
          />
          <Text style={styles.likeText}>{answer.likeCount}</Text>
        </TouchableOpacity>
        <View style={styles.answerActionsRight}>
          {tr.showToggle && (
            <TouchableOpacity onPress={tr.toggle}>
              <Text style={styles.answerTranslateText}>
                {tr.loading ? t.translating : tr.showOriginal ? t.viewTranslation : t.viewOriginal}
              </Text>
            </TouchableOpacity>
          )}
          {isQnaOwner && !answer.isAdopted && (
            <TouchableOpacity onPress={() => onAdopt(answer.answerId)} style={styles.adoptBtn}>
              <Text style={styles.adoptBtnText}>{t.adopt}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default function QnADetailScreen() {
  const router = useRouter();
  const t = useT();
  const { qnaId } = useLocalSearchParams<{ qnaId: string }>();
  const userLanguage = useAuthStore((s) => s.profile?.language ?? 'KO');
  const preferredCode = useAuthStore((s) => s.profile?.preferredLanguage ?? 'en');
  const prestored = isPrestoredMode(preferredCode);

  const [qna, setQna] = useState<QnADetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [answerAnonymous, setAnswerAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // 질문 본문(제목+본문 한 단위) 항목별 원문↔번역 토글.
  const qnaTr = useItemTranslation(
    [qna?.title ?? '', qna?.content ?? ''],
    [qna?.originalTitle ?? '', qna?.originalContent ?? ''],
    qna?.originalLanguage,
    prestored,
    userLanguage as Language,
    preferredCode,
  );

  const id = Number(qnaId);
  const goProfile = (memberId: number) => router.push(`/(main)/mentor-profile?memberId=${memberId}` as any);

  const reload = async () => {
    const data = await qnaApi.getQna(id, userLanguage as any);
    setQna(data);
  };

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [qnaId, userLanguage]);

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
    confirmAction(t.deleteQna, t.confirmDeleteQna, t.cancel, t.delete, async () => {
      try {
        await qnaApi.deleteQna(id);
        router.navigate('/(main)');
      } catch {}
    });
  };

  const handleDeleteAnswer = (answerId: number) => {
    confirmAction(t.deleteAnswer, t.confirmDeleteAnswer, t.cancel, t.delete, async () => {
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
      await qnaApi.createAnswer(id, { content: answerText, isAnonymous: answerAnonymous, language: userLanguage as any, imageUrl: answerImage });
      setAnswerText('');
      setAnswerImage(null);
      reload();
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      if (Platform.OS === 'web') {
        window.alert(msg ?? t.answerFailed);
      } else {
        Alert.alert(t.errorTitle, msg ?? t.answerFailed);
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

  const bodyTitle = qnaTr.displays[0];
  const bodyContent = qnaTr.displays[1];

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate('/(main)')}>
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
          <Text style={styles.questionTitle}>{bodyTitle}</Text>
          <View style={styles.questionMeta}>
            <AuthorName name={qna.authorName} authorId={qna.authorId} onPress={goProfile} style={styles.metaText} />
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{timeAgo(qna.createdAt, t)}</Text>
          </View>

          {/* 질문 본문 원문↔번역 토글 (항목별) */}
          {qnaTr.showToggle && (
            <TouchableOpacity onPress={qnaTr.toggle} style={styles.translateBtn} disabled={qnaTr.loading}>
              <Ionicons
                name={qnaTr.showOriginal ? 'document-text-outline' : 'language-outline'}
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.translateBtnText}>
                {qnaTr.loading ? t.translating : qnaTr.showOriginal ? t.viewTranslation : t.viewOriginal}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.questionContent}>{bodyContent}</Text>
          {qna.imageUrl ? <Attachment url={qna.imageUrl} imageStyle={styles.qnaImage} /> : null}
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
          <Text style={styles.answersTitle}>{t.answersLabel(qna.answers.length)}</Text>
          {qna.answers.map((a) => (
            <AnswerCard
              key={a.answerId}
              answer={a}
              isQnaOwner={qna.isOwner}
              t={t}
              prestored={prestored}
              viewerBucket={userLanguage as Language}
              preferredCode={preferredCode}
              onAdopt={handleAdopt}
              onLike={handleLikeAnswer}
              onDelete={handleDeleteAnswer}
              onAuthorPress={goProfile}
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
              {t.anonymous}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <ImagePickerButton imageUrl={answerImage} onChange={setAnswerImage} />
          <TextInput
            style={styles.input}
            placeholder={t.answerPlaceholder}
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
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  translateBtnText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  questionContent: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.relaxed,
  },
  qnaImage: { width: 200, height: 200, borderRadius: Radius.md, marginTop: Spacing[2] },
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
  answerActionsRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  answerTranslateText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.medium },
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
