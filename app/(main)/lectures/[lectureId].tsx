import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { lectureApi } from '@/src/api/lecture';
import { useAuthStore } from '@/src/store/authStore';
import { useT, useLanguage, timeAgo, type Language } from '@/src/i18n';
import { isPrestoredMode } from '@/src/i18n/preferredLanguage';
import { useItemTranslation } from '@/src/hooks/useTextTranslate';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { CourseReview, LectureDetail } from '@/src/types/lecture';

// 별점 색 — 밝은 골드(채움) + 따뜻한 라이트그레이(빈칸)
const STAR_GOLD = '#F5B301';
const STAR_EMPTY = '#E6DFD9';

function confirmAction(title: string, message: string, cancel: string, ok: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: cancel, style: 'cancel' },
      { text: ok, style: 'destructive', onPress: onConfirm },
    ]);
  }
}

// ─── 별점 ──────────────────────────────────────────────────────────

function StarRow({ value, size = 15, gap = 2 }: { value: number; size?: number; gap?: number }) {
  // 반올림(0.5단위) — 평균 4.3 → 4.5개 표시. star-half로 부분 별 표현.
  const rounded = Math.round(value * 2) / 2;
  return (
    <View style={[styles.starRow, { gap }]}>
      {[1, 2, 3, 4, 5].map((i) => {
        const name = rounded >= i ? 'star' : rounded >= i - 0.5 ? 'star-half' : 'star';
        const filled = rounded >= i - 0.5;
        return <Ionicons key={i} name={name} size={size} color={filled ? STAR_GOLD : STAR_EMPTY} />;
      })}
    </View>
  );
}

function StarSelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={styles.starSelect}>
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= value;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onChange(i)}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            activeOpacity={0.7}
            style={styles.starTap}
          >
            <Ionicons name="star" size={36} color={active ? STAR_GOLD : STAR_EMPTY} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── 칩 선택 그룹 (단일 선택, 다시 누르면 해제) ──────────────────────

type Opt = { value: string; label: string };

function ChipGroup({
  options, value, onSelect,
}: { options: Opt[]; value: string | null; onSelect: (v: string | null) => void }) {
  return (
    <View style={styles.chipRow}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <TouchableOpacity
            key={o.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(active ? null : o.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── 지표 집계 분포 막대 ─────────────────────────────────────────────

function DistRow({
  label, counts, opts, colors, t,
}: { label: string; counts: Record<string, number>; opts: Opt[]; colors: string[]; t: ReturnType<typeof useT> }) {
  const total = opts.reduce((s, o) => s + (counts[o.value] ?? 0), 0);
  return (
    <View style={styles.distRow}>
      <Text style={styles.distLabel}>{label}</Text>
      {total === 0 ? (
        <Text style={styles.distNoData}>{t.crNoData}</Text>
      ) : (
        <View style={styles.distRight}>
          <View style={styles.distBar}>
            {opts.map((o, i) =>
              (counts[o.value] ?? 0) > 0 ? (
                <View key={o.value} style={{ flex: counts[o.value], backgroundColor: colors[i] }} />
              ) : null
            )}
          </View>
          <View style={styles.distLegend}>
            {opts.map((o, i) =>
              (counts[o.value] ?? 0) > 0 ? (
                <View key={o.value} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors[i] }]} />
                  <Text style={styles.legendText}>{o.label} {counts[o.value]}</Text>
                </View>
              ) : null
            )}
          </View>
        </View>
      )}
    </View>
  );
}

// ─── 강의평 카드 ─────────────────────────────────────────────────────

// 항목별 원문↔번역 토글 링크 (게시판과 동일).
function ItemToggle({ tr, t }: { tr: ReturnType<typeof useItemTranslation>; t: ReturnType<typeof useT> }) {
  if (!tr.showToggle) return null;
  return (
    <TouchableOpacity onPress={tr.toggle} hitSlop={6} style={styles.translateBtn}>
      <Ionicons name="language-outline" size={12} color={Colors.primary} />
      <Text style={styles.translateBtnText}>
        {tr.loading ? t.translating : tr.showOriginal ? t.viewTranslation : t.viewOriginal}
      </Text>
    </TouchableOpacity>
  );
}

function ReviewCard({
  review, chips, prestored, viewerBucket, preferredCode, t, onDelete,
}: {
  review: CourseReview;
  chips: { label: string; value: string }[];
  prestored: boolean;
  viewerBucket: Language;
  preferredCode: string;
  t: ReturnType<typeof useT>;
  onDelete: () => void;
}) {
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  // 강의평 본문 = 게시판 방식: 6개 언어는 사전번역본/원문 토글, 그 외는 원문 + on-demand 번역.
  const tr = useItemTranslation([review.content], [review.originalContent], review.originalLanguage, prestored, viewerBucket, preferredCode);
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHead}>
        <StarRow value={review.rating} />
        <View style={styles.reviewHeadRight}>
          <Text style={styles.reviewDate}>{timeAgo(review.createdAt, t)}</Text>
          {(review.isMine || isAdmin) ? (
            <TouchableOpacity onPress={onDelete} hitSlop={8}>
              <Ionicons name="trash-outline" size={15} color={Colors.textTertiary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <Text style={styles.reviewContent}>{tr.displays[0]}</Text>
      <ItemToggle tr={tr} t={t} />
      {chips.length > 0 ? (
        <View style={styles.reviewChips}>
          {chips.map((c) => (
            <Text key={c.label} style={styles.reviewChip}>{c.label} · {c.value}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────

export default function LectureDetailScreen() {
  const t = useT();
  const router = useRouter();
  const { lectureId } = useLocalSearchParams<{ lectureId: string }>();
  const id = Number(lectureId);
  const viewerBucket = useLanguage();
  const preferredCode = useAuthStore((s) => s.profile?.preferredLanguage ?? 'en');
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  const prestored = isPrestoredMode(preferredCode);

  const [detail, setDetail] = useState<LectureDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 작성 폼 상태
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [attendance, setAttendance] = useState<string | null>(null);
  const [presentation, setPresentation] = useState<string | null>(null);
  const [groupWork, setGroupWork] = useState<string | null>(null);
  const [assignment, setAssignment] = useState<string | null>(null);
  const [korean, setKorean] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const attOpts: Opt[] = [
    { value: 'OFFLINE', label: t.crOffline },
    { value: 'ONLINE', label: t.crOnline },
    { value: 'BLENDED', label: t.crBlended },
  ];
  const freqOpts: Opt[] = [
    { value: 'LOW', label: t.crFreqLow },
    { value: 'MEDIUM', label: t.crFreqMedium },
    { value: 'HIGH', label: t.crFreqHigh },
  ];
  const attLabel = (v: string | null) => attOpts.find((o) => o.value === v)?.label ?? '';
  const freqLabel = (v: string | null) => freqOpts.find((o) => o.value === v)?.label ?? '';

  const load = useCallback(() => {
    setLoading(true);
    lectureApi.getLecture(id, viewerBucket)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [id, viewerBucket]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setRating(0); setContent('');
    setAttendance(null); setPresentation(null); setGroupWork(null);
    setAssignment(null); setKorean(null);
    setError('');
  };

  const submit = async () => {
    if (rating < 1) { setError(t.crRatingRequired); return; }
    if (!content.trim()) { setError(t.crContentRequired); return; }
    setSubmitting(true);
    try {
      await lectureApi.createReview(id, {
        rating,
        content: content.trim(),
        attendanceType: attendance as any,
        presentationFreq: presentation as any,
        groupWorkFreq: groupWork as any,
        assignmentFreq: assignment as any,
        koreanUsage: korean as any,
        language: viewerBucket,
      });
      resetForm();
      setWriting(false);
      load();
    } catch {
      setError(t.crSubmitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = (reviewId: number) => {
    confirmAction(t.crDelete, t.crDeleteConfirm, t.cancel, t.crDelete, () => {
      lectureApi.deleteReview(reviewId).then(load).catch(() => {});
    });
  };

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {detail?.name ?? t.crHeaderTitle}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: Spacing[10] }} color={Colors.primary} />
      ) : !detail ? (
        <Text style={styles.empty}>{t.crNoLectures}</Text>
      ) : (
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* 강의 정보 카드 */}
            <View style={styles.infoCard}>
              <Text style={styles.lectureName}>{detail.name}</Text>
              <Text style={styles.lectureMeta}>
                {detail.professor}{detail.code ? `  ·  ${detail.code}` : ''}
              </Text>
              <View style={styles.infoTags}>
                {detail.college ? <Text style={styles.tag}>{detail.college}</Text> : null}
                {detail.type ? <Text style={styles.tagMuted}>{detail.type}</Text> : null}
                {detail.credits != null ? <Text style={styles.tagMuted}>{detail.credits}학점</Text> : null}
                <Text style={styles.tagMuted}>{detail.semester}</Text>
              </View>
              <View style={styles.ratingSummary}>
                <Text style={styles.avgNumber}>{detail.reviewCount > 0 ? detail.avgRating.toFixed(1) : '-'}</Text>
                <View>
                  <StarRow value={detail.avgRating} size={16} />
                  <Text style={styles.reviewCountText}>{t.crReviewCountLabel(detail.reviewCount)}</Text>
                </View>
              </View>
            </View>

            {/* 지표 집계 */}
            {detail.reviewCount > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.crClassInfo}</Text>
                <DistRow label={t.crAttendance} counts={detail.indicators.attendance} opts={attOpts}
                  colors={[Colors.primary, Colors.accent, Colors.textTertiary]} t={t} />
                <DistRow label={t.crPresentation} counts={detail.indicators.presentation} opts={freqOpts}
                  colors={[Colors.success, Colors.accent, Colors.primary]} t={t} />
                <DistRow label={t.crGroupWork} counts={detail.indicators.groupWork} opts={freqOpts}
                  colors={[Colors.success, Colors.accent, Colors.primary]} t={t} />
                <DistRow label={t.crAssignment} counts={detail.indicators.assignment} opts={freqOpts}
                  colors={[Colors.success, Colors.accent, Colors.primary]} t={t} />
                <DistRow label={t.crKoreanUsage} counts={detail.indicators.koreanUsage} opts={freqOpts}
                  colors={[Colors.success, Colors.accent, Colors.primary]} t={t} />
              </View>
            ) : null}

            {/* 작성 버튼 / 폼 (관리자는 작성 불가 — 숨김) */}
            {isAdmin ? null : !writing ? (
              <TouchableOpacity style={styles.writeBtn} onPress={() => setWriting(true)} activeOpacity={0.85}>
                <Ionicons name="create-outline" size={16} color={Colors.textInverse} />
                <Text style={styles.writeBtnText}>{t.crWriteReview}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.form}>
                <Text style={styles.formLabel}>{t.crRatingLabel}</Text>
                <StarSelector value={rating} onChange={(n) => { setRating(n); setError(''); }} />

                <Text style={styles.formLabel}>{t.crContentLabel}</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder={t.crContentPlaceholder}
                  placeholderTextColor={Colors.textTertiary}
                  value={content}
                  onChangeText={(v) => { setContent(v); setError(''); }}
                  multiline
                />

                <Text style={styles.formSubLabel}>{t.crAttendance} <Text style={styles.optional}>({t.crOptional})</Text></Text>
                <ChipGroup options={attOpts} value={attendance} onSelect={setAttendance} />
                <Text style={styles.formSubLabel}>{t.crPresentation} <Text style={styles.optional}>({t.crOptional})</Text></Text>
                <ChipGroup options={freqOpts} value={presentation} onSelect={setPresentation} />
                <Text style={styles.formSubLabel}>{t.crGroupWork} <Text style={styles.optional}>({t.crOptional})</Text></Text>
                <ChipGroup options={freqOpts} value={groupWork} onSelect={setGroupWork} />
                <Text style={styles.formSubLabel}>{t.crAssignment} <Text style={styles.optional}>({t.crOptional})</Text></Text>
                <ChipGroup options={freqOpts} value={assignment} onSelect={setAssignment} />
                <Text style={styles.formSubLabel}>{t.crKoreanUsage} <Text style={styles.optional}>({t.crOptional})</Text></Text>
                <ChipGroup options={freqOpts} value={korean} onSelect={setKorean} />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => { resetForm(); setWriting(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelBtnText}>{t.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                    onPress={submit}
                    disabled={submitting}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.submitBtnText}>{t.crSubmit}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 강의평 목록 */}
            <Text style={[styles.sectionTitle, { marginTop: Spacing[6] }]}>{t.crReviewsTitle}</Text>
            {detail.reviews.length === 0 ? (
              <Text style={styles.noReviews}>{t.crNoReviews}</Text>
            ) : (
              detail.reviews.map((r) => {
                const chips: { label: string; value: string }[] = [];
                if (r.attendanceType) chips.push({ label: t.crAttendance, value: attLabel(r.attendanceType) });
                if (r.presentationFreq) chips.push({ label: t.crPresentation, value: freqLabel(r.presentationFreq) });
                if (r.groupWorkFreq) chips.push({ label: t.crGroupWork, value: freqLabel(r.groupWorkFreq) });
                if (r.assignmentFreq) chips.push({ label: t.crAssignment, value: freqLabel(r.assignmentFreq) });
                if (r.koreanUsage) chips.push({ label: t.crKoreanUsage, value: freqLabel(r.koreanUsage) });
                return <ReviewCard key={r.reviewId} review={r} chips={chips} prestored={prestored} viewerBucket={viewerBucket} preferredCode={preferredCode} t={t} onDelete={() => removeReview(r.reviewId)} />;
              })
            )}

            <View style={{ height: Spacing[10] }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[3],
    gap: Spacing[2],
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  empty: { textAlign: 'center', color: Colors.textTertiary, marginTop: Spacing[10] },
  scroll: { paddingHorizontal: Spacing[4], paddingBottom: Spacing[8] },

  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    ...Shadow.sm,
  },
  lectureName: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  lectureMeta: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: Spacing[1] },
  infoTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginTop: Spacing[3] },
  tag: {
    fontSize: Typography.xs, color: Colors.primary, backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing[2], paddingVertical: 2, borderRadius: Radius.sm, overflow: 'hidden',
  },
  tagMuted: { fontSize: Typography.xs, color: Colors.textTertiary, paddingVertical: 2 },
  ratingSummary: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[3],
    marginTop: Spacing[4], paddingTop: Spacing[4],
    borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  avgNumber: { fontSize: Typography['4xl'], fontWeight: Typography.extrabold, color: Colors.accentDark },
  reviewCountText: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 2 },

  section: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginTop: Spacing[3],
    ...Shadow.sm,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  distRow: { marginBottom: Spacing[3] },
  distLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary, marginBottom: Spacing[1] },
  distNoData: { fontSize: Typography.xs, color: Colors.textTertiary },
  distRight: {},
  distBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: Radius.full,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSecondary,
  },
  distLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3], marginTop: Spacing[1] },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: Typography.xs, color: Colors.textSecondary },

  writeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    marginTop: Spacing[4],
    ...Shadow.sm,
  },
  writeBtnText: { color: Colors.textInverse, fontSize: Typography.base, fontWeight: Typography.bold },

  form: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginTop: Spacing[4],
    ...Shadow.sm,
  },
  formLabel: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing[2], marginTop: Spacing[2] },
  formSubLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary, marginBottom: Spacing[2], marginTop: Spacing[3] },
  optional: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: Typography.regular },
  starSelect: { flexDirection: 'row', gap: Spacing[2], marginBottom: Spacing[2] },
  starTap: { padding: 2 },
  translateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing[2], alignSelf: 'flex-start' },
  translateBtnText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.semibold },
  textArea: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing[3],
    fontSize: Typography.base,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
    backgroundColor: Colors.background,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipText: { fontSize: Typography.sm, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary, fontWeight: Typography.semibold },
  errorText: { color: Colors.error, fontSize: Typography.sm, marginTop: Spacing[3] },
  formActions: { flexDirection: 'row', gap: Spacing[2], marginTop: Spacing[4] },
  cancelBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing[3], borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cancelBtnText: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textSecondary },
  submitBtn: {
    flex: 2, alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing[3], borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  submitBtnText: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse },

  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing[4],
    marginBottom: Spacing[2],
    ...Shadow.sm,
  },
  reviewHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewHeadRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  reviewDate: { fontSize: Typography.xs, color: Colors.textTertiary },
  reviewContent: { fontSize: Typography.base, color: Colors.textPrimary, lineHeight: Typography.base * Typography.normal, marginTop: Spacing[2] },
  reviewChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginTop: Spacing[3] },
  reviewChip: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  starRow: { flexDirection: 'row', gap: 1 },
  noReviews: { fontSize: Typography.sm, color: Colors.textTertiary, textAlign: 'center', marginVertical: Spacing[5] },
});
