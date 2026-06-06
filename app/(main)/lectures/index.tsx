import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { lectureApi } from '@/src/api/lecture';
import { useT } from '@/src/i18n';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { LectureSummary } from '@/src/types/lecture';

const SEMESTER = '2026-1';

function LectureCard({ item, onPress }: { item: LectureSummary; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTop}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        {item.reviewCount > 0 ? (
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color={Colors.accent} />
            <Text style={styles.ratingPillText}>{item.avgRating.toFixed(1)}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.cardMeta} numberOfLines={1}>
        {item.professor}{item.code ? `  ·  ${item.code}` : ''}
      </Text>
      <View style={styles.cardBottom}>
        <View style={styles.tagRow}>
          {item.college ? <Text style={styles.tag}>{item.college}</Text> : null}
          {item.credits != null ? <Text style={styles.tagMuted}>{item.credits}학점</Text> : null}
        </View>
        <Text style={styles.reviewCount}>
          {item.reviewCount > 0 ? `리뷰 ${item.reviewCount}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function LecturesScreen() {
  const t = useT();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [lectures, setLectures] = useState<LectureSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback((q: string) => {
    setLoading(true);
    lectureApi
      .getLectures(q, SEMESTER)
      .then((page) => setLectures(page.content))
      .catch(() => setLectures([]))
      .finally(() => setLoading(false));
  }, []);

  // 화면 진입 시 최초 로드 (작성 후 돌아오면 리뷰 수 갱신)
  useFocusEffect(
    useCallback(() => {
      load(query);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load])
  );

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="school" size={15} color={Colors.textInverse} />
        </View>
        <Text style={styles.headerTitle}>{t.crHeaderTitle}</Text>
        <Text style={styles.semesterBadge}>{SEMESTER}</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder={t.crSearchPlaceholder}
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => load(query)}
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => { setQuery(''); load(''); }}>
            <Ionicons name="close-circle" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: Spacing[8] }} color={Colors.primary} />
      ) : (
        <FlatList
          data={lectures}
          keyExtractor={(l) => String(l.lectureId)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <LectureCard
              item={item}
              onPress={() => router.push({ pathname: '/(main)/lectures/[lectureId]', params: { lectureId: item.lectureId } })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>{t.crNoLectures}</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[3],
    gap: Spacing[3],
  },
  headerIcon: {
    width: 28, height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  semesterBadge: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    paddingHorizontal: Spacing[3],
    height: 42,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  listContent: { paddingHorizontal: Spacing[4], paddingBottom: Spacing[8] },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    ...Shadow.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[2],
  },
  cardName: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  ratingPillText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.accentDark,
  },
  cardMeta: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[3],
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], flex: 1 },
  tag: {
    fontSize: Typography.xs,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  tagMuted: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  reviewCount: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.medium,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textTertiary,
    fontSize: Typography.sm,
    marginTop: Spacing[10],
  },
});
