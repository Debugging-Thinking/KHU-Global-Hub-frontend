import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { quizApi } from '@/src/api/quiz';
import { badgeApi } from '@/src/api/badge';
import { KHU_GUIDE, type L10n } from '@/src/data/khuGuide';
import { getLocalQuestions, gradeLocally } from '@/src/data/quizHelpers';
import { BADGE_META } from '@/src/types/badge';
import type { BadgeId } from '@/src/types/badge';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { QuizAnswerItem, QuizQuestion, QuizSubmitResponse } from '@/src/types/quiz';
import { useLanguage, useT, badgeName, type Language } from '@/src/i18n';

const pickL10n = (m: L10n, lang: Language): string => m[lang] ?? m.EN ?? m.KO;

type View = 'home' | 'quiz' | 'result';

// ─── Quiz: 문제 풀기 ──────────────────────────────────────────────

function QuizView({
  questions,
  local,
  onFinish,
}: {
  questions: QuizQuestion[];
  local: boolean;
  onFinish: (response: QuizSubmitResponse) => void;
}) {
  const lang = useLanguage();
  const t = useT();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const current = questions[index];
  const total = questions.length;
  const progress = (index + 1) / total;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index]);

  const handleNext = async () => {
    if (selected === null) return;
    const newAnswers = [...answers, { questionId: current.id, selectedOption: selected }];
    setAnswers(newAnswers);

    if (index + 1 < total) {
      setIndex(index + 1);
      setSelected(null);
    } else if (local) {
      // 카테고리 퀴즈: 화면이 로컬 데이터라 채점도 로컬로 통일 (백엔드 문항과 ID/순서 불일치 방지)
      onFinish(gradeLocally(newAnswers, lang));
    } else {
      setSubmitting(true);
      try {
        const result = await quizApi.submit(newAnswers);
        onFinish(result);
      } catch {
        onFinish(gradeLocally(newAnswers, lang));
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (submitting) {
    return (
      <View style={styles.centerFull}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{t.quizScoring}</Text>
      </View>
    );
  }

  const category = KHU_GUIDE.find((c) => c.id === current.category);
  const categoryColor = category?.color ?? Colors.primary;

  return (
    <Screen padded>
      {/* 진행 바 */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: categoryColor,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {index + 1} / {total}
        </Text>
      </View>

      {/* 카테고리 뱃지 */}
      <View style={[styles.catBadge, { backgroundColor: categoryColor + '18' }]}>
        <Text style={styles.catBadgeText}>{current.category}</Text>
      </View>

      {/* 문제 */}
      <Text style={styles.questionText}>{current.question}</Text>

      {/* 선택지 — 확인 전까지 자유롭게 변경 가능 */}
      <View style={styles.optionsContainer}>
        {current.options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.optionBtn,
                isSelected && { borderColor: categoryColor, backgroundColor: categoryColor + '12' },
              ]}
              onPress={() => setSelected(i)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIndex, isSelected && { backgroundColor: categoryColor }]}>
                <Text style={[styles.optionIndexText, isSelected && { color: '#fff' }]}>
                  {['①', '②', '③', '④'][i]}
                </Text>
              </View>
              <Text style={[styles.optionText, isSelected && { color: categoryColor, fontWeight: Typography.semibold }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        label={index + 1 < total ? t.quizNext : t.quizSeeResult}
        onPress={handleNext}
        disabled={selected === null}
        fullWidth
        size="lg"
        style={styles.nextBtn}
      />
    </Screen>
  );
}

// ─── Result: 결과 화면 ────────────────────────────────────────────

function ResultView({
  response,
  questions,
  category,
  categoryId,
  onRetry,
  onHome,
}: {
  response: QuizSubmitResponse;
  questions: QuizQuestion[];
  category?: string;
  categoryId?: BadgeId;
  onRetry: () => void;
  onHome: () => void;
}) {
  const t = useT();
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q]));
  const isPerfect = response.correctCount === response.totalCount;
  const isGood = response.score >= 70;

  const scoreColor = isPerfect
    ? Colors.success
    : isGood
    ? Colors.accent
    : Colors.primary;

  return (
    <Screen scrollable padded>
      {/* 점수 배너 */}
      <View style={[styles.resultBanner, { borderTopColor: scoreColor }]}>
        <Text style={styles.resultEmoji}>{isPerfect ? '🎉' : isGood ? '👍' : '📖'}</Text>
        <Text style={[styles.resultScore, { color: scoreColor }]}>{response.score}{t.quizPointsSuffix}</Text>
        <Text style={styles.resultSub}>
          {t.quizCorrectOf(response.totalCount, response.correctCount)}
        </Text>
        <Text style={styles.resultMessage}>
          {isPerfect ? t.quizPerfectMsg : isGood ? t.quizGoodMsg : t.quizRetryMsg}
        </Text>
      </View>

      {response.score >= 70 && category && categoryId && (
        <View style={styles.badgeEarned}>
          <Text style={styles.badgeEarnedEmoji}>
            {BADGE_META[categoryId]?.emoji ?? '🏅'}
          </Text>
          <Text style={styles.badgeEarnedText}>
            {badgeName(t, categoryId)}{t.badgeEarnedSuffix}
          </Text>
        </View>
      )}

      {/* 문제별 정오 */}
      <Text style={styles.breakdownTitle}>{t.quizBreakdown}</Text>
      {response.results.map((r, i) => {
        const q = questionMap[r.questionId];
        if (!q) return null;
        return (
          <Card key={r.questionId} style={[styles.resultCard, !r.correct && styles.resultCardWrong]}>
            <View style={styles.resultCardHeader}>
              <Ionicons
                name={r.correct ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={r.correct ? Colors.success : Colors.error}
              />
              <Text style={styles.resultCardQ}>
                Q{i + 1}. {q.question}
              </Text>
            </View>
            {!r.correct && (
              <View style={styles.correctAnswerRow}>
                <Text style={styles.correctLabel}>{t.quizAnswerLabel}</Text>
                <Text style={styles.correctValue}>{q.options[r.correctAnswer]}</Text>
              </View>
            )}
            {r.explanation ? (
              <Text style={styles.explanation}>{r.explanation}</Text>
            ) : null}
          </Card>
        );
      })}

      <View style={styles.resultActions}>
        <Button label={t.quizRetry} onPress={onRetry} variant="outline" style={{ flex: 1 }} />
        <Button label={t.quizHome} onPress={onHome} style={{ flex: 1 }} />
      </View>
      <View style={{ height: Spacing[8] }} />
    </Screen>
  );
}

// ─── Home: 랜딩 ───────────────────────────────────────────────────

function HomeView({
  onQuiz,
  loading,
}: {
  onQuiz: () => void;
  loading: boolean;
}) {
  const router = useRouter();
  const lang = useLanguage();
  const t = useT();

  return (
    <Screen scrollable padded>
      <View style={styles.homeHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <Ionicons name="school" size={16} color={Colors.textInverse} />
        </View>
        <Text style={styles.homeTitle}>{t.quizHeaderTitle}</Text>
      </View>

      <View style={styles.heroBanner}>
        <View style={styles.heroAccent} />
        <Text style={styles.heroEmoji}>🧩</Text>
        <Text style={styles.heroTitle}>{t.quizHeroTitle}</Text>
        <Text style={styles.heroDesc}>{t.quizHeroDesc}</Text>
      </View>

      {/* 카테고리 요약 */}
      <View style={styles.categoryRow}>
        {KHU_GUIDE.map((cat) => (
          <View key={cat.id} style={[styles.catChip, { backgroundColor: cat.color + '18' }]}>
            <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catChipText, { color: cat.color }]}>{pickL10n(cat.title, lang)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionArea}>
        <Button
          label={loading ? t.quizLoading : t.quizStart}
          onPress={onQuiz}
          disabled={loading}
          fullWidth
          size="lg"
          style={styles.quizStartBtn}
        />
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="help-circle-outline" size={18} color={Colors.accent} />
          <Text style={styles.infoText}>{t.quizInfoCount}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="trophy-outline" size={18} color={Colors.accent} />
          <Text style={styles.infoText}>{t.quizInfoScore}</Text>
        </View>
      </Card>
    </Screen>
  );
}

// ─── Main ─────────────────────────────────────────────────────────

export default function QuizScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const lang = useLanguage();
  const categoryId = (category ?? '') as BadgeId;
  const [view, setView] = useState<View>('home');
  const [fetchedQuestions, setFetchedQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);

  const questions = category
    ? getLocalQuestions(category, lang)
    : fetchedQuestions;

  const loadQuestions = async () => {
    if (fetchedQuestions.length > 0) return fetchedQuestions;
    setLoading(true);
    try {
      const qs = await quizApi.getQuestions();
      setFetchedQuestions(qs);
      return qs;
    } catch {
      const local = getLocalQuestions(undefined, lang);
      setFetchedQuestions(local);
      return local;
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (category) {
      setView('quiz');
    } else {
      const qs = await loadQuestions();
      if (qs.length > 0) setView('quiz');
    }
  };

  const handleFinish = async (response: QuizSubmitResponse) => {
    setResult(response);
    setView('result');
    if (category && response.score >= 70) {
      badgeApi.earnBadge(categoryId).catch(() => {});
    }
  };

  if (view === 'quiz' && questions.length > 0)
    return <QuizView questions={questions} local={!!category} onFinish={handleFinish} />;
  if (view === 'result' && result)
    return <ResultView response={result} questions={questions} category={category} categoryId={category ? categoryId : undefined} onRetry={() => { setResult(null); setView('home'); }} onHome={() => setView('home')} />;

  return (
    <HomeView
      onQuiz={handleStartQuiz}
      loading={loading}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // 공통
  centerFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.background,
  },
  loadingText: { fontSize: Typography.base, color: Colors.textSecondary },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[3],
  },
  backText: { fontSize: Typography.base, color: Colors.primary, fontWeight: Typography.medium },

  // Guide
  pageTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  pageSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    marginBottom: Spacing[5],
  },
  categoryBlock: { marginBottom: Spacing[3] },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing[4],
    borderLeftWidth: 4,
    gap: Spacing[2],
    ...Shadow.sm,
  },
  categoryEmoji: { fontSize: 20 },
  categoryTitle: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  tipCount: { fontSize: Typography.xs, color: Colors.textTertiary },
  tipsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginTop: 2,
    overflow: 'hidden',
  },
  tipCard: {
    flexDirection: 'row',
    padding: Spacing[4],
    gap: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tipIcon: { fontSize: 18, marginTop: 2 },
  tipBody: { flex: 1 },
  tipTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  tipContent: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * Typography.normal,
  },

  // Quiz
  progressWrapper: {
    paddingTop: Spacing[5],
    paddingBottom: Spacing[4],
    gap: Spacing[2],
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  progressText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  catBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    marginBottom: Spacing[4],
  },
  catBadgeText: { fontSize: Typography.xs, fontWeight: Typography.semibold, color: Colors.textSecondary },
  questionText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.lg * Typography.relaxed,
    marginBottom: Spacing[6],
  },
  optionsContainer: { gap: Spacing[3], marginBottom: Spacing[6] },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  optionIndex: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textSecondary },
  optionText: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  nextBtn: { marginTop: 'auto' },

  // Result
  resultBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    alignItems: 'center',
    padding: Spacing[6],
    marginTop: Spacing[5],
    marginBottom: Spacing[5],
    borderTopWidth: 5,
    gap: Spacing[2],
    ...Shadow.md,
  },
  resultEmoji: { fontSize: 48 },
  resultScore: { fontSize: 56, fontWeight: Typography.extrabold },
  resultSub: { fontSize: Typography.base, color: Colors.textSecondary },
  resultMessage: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing[1],
  },
  breakdownTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  resultCard: { gap: Spacing[2], marginBottom: Spacing[2] },
  resultCardWrong: { borderLeftWidth: 3, borderLeftColor: Colors.error },
  resultCardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[2] },
  resultCardQ: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, fontWeight: Typography.medium },
  correctAnswerRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: Spacing[7] },
  correctLabel: { fontSize: Typography.xs, color: Colors.textTertiary },
  correctValue: { fontSize: Typography.xs, color: Colors.success, fontWeight: Typography.semibold },
  explanation: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    paddingLeft: Spacing[7],
    lineHeight: Typography.xs * Typography.normal,
  },
  resultActions: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginTop: Spacing[5],
  },

  // Home
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[4],
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTitle: { fontSize: Typography['2xl'], fontWeight: Typography.bold, color: Colors.textPrimary },
  heroBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing[6],
    alignItems: 'center',
    marginBottom: Spacing[4],
    overflow: 'hidden',
    ...Shadow.md,
  },
  heroAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 5,
    backgroundColor: Colors.primary,
  },
  heroEmoji: { fontSize: 48, marginBottom: Spacing[2] },
  heroTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  heroDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sm * Typography.relaxed,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  catChipEmoji: { fontSize: 13 },
  catChipText: { fontSize: Typography.xs, fontWeight: Typography.semibold },
  actionArea: { gap: Spacing[3], marginBottom: Spacing[4] },
  quizStartBtn: { marginTop: Spacing[1] },
  infoCard: { gap: Spacing[3] },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  infoText: { fontSize: Typography.sm, color: Colors.textSecondary },

  // Badge earned
  badgeEarned: {
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginVertical: Spacing[3],
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  badgeEarnedEmoji: { fontSize: 40, marginBottom: Spacing[2] },
  badgeEarnedText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
});
