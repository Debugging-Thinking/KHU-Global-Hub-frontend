import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { quizApi } from '@/src/api/quiz';
import { KHU_GUIDE } from '@/src/data/khuGuide';
import { LOCAL_QUIZ_QUESTIONS, gradeLocally } from '@/src/data/quizQuestions';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { QuizAnswerItem, QuizQuestion, QuizSubmitResponse } from '@/src/types/quiz';

type View = 'home' | 'guide' | 'quiz' | 'result';

// ─── Guide: 카테고리 카드 ─────────────────────────────────────────

function GuideView({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Screen scrollable padded>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        <Text style={styles.backText}>돌아가기</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>경희대 꿀팁 가이드</Text>
      <Text style={styles.pageSubtitle}>퀴즈 전 미리 공부해 두세요!</Text>

      {KHU_GUIDE.map((cat) => (
        <View key={cat.id} style={styles.categoryBlock}>
          <TouchableOpacity
            style={[styles.categoryHeader, { borderLeftColor: cat.color }]}
            onPress={() => setExpanded(expanded === cat.id ? null : cat.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <Text style={styles.tipCount}>{cat.tips.length}개 팁</Text>
            <Ionicons
              name={expanded === cat.id ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>

          {expanded === cat.id && (
            <View style={styles.tipsContainer}>
              {cat.tips.map((tip, i) => (
                <View key={i} style={styles.tipCard}>
                  <Text style={styles.tipIcon}>{tip.icon}</Text>
                  <View style={styles.tipBody}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipContent}>{tip.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={{ height: Spacing[8] }} />
    </Screen>
  );
}

// ─── Quiz: 문제 풀기 ──────────────────────────────────────────────

function QuizView({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (response: QuizSubmitResponse) => void;
}) {
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
    } else {
      setSubmitting(true);
      try {
        const result = await quizApi.submit(newAnswers);
        onFinish(result);
      } catch {
        onFinish(gradeLocally(newAnswers));
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (submitting) {
    return (
      <View style={styles.centerFull}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>채점 중...</Text>
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
        label={index + 1 < total ? '다음 문제' : '결과 보기'}
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
  onRetry,
  onHome,
}: {
  response: QuizSubmitResponse;
  questions: QuizQuestion[];
  onRetry: () => void;
  onHome: () => void;
}) {
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
        <Text style={[styles.resultScore, { color: scoreColor }]}>{response.score}점</Text>
        <Text style={styles.resultSub}>
          {response.totalCount}문제 중 {response.correctCount}개 정답
        </Text>
        <Text style={styles.resultMessage}>
          {isPerfect
            ? '완벽해요! 경희대 꿀팁 마스터!'
            : isGood
            ? '잘했어요! 조금만 더 공부하면 완벽!'
            : '가이드를 다시 읽어보고 재도전해 보세요!'}
        </Text>
      </View>

      {/* 문제별 정오 */}
      <Text style={styles.breakdownTitle}>문제별 결과</Text>
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
                <Text style={styles.correctLabel}>정답: </Text>
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
        <Button label="다시 도전" onPress={onRetry} variant="outline" style={{ flex: 1 }} />
        <Button label="홈으로" onPress={onHome} style={{ flex: 1 }} />
      </View>
      <View style={{ height: Spacing[8] }} />
    </Screen>
  );
}

const MAX_ATTEMPTS = 3;
const ATTEMPT_KEY = 'khu_quiz_attempts';

// ─── Home: 랜딩 ───────────────────────────────────────────────────

function HomeView({
  onGuide,
  onQuiz,
  loading,
  attemptsLeft,
}: {
  onGuide: () => void;
  onQuiz: () => void;
  loading: boolean;
  attemptsLeft: number;
}) {
  return (
    <Screen scrollable padded>
      <View style={styles.homeHeader}>
        <View style={styles.headerIcon}>
          <Ionicons name="school" size={16} color={Colors.textInverse} />
        </View>
        <Text style={styles.homeTitle}>KHU 꿀팁 퀴즈</Text>
      </View>

      <View style={styles.heroBanner}>
        <View style={styles.heroAccent} />
        <Text style={styles.heroEmoji}>🏫</Text>
        <Text style={styles.heroTitle}>경희대 신입생{'\n'}필수 가이드</Text>
        <Text style={styles.heroDesc}>
          수강신청·교통·맛집 등{'\n'}꼭 알아야 할 꿀팁을 공부하고{'\n'}퀴즈로 테스트해 보세요!
        </Text>
      </View>

      {/* 카테고리 요약 */}
      <View style={styles.categoryRow}>
        {KHU_GUIDE.map((cat) => (
          <View key={cat.id} style={[styles.catChip, { backgroundColor: cat.color + '18' }]}>
            <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catChipText, { color: cat.color }]}>{cat.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.guideBtn}
          onPress={() => Linking.openURL('https://www.notion.so/KHU-GUIDE-33e9ce2546d28061af04cae28b742b21')}
          activeOpacity={0.85}
        >
          <Ionicons name="book-outline" size={22} color={Colors.primary} />
          <View style={styles.guideBtnText}>
            <Text style={styles.guideBtnTitle}>가이드 읽기</Text>
            <Text style={styles.guideBtnSub}>노션에서 꿀팁 보기</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>

        {attemptsLeft > 0 ? (
          <Button
            label={loading ? '문제 불러오는 중...' : `퀴즈 시작하기 →  (${attemptsLeft}회 남음)`}
            onPress={onQuiz}
            disabled={loading}
            fullWidth
            size="lg"
            style={styles.quizStartBtn}
          />
        ) : (
          <View style={styles.lockedBox}>
            <Ionicons name="lock-closed" size={22} color={Colors.textTertiary} />
            <Text style={styles.lockedText}>도전 기회를 모두 사용했습니다</Text>
            <Text style={styles.lockedSub}>최고 점수가 경희 온도에 반영됩니다</Text>
          </View>
        )}
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="help-circle-outline" size={18} color={Colors.accent} />
          <Text style={styles.infoText}>총 14문제 · 객관식 4지선다 · 최대 3회 도전</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="trophy-outline" size={18} color={Colors.accent} />
          <Text style={styles.infoText}>점수는 프로필 경희 온도에 반영 예정</Text>
        </View>
      </Card>
    </Screen>
  );
}

// ─── Main ─────────────────────────────────────────────────────────

export default function QuizScreen() {
  const [view, setView] = useState<View>('home');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  // 앱 진입 시 남은 도전 횟수 로드
  useEffect(() => {
    (async () => {
      try {
        // 백엔드 결과 수로 우선 확인
        const results = await quizApi.getMyResults();
        setAttemptsUsed(results.length);
        await AsyncStorage.setItem(ATTEMPT_KEY, String(results.length));
      } catch {
        // 백엔드 미연결 시 로컬 저장 값 사용
        const stored = await AsyncStorage.getItem(ATTEMPT_KEY);
        setAttemptsUsed(stored ? parseInt(stored, 10) : 0);
      }
    })();
  }, []);

  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attemptsUsed);

  const loadQuestions = async () => {
    if (questions.length > 0) return questions;
    setLoading(true);
    try {
      const qs = await quizApi.getQuestions();
      setQuestions(qs);
      return qs;
    } catch {
      setQuestions(LOCAL_QUIZ_QUESTIONS);
      return LOCAL_QUIZ_QUESTIONS;
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (attemptsLeft <= 0) return;
    const qs = await loadQuestions();
    if (qs.length > 0) setView('quiz');
  };

  const handleFinish = async (response: QuizSubmitResponse) => {
    const newCount = attemptsUsed + 1;
    setAttemptsUsed(newCount);
    await AsyncStorage.setItem(ATTEMPT_KEY, String(newCount));
    setResult(response);
    setView('result');
  };

  if (view === 'guide') return <GuideView onBack={() => setView('home')} />;
  if (view === 'quiz' && questions.length > 0)
    return <QuizView questions={questions} onFinish={handleFinish} />;
  if (view === 'result' && result)
    return <ResultView response={result} questions={questions} onRetry={() => { setResult(null); setView('home'); }} onHome={() => setView('home')} />;

  return (
    <HomeView
      onGuide={() => setView('guide')}
      onQuiz={handleStartQuiz}
      loading={loading}
      attemptsLeft={attemptsLeft}
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
  lockedBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    padding: Spacing[5],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
  },
  lockedText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  lockedSub: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },

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
  guideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  guideBtnText: { flex: 1 },
  guideBtnTitle: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  guideBtnSub: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 2 },
  quizStartBtn: { marginTop: Spacing[1] },
  infoCard: { gap: Spacing[3] },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  infoText: { fontSize: Typography.sm, color: Colors.textSecondary },
});
