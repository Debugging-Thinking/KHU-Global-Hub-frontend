import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
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

import { Screen } from '@/src/components/layout/Screen';
import { guideApi } from '@/src/api/guide';
import { adminGuideApi, type AdminTipBody } from '@/src/api/adminGuide';
import type { GuideCategory, GuideTip } from '@/src/types/guide';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { badgeApi } from '@/src/api/badge';
import type { BadgeId } from '@/src/types/badge';
import { useAuthStore } from '@/src/store/authStore';
import { useLanguage, useT } from '@/src/i18n';

// 색상 팔레트 — 현재 5개 카테고리 색(크림슨/그린/오렌지/블루/퍼플) + 노션식 추가색. 카테고리 색상 선택용.
const COLOR_PALETTE = [
  '#C41230', // 크림슨 (현재)
  '#1A6B3C', // 그린 (현재)
  '#E8650A', // 오렌지 (현재)
  '#1565C0', // 블루 (현재)
  '#6A1B9A', // 퍼플 (현재)
  '#0D9488', // 틸
  '#D97706', // 앰버/골드
  '#BE185D', // 핑크
  '#976D57', // 브라운
  '#4B5563', // 슬레이트
] as const;

// 웹(window.confirm)/네이티브(Alert) 호환 삭제 확인 헬퍼.
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

// 편집 상태 타입 (관리자 전용)
type CategoryEditState = {
  id: number;
  badgeKey: string;
  sortOrder: number;
  title: string;
  emoji: string;
  color: string;
};
type TipEditState = {
  mode: 'create' | 'edit';
  tipId?: number;
  categoryId: number;
  icon: string;
  title: string;
  content: string;
  link: string;
  sortOrder: number;
};

// ─── 팁 카드 ──────────────────────────────────────────────────────

function TipCard({
  tip,
  admin,
}: {
  tip: GuideTip;
  admin?: { onEdit: () => void; onDelete: () => void };
}) {
  const t = useT();
  return (
    <View style={styles.tipCard}>
      <Text style={styles.tipIcon}>{tip.icon}</Text>
      <View style={styles.tipBody}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipContent}>{tip.content}</Text>
        {tip.link ? (
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => Linking.openURL(tip.link!)}
            activeOpacity={0.7}
          >
            <Ionicons name="map-outline" size={13} color={Colors.primary} />
            <Text style={styles.mapBtnText}>
              {t.guideViewMap}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {admin ? (
        <View style={styles.tipAdminCol}>
          <TouchableOpacity style={styles.iconBtn} onPress={admin.onEdit} hitSlop={6} activeOpacity={0.7}>
            <Ionicons name="pencil" size={15} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={admin.onDelete} hitSlop={6} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={15} color={Colors.error} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

// ─── 카테고리 상세 ─────────────────────────────────────────────────

function CategoryDetailView({
  category,
  isAdmin,
  onEditTip,
  onDeleteTip,
  onAddTip,
}: {
  category: GuideCategory;
  isAdmin?: boolean;
  onEditTip: (tip: GuideTip, category: GuideCategory) => void;
  onDeleteTip: (tip: GuideTip) => void;
  onAddTip: (category: GuideCategory) => void;
}) {
  const t = useT();
  return (
    <ScrollView
      style={styles.detailScroll}
      contentContainerStyle={styles.detailContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.detailHeader, { borderLeftColor: category.color }]}>
        <Text style={styles.detailEmoji}>{category.emoji}</Text>
        <View>
          <Text style={styles.detailTitle}>{category.title}</Text>
          <Text style={styles.detailCount}>
            {category.tips.length}{t.guideItemsSuffix}
          </Text>
        </View>
      </View>

      {category.tips.map((tip) => (
        <TipCard
          key={tip.id}
          tip={tip}
          admin={
            isAdmin
              ? { onEdit: () => onEditTip(tip, category), onDelete: () => onDeleteTip(tip) }
              : undefined
          }
        />
      ))}

      {isAdmin ? (
        <TouchableOpacity
          style={styles.addTipCard}
          onPress={() => onAddTip(category)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={18} color={Colors.primary} />
          <Text style={styles.addTipText}>팁 추가</Text>
        </TouchableOpacity>
      ) : null}

      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

// ─── 홈 (카테고리 그리드) ─────────────────────────────────────────

function HomeView({
  categories,
  loading,
  onSelectCategory,
  onQuiz,
  earnedBadges,
  isAdmin,
  onEditCategory,
}: {
  categories: GuideCategory[];
  loading: boolean;
  onSelectCategory: (id: number) => void;
  onQuiz: (badgeKey: string) => void;
  earnedBadges: Set<BadgeId>;
  isAdmin?: boolean;
  onEditCategory: (category: GuideCategory) => void;
}) {
  const t = useT();
  return (
    <ScrollView
      style={styles.homeScroll}
      contentContainerStyle={styles.homeContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 히어로 배너 */}
      <View style={styles.heroBanner}>
        <View style={styles.heroAccent} />
        <Text style={styles.heroEmoji}>🏫</Text>
        <Text style={styles.heroTitle}>{t.guideHeroTitle}</Text>
        <Text style={styles.heroDesc}>{t.guideHeroDesc}</Text>
      </View>

      {/* 카테고리 그리드 */}
      <Text style={styles.sectionLabel}>{t.guideCategoriesLabel}</Text>
      {loading && categories.length === 0 ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing[6] }} />
      ) : (
        <View style={styles.grid}>
          {categories.map((cat) => {
            const earned = earnedBadges.has(cat.badgeKey as BadgeId);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, { borderTopColor: cat.color }]}
                onPress={() => onSelectCategory(cat.id)}
                activeOpacity={0.8}
              >
                {isAdmin ? (
                  <TouchableOpacity
                    style={styles.cardEditBtn}
                    onPress={(e) => { e.stopPropagation(); onEditCategory(cat); }}
                    hitSlop={8}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="pencil" size={13} color={Colors.textSecondary} />
                  </TouchableOpacity>
                ) : null}
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
                {earned ? (
                  <Text style={[styles.categoryCount, { color: cat.color }]}>{t.guideEarned}</Text>
                ) : (
                  <TouchableOpacity
                    style={[styles.quizSmallBtn, { borderColor: cat.color }]}
                    onPress={(e) => { e.stopPropagation(); onQuiz(cat.badgeKey); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.quizSmallBtnText, { color: cat.color }]}>
                      {t.guideQuizBtn}
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

// ─── 카테고리 수정 폼 모달 (관리자) ──────────────────────────────
// 매번 새로 마운트되므로(부모가 editState 있을 때만 렌더) useState 초기값으로 KO 원문 시드.

function CategoryEditModal({
  initial,
  onClose,
  onSave,
}: {
  initial: { title: string; emoji: string; color: string };
  onClose: () => void;
  onSave: (v: { title: string; emoji: string; color: string }) => Promise<void>;
}) {
  const t = useT();
  const [title, setTitle] = useState(initial.title);
  const [emoji, setEmoji] = useState(initial.emoji);
  const [color, setColor] = useState(initial.color);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave({ title: title.trim(), emoji: emoji.trim(), color });
    } catch {
      // 실패 시 모달 유지 (부모가 성공 시에만 닫음)
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
            <Text style={styles.modalTitle}>카테고리 수정</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.formBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.formLabel}>이모지</Text>
            <TextInput
              style={styles.input}
              value={emoji}
              onChangeText={setEmoji}
              maxLength={2}
              placeholder="📚"
              placeholderTextColor={Colors.textTertiary}
            />

            <Text style={styles.formLabel}>색상</Text>
            <View style={styles.palette}>
              {COLOR_PALETTE.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.swatch, { backgroundColor: c }, color === c && styles.swatchSelected]}
                  onPress={() => setColor(c)}
                  activeOpacity={0.8}
                >
                  {color === c ? <Ionicons name="checkmark" size={16} color={Colors.textInverse} /> : null}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>제목</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="카테고리 제목"
              placeholderTextColor={Colors.textTertiary}
            />

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
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── 팁 추가/수정 폼 모달 (관리자) ───────────────────────────────

function TipEditModal({
  initial,
  onClose,
  onSave,
}: {
  initial: { mode: 'create' | 'edit'; icon: string; title: string; content: string; link: string };
  onClose: () => void;
  onSave: (v: { icon: string; title: string; content: string; link: string }) => Promise<void>;
}) {
  const t = useT();
  const [icon, setIcon] = useState(initial.icon);
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [link, setLink] = useState(initial.link);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave({ icon: icon.trim(), title: title.trim(), content: content.trim(), link: link.trim() });
    } catch {
      // 실패 시 모달 유지
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
            <Text style={styles.modalTitle}>{initial.mode === 'create' ? '팁 추가' : '팁 수정'}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.formBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.formLabel}>아이콘 (이모지)</Text>
            <TextInput
              style={styles.input}
              value={icon}
              onChangeText={setIcon}
              maxLength={2}
              placeholder="📍"
              placeholderTextColor={Colors.textTertiary}
            />

            <Text style={styles.formLabel}>제목</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="팁 제목"
              placeholderTextColor={Colors.textTertiary}
            />

            <Text style={styles.formLabel}>내용</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={content}
              onChangeText={setContent}
              placeholder="팁 내용"
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Text style={styles.formLabel}>링크 (선택)</Text>
            <TextInput
              style={styles.input}
              value={link}
              onChangeText={setLink}
              placeholder="https://…"
              placeholderTextColor={Colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
            />

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
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────────

export default function GuideScreen() {
  const lang = useLanguage();
  const t = useT();
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<Set<BadgeId>>(new Set());
  // 관리자 편집 상태 (없으면 모달 미렌더 → 일반 사용자 화면 100% 동일)
  const [categoryEdit, setCategoryEdit] = useState<CategoryEditState | null>(null);
  const [tipEdit, setTipEdit] = useState<TipEditState | null>(null);
  const [prepLoading, setPrepLoading] = useState(false);
  const router = useRouter();

  // 화면 진입 + 언어 변경 시 가이드/뱃지 재조회 (백엔드 = 단일 소스).
  useFocusEffect(
    useCallback(() => {
      badgeApi.getMyBadges()
        .then((badges) => setEarnedBadges(new Set(badges.map((b) => b.badgeId as BadgeId))))
        .catch(() => {});

      setLoading(true);
      guideApi.getGuide(lang)
        .then(setCategories)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [lang])
  );

  const selectedCategory = selectedCategoryId != null
    ? categories.find((c) => c.id === selectedCategoryId) ?? null
    : null;

  // 저장/삭제 후 현재 언어로 재조회 (선택 카테고리는 id로 유지 → 자동 갱신).
  const reload = useCallback(
    () => guideApi.getGuide(lang).then(setCategories).catch(() => {}),
    [lang],
  );

  // 편집 모달 초기값은 KO 원문이어야 정확(저장이 language:'KO'). 현재 언어가 KO가 아니면 KO 가이드를 한 번 더 받아 원문 시드.
  const openCategoryEdit = useCallback(async (cat: GuideCategory) => {
    if (prepLoading) return;
    let seed = cat;
    if (lang !== 'KO') {
      setPrepLoading(true);
      try {
        const ko = await guideApi.getGuide('KO');
        const m = ko.find((c) => c.id === cat.id);
        if (m) seed = m;
      } catch {
        // 실패 시 현재 언어값으로 폴백
      } finally {
        setPrepLoading(false);
      }
    }
    const idx = categories.findIndex((c) => c.id === cat.id);
    setCategoryEdit({
      id: cat.id,
      badgeKey: cat.badgeKey,            // 메타 — 언어 무관, 폼 미노출
      sortOrder: idx >= 0 ? idx : 0,     // 표시 순서 = 기존 정렬값 프록시
      title: seed.title,
      emoji: seed.emoji,                 // 메타 — 언어 무관
      color: seed.color,
    });
  }, [lang, categories, prepLoading]);

  const openTipEdit = useCallback(async (tip: GuideTip, cat: GuideCategory) => {
    if (prepLoading) return;
    let seed = tip;
    if (lang !== 'KO') {
      setPrepLoading(true);
      try {
        const ko = await guideApi.getGuide('KO');
        const koTip = ko.find((c) => c.id === cat.id)?.tips.find((tp) => tp.id === tip.id);
        if (koTip) seed = koTip;
      } catch {
        // 폴백
      } finally {
        setPrepLoading(false);
      }
    }
    const idx = cat.tips.findIndex((tp) => tp.id === tip.id);
    setTipEdit({
      mode: 'edit',
      tipId: tip.id,
      categoryId: cat.id,
      icon: seed.icon,
      title: seed.title,
      content: seed.content,
      link: seed.link ?? '',
      sortOrder: idx >= 0 ? idx : 0,
    });
  }, [lang, prepLoading]);

  const openTipCreate = useCallback((cat: GuideCategory) => {
    setTipEdit({
      mode: 'create',
      categoryId: cat.id,
      icon: '',
      title: '',
      content: '',
      link: '',
      sortOrder: cat.tips.length,
    });
  }, []);

  const handleDeleteTip = useCallback((tip: GuideTip) => {
    confirmAction('팁 삭제', '이 팁을 삭제할까요?', t.cancel, t.delete, async () => {
      try {
        await adminGuideApi.deleteTip(tip.id);
        await reload();
      } catch {
        // 무시 (실패 시 화면 변화 없음)
      }
    });
  }, [t, reload]);

  return (
    <Screen>
      {/* 헤더 */}
      <View style={styles.header}>
        {selectedCategory ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setSelectedCategoryId(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerIcon}>
            <Ionicons name="book" size={15} color={Colors.textInverse} />
          </View>
        )}

        <Text style={styles.headerTitle} numberOfLines={1}>
          {selectedCategory ? selectedCategory.title : t.guideHeaderTitle}
        </Text>
      </View>

      {selectedCategory ? (
        <CategoryDetailView
          category={selectedCategory}
          isAdmin={isAdmin}
          onEditTip={openTipEdit}
          onDeleteTip={handleDeleteTip}
          onAddTip={openTipCreate}
        />
      ) : (
        <HomeView
          categories={categories}
          loading={loading}
          onSelectCategory={setSelectedCategoryId}
          onQuiz={(badgeKey) => router.push(`/(main)/quiz?category=${badgeKey}`)}
          earnedBadges={earnedBadges}
          isAdmin={isAdmin}
          onEditCategory={openCategoryEdit}
        />
      )}

      {/* KO 원문 로딩 오버레이 (편집 진입 시 잠깐) */}
      {prepLoading ? (
        <View style={styles.prepOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : null}

      {/* 카테고리 수정 모달 (관리자 · editState 있을 때만 마운트) */}
      {categoryEdit ? (
        <CategoryEditModal
          initial={{ title: categoryEdit.title, emoji: categoryEdit.emoji, color: categoryEdit.color }}
          onClose={() => setCategoryEdit(null)}
          onSave={async (v) => {
            await adminGuideApi.updateCategory(categoryEdit.id, {
              badgeKey: categoryEdit.badgeKey,
              emoji: v.emoji,
              color: v.color,
              sortOrder: categoryEdit.sortOrder,
              title: v.title,
              language: 'KO',
            });
            setCategoryEdit(null);
            await reload();
          }}
        />
      ) : null}

      {/* 팁 추가/수정 모달 (관리자 · editState 있을 때만 마운트) */}
      {tipEdit ? (
        <TipEditModal
          initial={{
            mode: tipEdit.mode,
            icon: tipEdit.icon,
            title: tipEdit.title,
            content: tipEdit.content,
            link: tipEdit.link,
          }}
          onClose={() => setTipEdit(null)}
          onSave={async (v) => {
            const body: AdminTipBody = {
              categoryId: tipEdit.categoryId,
              icon: v.icon,
              link: v.link ? v.link : null,
              sortOrder: tipEdit.sortOrder,
              title: v.title,
              content: v.content,
              language: 'KO',
            };
            if (tipEdit.mode === 'create') await adminGuideApi.createTip(body);
            else await adminGuideApi.updateTip(tipEdit.tipId!, body);
            setTipEdit(null);
            await reload();
          }}
        />
      ) : null}
    </Screen>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[4],
    gap: Spacing[3],
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  langToggle: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  langToggleText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },

  // 홈
  homeScroll: { flex: 1 },
  homeContent: { paddingHorizontal: Spacing[4] },
  heroBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing[6],
    alignItems: 'center',
    marginBottom: Spacing[5],
    overflow: 'hidden',
    ...Shadow.md,
  },
  heroAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 5,
    backgroundColor: Colors.primary,
  },
  heroEmoji: { fontSize: 44, marginBottom: Spacing[2] },
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
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textTertiary,
    marginBottom: Spacing[3],
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  categoryCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderTopWidth: 4,
    gap: Spacing[1],
    ...Shadow.sm,
  },
  categoryEmoji: { fontSize: 26, marginBottom: Spacing[1] },
  categoryTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  categoryCount: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  quizSmallBtn: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: Spacing[1],
  },
  quizSmallBtnText: { fontSize: Typography.xs, fontWeight: Typography.semibold },

  // 카테고리 상세
  detailScroll: { flex: 1 },
  detailContent: { paddingHorizontal: Spacing[4] },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing[4],
    borderLeftWidth: 4,
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  detailEmoji: { fontSize: 32 },
  detailTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  detailCount: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },

  // 팁 카드
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing[4],
    gap: Spacing[3],
    marginBottom: Spacing[2],
    ...Shadow.sm,
  },
  tipIcon: { fontSize: 20, marginTop: 2 },
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
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing[2],
    alignSelf: 'flex-start',
  },
  mapBtnText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },

  // ── 관리자 편집 UI ──────────────────────────────────────────
  // 카테고리 카드 우상단 ✏️ 버튼
  cardEditBtn: {
    position: 'absolute',
    top: Spacing[2],
    right: Spacing[2],
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  // 팁 카드 우측 액션 컬럼 (✏️/🗑)
  tipAdminCol: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing[2],
    marginLeft: Spacing[1],
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 팁 추가 점선 카드
  addTipCard: {
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
    marginBottom: Spacing[2],
  },
  addTipText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },

  // ── 폼 모달 ─────────────────────────────────────────────────
  prepOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '85%',
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
  formBody: {
    padding: Spacing[5],
    gap: Spacing[2],
  },
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
  inputMultiline: {
    minHeight: 110,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginTop: Spacing[1],
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
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
