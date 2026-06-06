import React, { useState, useCallback } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { KHU_GUIDE, GuideCategory, GuideTip, L10n } from '@/src/data/khuGuide';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { badgeApi } from '@/src/api/badge';
import type { BadgeId } from '@/src/types/badge';
import { useLanguage, useT, type Language } from '@/src/i18n';

/** L10n에서 현재 언어 선택 (없으면 EN→KO 폴백). */
const pick = (m: L10n, lang: Language): string => m[lang] ?? m.EN ?? m.KO;

// ─── 팁 카드 ──────────────────────────────────────────────────────

function TipCard({ tip, lang }: { tip: GuideTip; lang: Language }) {
  const t = useT();
  const title = pick(tip.title, lang);
  const content = pick(tip.content, lang);

  return (
    <View style={styles.tipCard}>
      <Text style={styles.tipIcon}>{tip.icon}</Text>
      <View style={styles.tipBody}>
        <Text style={styles.tipTitle}>{title}</Text>
        <Text style={styles.tipContent}>{content}</Text>
        {tip.link && (
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
        )}
      </View>
    </View>
  );
}

// ─── 카테고리 상세 ─────────────────────────────────────────────────

function CategoryDetailView({ category, lang }: { category: GuideCategory; lang: Language }) {
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
          <Text style={styles.detailTitle}>
            {pick(category.title, lang)}
          </Text>
          <Text style={styles.detailCount}>
            {category.tips.length}{t.guideItemsSuffix}
          </Text>
        </View>
      </View>

      {category.tips.map((tip, i) => (
        <TipCard key={i} tip={tip} lang={lang} />
      ))}

      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

// ─── 홈 (카테고리 그리드) ─────────────────────────────────────────

function HomeView({
  lang,
  onSelectCategory,
  onQuiz,
  earnedBadges,
}: {
  lang: Language;
  onSelectCategory: (id: string) => void;
  onQuiz: (categoryId: string) => void;
  earnedBadges: Set<BadgeId>;
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
      <View style={styles.grid}>
        {KHU_GUIDE.map((cat) => {
          const earned = earnedBadges.has(cat.id as BadgeId);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { borderTopColor: cat.color }]}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryTitle}>
                {pick(cat.title, lang)}
              </Text>
              {earned ? (
                <Text style={[styles.categoryCount, { color: cat.color }]}>{t.guideEarned}</Text>
              ) : (
                <TouchableOpacity
                  style={[styles.quizSmallBtn, { borderColor: cat.color }]}
                  onPress={(e) => { e.stopPropagation(); onQuiz(cat.id); }}
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

      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────────

export default function GuideScreen() {
  const lang = useLanguage();
  const t = useT();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<Set<BadgeId>>(new Set());
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      badgeApi.getMyBadges()
        .then((badges) => setEarnedBadges(new Set(badges.map((b) => b.badgeId as BadgeId))))
        .catch(() => {});
    }, [])
  );

  const selectedCategory = selectedCategoryId
    ? KHU_GUIDE.find((c) => c.id === selectedCategoryId) ?? null
    : null;

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
          {selectedCategory
            ? pick(selectedCategory.title, lang)
            : t.guideHeaderTitle}
        </Text>
      </View>

      {selectedCategory ? (
        <CategoryDetailView category={selectedCategory} lang={lang} />
      ) : (
        <HomeView
          lang={lang}
          onSelectCategory={setSelectedCategoryId}
          onQuiz={(categoryId) => router.push(`/(main)/quiz?category=${categoryId}`)}
          earnedBadges={earnedBadges}
        />
      )}
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
});
