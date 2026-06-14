import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { quizApi } from '@/src/api/quiz';
import { adminQuizApi, type AdminQuizQuestionBody, type AdminQuizQuestion } from '@/src/api/adminQuiz';
import { guideApi } from '@/src/api/guide';
import { badgeApi } from '@/src/api/badge';
import { BADGE_META } from '@/src/types/badge';
import type { BadgeId } from '@/src/types/badge';
import { Radius, Shadow, Spacing, Typography, type ThemeColors } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/src/theme';
import type { QuizAnswerItem, QuizQuestion, QuizSubmitResponse } from '@/src/types/quiz';
import type { GuideCategory } from '@/src/types/guide';
import { useAuthStore } from '@/src/store/authStore';
import { useLanguage, useT, badgeName } from '@/src/i18n';

type ScreenMode = 'home' | 'quiz' | 'result';

// 관리자 카테고리 셀렉터용 고정 5개 badgeKey (백엔드 category 값).
const ADMIN_CATEGORY_KEYS: BadgeId[] = ['COURSE_REG', 'TRANSPORT', 'FOOD', 'CAMPUS_SITE', 'HUMANITIES'];
// 보기 표기 기호 — 기존 QuizView 표기(①②③④)와 동일. 보기 최소 2 / 최대 4.
const OPTION_SYMBOLS = ['①', '②', '③', '④'];
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;

// 관리자 문항 편집 상태 (null이면 모달 미마운트 → 일반 사용자 화면 100% 동일).
type QuestionEditState = {
  mode: 'create' | 'edit';
  questionId?: number;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

// 웹(window.confirm)/네이티브(Alert) 호환 삭제 확인 헬퍼 (guide.tsx와 동일).
function confirmAction(
  title: string,
  message: string,
  cancelLabel: string,
  okLabel: string,
  onConfirm: () => void,
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: cancelLabel, style: 'cancel' },
      { text: okLabel, style: 'destructive', onPress: onConfirm },
    ]);
  }
}

// ─── Quiz: 문제 풀기 ──────────────────────────────────────────────

function QuizView({
  questions,
  colorByCategory,
  onFinish,
}: {
  questions: QuizQuestion[];
  colorByCategory: Record<string, string>;
  onFinish: (response: QuizSubmitResponse) => void;
}) {
  const lang = useLanguage();
  const t = useT();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
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
    const answer = { questionId: current.id, selectedOption: selected };

    if (index + 1 < total) {
      setAnswers([...answers, answer]);
      setIndex(index + 1);
      setSelected(null);
      return;
    }

    // 마지막 문항 → 백엔드 채점 (단일 소스). 실패 시 재시도할 수 있도록 selected 유지.
    const finalAnswers = [...answers, answer];
    setSubmitting(true);
    try {
      const result = await quizApi.submit(finalAnswers, lang);
      onFinish(result);
    } catch {
      setSubmitting(false);
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

  const categoryColor = colorByCategory[current.category] ?? Colors.primary;

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
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
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
  category,
  categoryTitle,
  colorByCategory,
  loading,
  questionCount,
  onStart,
}: {
  category?: string;
  categoryTitle: string;
  colorByCategory: Record<string, string>;
  loading: boolean;
  questionCount: number;
  onStart: () => void;
}) {
  const router = useRouter();
  const t = useT();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);

  const header = (
    <View style={styles.homeHeader}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerIcon}>
        <Ionicons name="school" size={16} color={Colors.textInverse} />
      </View>
      <Text style={styles.homeTitle}>{t.quizHeaderTitle}</Text>
    </View>
  );

  // "총 N문제" — 카테고리 실제 문항 수로 동적 표시(고정 i18n 문자열의 14만 치환). 미로드 시 기본 문자열.
  const countText =
    questionCount > 0 ? t.quizInfoCount.replace('14', String(questionCount)) : t.quizInfoCount;

  const infoCard = (
    <Card style={styles.infoCard}>
      <View style={styles.infoRow}>
        <Ionicons name="help-circle-outline" size={18} color={Colors.accent} />
        <Text style={styles.infoText}>{countText}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="trophy-outline" size={18} color={Colors.accent} />
        <Text style={styles.infoText}>{t.quizInfoScore}</Text>
      </View>
    </Card>
  );

  // ── 단일 카테고리 시작 화면 (가이드에서 진입). category 없는 직접 진입은 메인에서 가이드로 리다이렉트됨 ──
  const color = colorByCategory[category ?? ''] ?? Colors.primary;
  return (
    <Screen scrollable padded>
      {header}
      <View style={styles.heroBanner}>
        <View style={[styles.heroAccent, { backgroundColor: color }]} />
        <Text style={styles.heroEmoji}>🧩</Text>
        <Text style={styles.heroTitle}>{categoryTitle || t.quizHeroTitle}</Text>
        <Text style={styles.heroDesc}>{t.quizHeroDesc}</Text>
      </View>

      <View style={styles.actionArea}>
        <Button
          label={loading ? t.quizLoading : t.quizStart}
          onPress={onStart}
          disabled={loading}
          fullWidth
          size="lg"
          style={styles.quizStartBtn}
        />
      </View>

      {infoCard}
    </Screen>
  );
}

// ─── Admin: 문항 목록 + CRUD (관리자 전용) ────────────────────────

function AdminQuestionListView({
  title,
  questions,
  loading,
  onBack,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  questions: QuizQuestion[];
  loading: boolean;
  onBack: () => void;
  onAdd: () => void;
  onEdit: (q: QuizQuestion) => void;
  onDelete: (q: QuizQuestion) => void;
}) {
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  return (
    <Screen padded={false}>
      <View style={styles.adminHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.adminHeaderTitle} numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView
        style={styles.adminScroll}
        contentContainerStyle={styles.adminContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && questions.length === 0 ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing[6] }} />
        ) : null}

        {questions.map((q, i) => (
          <Card key={q.id} style={styles.adminQCard}>
            <View style={styles.adminQTop}>
              <Text style={styles.adminQNum}>Q{i + 1}</Text>
              <Text style={styles.adminQText}>{q.question}</Text>
            </View>
            {q.options.map((opt, oi) => (
              <Text key={oi} style={styles.adminOptText}>
                {(OPTION_SYMBOLS[oi] ?? `${oi + 1}.`)} {opt}
              </Text>
            ))}
            <View style={styles.adminQActions}>
              <TouchableOpacity style={styles.adminActionBtn} onPress={() => onEdit(q)} activeOpacity={0.7}>
                <Ionicons name="pencil" size={14} color={Colors.textSecondary} />
                <Text style={styles.adminActionText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adminActionBtn} onPress={() => onDelete(q)} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={14} color={Colors.error} />
                <Text style={[styles.adminActionText, { color: Colors.error }]}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {!loading && questions.length === 0 ? (
          <Text style={styles.adminEmpty}>등록된 문항이 없습니다.</Text>
        ) : null}

        <TouchableOpacity style={styles.addQCard} onPress={onAdd} activeOpacity={0.7}>
          <Ionicons name="add" size={18} color={Colors.primary} />
          <Text style={styles.addQText}>문항 추가</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing[8] }} />
      </ScrollView>
    </Screen>
  );
}

// ─── Admin: 문항 추가/수정 폼 모달 ────────────────────────────────
// 부모가 editState 있을 때만 마운트 → useState 초기값으로 KO 원문 시드.

function QuestionFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial: QuestionEditState;
  onClose: () => void;
  onSave: (v: {
    category: string;
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }) => Promise<void>;
}) {
  const t = useT();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  // 카테고리는 진입한 퀴즈 목록의 카테고리로 고정 (폼에서 선택 안 함).
  const category = initial.category;
  const [question, setQuestion] = useState(initial.question);
  const [options, setOptions] = useState<string[]>(
    initial.options.length >= MIN_OPTIONS
      ? initial.options.slice(0, MAX_OPTIONS)
      : [...initial.options, ...Array(MIN_OPTIONS - initial.options.length).fill('')],
  );
  const [answerIndex, setAnswerIndex] = useState(
    initial.answerIndex >= 0 && initial.answerIndex < initial.options.length ? initial.answerIndex : 0,
  );
  const [explanation, setExplanation] = useState(initial.explanation);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOption = (i: number, val: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));

  const addOption = () =>
    setOptions((prev) => (prev.length >= MAX_OPTIONS ? prev : [...prev, '']));

  const removeOption = (i: number) => {
    if (options.length <= MIN_OPTIONS) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    // 삭제로 인덱스가 당겨지므로 정답 인덱스 보정.
    setAnswerIndex((prev) => (prev === i ? 0 : prev > i ? prev - 1 : prev));
  };

  const submit = async () => {
    if (saving) return;
    const trimmedQ = question.trim();
    const trimmedOpts = options.map((o) => o.trim());
    if (!trimmedQ) { setError('질문을 입력해주세요.'); return; }
    if (trimmedOpts.length < MIN_OPTIONS) { setError('보기는 최소 2개입니다.'); return; }
    if (trimmedOpts.some((o) => !o)) { setError('빈 보기가 있어요. 내용을 채우거나 삭제해주세요.'); return; }
    if (answerIndex < 0 || answerIndex >= trimmedOpts.length) { setError('정답 보기를 선택해주세요.'); return; }
    setError(null);
    setSaving(true);
    try {
      await onSave({ category, question: trimmedQ, options: trimmedOpts, answerIndex, explanation: explanation.trim() });
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{initial.mode === 'create' ? '문항 추가' : '문항 수정'}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.formBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.formLabel}>질문</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={question}
              onChangeText={setQuestion}
              placeholder="질문을 입력하세요"
              placeholderTextColor={Colors.textTertiary}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.formLabel}>보기 (정답을 선택)</Text>
            {options.map((opt, i) => {
              const sel = answerIndex === i;
              const canRemove = options.length > MIN_OPTIONS;
              return (
                <View key={i} style={styles.optionRow}>
                  <TouchableOpacity
                    style={[styles.radio, sel && styles.radioSelected]}
                    onPress={() => setAnswerIndex(i)}
                    hitSlop={6}
                    activeOpacity={0.7}
                  >
                    {sel ? <View style={styles.radioDot} /> : null}
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, styles.optionInput]}
                    value={opt}
                    onChangeText={(v) => updateOption(i, v)}
                    placeholder={`보기 ${i + 1}`}
                    placeholderTextColor={Colors.textTertiary}
                  />
                  <TouchableOpacity
                    style={styles.optRemoveBtn}
                    onPress={() => removeOption(i)}
                    disabled={!canRemove}
                    hitSlop={6}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={20}
                      color={canRemove ? Colors.error : Colors.border}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
            {options.length < MAX_OPTIONS ? (
              <TouchableOpacity style={styles.addOptBtn} onPress={addOption} activeOpacity={0.7}>
                <Ionicons name="add" size={16} color={Colors.primary} />
                <Text style={styles.addOptText}>보기 추가</Text>
              </TouchableOpacity>
            ) : null}

            <Text style={styles.formLabel}>해설</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={explanation}
              onChangeText={setExplanation}
              placeholder="해설을 입력하세요"
              placeholderTextColor={Colors.textTertiary}
              multiline
              textAlignVertical="top"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={submit}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <Text style={styles.saveBtnText}>{t.save}</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: Spacing[6] }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main ─────────────────────────────────────────────────────────

export default function QuizScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const lang = useLanguage();
  const t = useT();
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  const router = useRouter();
  const categoryId = (category ?? '') as BadgeId;
  const [view, setView] = useState<ScreenMode>('home');
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  // 관리자 편집 상태 (null이면 모달 미마운트 → 일반 사용자 영향 0).
  const [questionEdit, setQuestionEdit] = useState<QuestionEditState | null>(null);
  // 관리자 전용 KO 원문 문항(정답/해설 포함) — 목록 표시 + 수정 폼 프리필.
  const [adminQuestions, setAdminQuestions] = useState<AdminQuizQuestion[]>([]);

  // 카테고리 메타(이모지/색상/제목)는 가이드 API에서 — 칩 표시 + 문항 카테고리 색상 매핑 + 관리자 셀렉터 라벨용.
  useEffect(() => {
    guideApi.getGuide(lang).then(setCategories).catch(() => {});
  }, [lang]);

  const colorByCategory = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.badgeKey, c.color] as const)),
    [categories],
  );

  const categoryTitle = useMemo(
    () =>
      categories.find((c) => c.badgeKey === category)?.title ??
      (category ? BADGE_META[categoryId]?.nameKO ?? category : ''),
    [categories, category, categoryId],
  );

  // 일반 사용자 응시용 공개 문항 로드(현재 언어, 정답 미포함). category 지정 시 해당 카테고리만.
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const qs = await quizApi.getQuestions(lang, category);
      setQuestions(qs);
      return qs;
    } catch {
      setQuestions([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [lang, category]);

  // 관리자 문항 로드 — admin GET(KO 원문)으로 정답(answerIndex)·해설(explanation)까지 보유.
  // 목록 표시 + 수정 폼 프리필 공용. 저장이 항상 KO라 화면 언어와 무관하게 KO로 시드.
  const loadAdminQuestions = useCallback(async () => {
    if (!category) return;
    setLoading(true);
    try {
      const qs = await adminQuizApi.getQuestions(category, 'KO');
      setAdminQuestions(qs);
    } catch {
      setAdminQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // ── 응시 독립성 ① category/언어 변경 → 응시 상태 전부 초기화 + 문항 미리 로드 ──
  // category param이 바뀌면 이전 카테고리의 문항/결과가 남지 않도록 폐기.
  useEffect(() => {
    setView('home');
    setResult(null);
    if (isAdmin && category) {
      loadAdminQuestions(); // 관리자: 정답/해설 포함 목록을 진입 즉시 표시
    } else if (category) {
      loadQuestions(); // 일반 사용자: 시작화면 문항 수 표시용 미리 로드(시작 시 재사용)
    } else {
      setQuestions([]);
    }
  }, [category, isAdmin, loadQuestions, loadAdminQuestions]);

  // ── 응시 독립성 ② 화면 재포커스 시 진행상태 폐기(항상 처음부터) ──
  // 이탈 후 재진입(인스턴스 유지) 시 mid-quiz 상태가 남지 않도록 홈으로 리셋.
  // quiz→result 전환은 포커스 변화가 아니므로 정상 흐름은 보존된다.
  useFocusEffect(
    useCallback(() => {
      setView('home');
      setResult(null);
    }, []),
  );

  const handleStartQuiz = async () => {
    // 진입 시 미리 로드한 문항이 있으면 재사용, 없으면 로드(응시 데이터 동일).
    const qs = questions.length > 0 ? questions : await loadQuestions();
    if (qs.length > 0) setView('quiz');
  };

  const handleFinish = async (response: QuizSubmitResponse) => {
    setResult(response);
    setView('result');
    if (category && response.score >= 70) {
      badgeApi.earnBadge(categoryId).catch(() => {});
    }
  };

  // ── 관리자 문항 CRUD 동선 ──
  const openQuestionCreate = useCallback(() => {
    setQuestionEdit({
      mode: 'create',
      category: category ?? ADMIN_CATEGORY_KEYS[0],
      question: '',
      options: ['', ''],
      answerIndex: 0,
      explanation: '',
    });
  }, [category]);

  // 수정 초기값은 admin GET(KO 원문)으로 시드 — 정답(answerIndex)·해설(explanation)까지 프리필.
  // adminQuestions가 진입 시 KO로 로드돼 있으므로 id로 찾아 그대로 사용(추가 호출 없음).
  const openQuestionEdit = useCallback(
    (q: QuizQuestion) => {
      const seed = adminQuestions.find((x) => x.id === q.id);
      setQuestionEdit({
        mode: 'edit',
        questionId: q.id,
        category: q.category,
        question: seed?.question ?? q.question,
        options: seed?.options.length ? seed.options : q.options.length ? q.options : ['', ''],
        answerIndex: seed?.answerIndex ?? 0,
        explanation: seed?.explanation ?? '',
      });
    },
    [adminQuestions],
  );

  const handleDeleteQuestion = useCallback(
    (q: QuizQuestion) => {
      confirmAction('문항 삭제', '이 문항을 삭제할까요?', t.cancel, t.delete, async () => {
        try {
          await adminQuizApi.deleteQuestion(q.id);
          await loadAdminQuestions();
        } catch {
          // 무시 (실패 시 화면 변화 없음)
        }
      });
    },
    [t, loadAdminQuestions],
  );

  // category 없이 직접 진입(퀴즈는 가이드 종속) → 가이드로 보냄. 일반/관리자 공통.
  if (!category) return <Redirect href="/(main)/guide" />;

  // 관리자 + 카테고리 → 응시 대신 문항 관리(목록 + CRUD).
  if (isAdmin) {
    return (
      <>
        <AdminQuestionListView
          title={categoryTitle ? `${categoryTitle} 문항` : '퀴즈 문항 관리'}
          questions={adminQuestions}
          loading={loading}
          onBack={() => router.back()}
          onAdd={openQuestionCreate}
          onEdit={openQuestionEdit}
          onDelete={handleDeleteQuestion}
        />
        {questionEdit ? (
          <QuestionFormModal
            initial={questionEdit}
            onClose={() => setQuestionEdit(null)}
            onSave={async (v) => {
              const body: AdminQuizQuestionBody = {
                category: v.category,
                question: v.question,
                options: v.options,
                answerIndex: v.answerIndex,
                explanation: v.explanation,
                language: 'KO',
              };
              if (questionEdit.mode === 'create') await adminQuizApi.createQuestion(body);
              else await adminQuizApi.updateQuestion(questionEdit.questionId!, body);
              setQuestionEdit(null);
              await loadAdminQuestions();
            }}
          />
        ) : null}
      </>
    );
  }

  // 일반 사용자 (회귀 0 — 기존 응시 흐름 유지)
  if (view === 'quiz' && questions.length > 0)
    return <QuizView questions={questions} colorByCategory={colorByCategory} onFinish={handleFinish} />;
  if (view === 'result' && result)
    return <ResultView response={result} questions={questions} category={category} categoryId={category ? categoryId : undefined} onRetry={() => { setResult(null); setView('home'); }} onHome={() => setView('home')} />;

  return (
    <HomeView
      category={category}
      categoryTitle={categoryTitle}
      colorByCategory={colorByCategory}
      loading={loading}
      questionCount={questions.length}
      onStart={handleStartQuiz}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
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

  // ── 관리자 문항 목록 ─────────────────────────────────────────
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[4],
    gap: Spacing[3],
  },
  adminHeaderTitle: {
    flex: 1,
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  adminScroll: { flex: 1 },
  adminContent: { paddingHorizontal: Spacing[4] },
  adminQCard: { gap: Spacing[1], marginBottom: Spacing[3] },
  adminQTop: { flexDirection: 'row', gap: Spacing[2], marginBottom: Spacing[1] },
  adminQNum: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  adminQText: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.normal,
  },
  adminOptText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    paddingLeft: Spacing[2],
  },
  adminQActions: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginTop: Spacing[2],
    justifyContent: 'flex-end',
  },
  adminActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
  },
  adminActionText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  adminEmpty: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing[6],
  },
  addQCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
    paddingVertical: Spacing[4],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primaryMuted,
    backgroundColor: Colors.primaryLight,
    marginTop: Spacing[1],
  },
  addQText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },

  // ── 폼 모달 ─────────────────────────────────────────────────
  backdrop: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '88%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    marginTop: Spacing[2],
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  modalTitle: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginRight: Spacing[3],
  },
  formBody: { padding: Spacing[5], gap: Spacing[2] },
  formLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing[2],
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  inputMultiline: { minHeight: 80 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  radio: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  optionInput: { flex: 1 },
  optRemoveBtn: { width: 28, alignItems: 'center', justifyContent: 'center' },
  addOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[1],
  },
  addOptText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing[2],
  },
  saveBtn: {
    marginTop: Spacing[5],
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
});
