import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { boardApi } from '@/src/api/board';
import { qnaApi } from '@/src/api/qna';
import { translateApi } from '@/src/api/translate';
import { useAuthStore } from '@/src/store/authStore';
import { useT, timeAgo } from '@/src/i18n';
import { isPrestoredMode } from '@/src/i18n/preferredLanguage';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { PostSummary } from '@/src/types/board';
import type { QnASummary } from '@/src/types/qna';

type CommunityTab = 'BOARD' | 'QNA';

function CommunityScreen() {
  const router = useRouter();
  const t = useT();
  const language = useAuthStore((s) => s.profile?.language ?? 'KO');
  const preferredCode = useAuthStore((s) => s.profile?.preferredLanguage ?? 'en');
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  // 6개 외 언어 사용자: 피드는 원문(original=true) 표시 (번역은 상세에서 탭).
  const prestored = isPrestoredMode(preferredCode);

  const TABS: { value: CommunityTab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
    { value: 'BOARD', label: t.boardFree, icon: 'chatbox-outline' },
    { value: 'QNA', label: t.tabQna, icon: 'help-circle-outline' },
  ];

  const [activeTab, setActiveTab] = useState<CommunityTab>('BOARD');
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [qnas, setQnas] = useState<QnASummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // non-6 사용자: 피드 제목을 한 번에 배치 번역해 표시 (key: 'p'+postId / 'q'+qnaId)
  const [tTitles, setTTitles] = useState<Record<string, string>>({});

  const fetchPosts = async (pageNum: number, refresh = false) => {
    try {
      const res = await boardApi.getPosts(language as any, pageNum, 20, !prestored);
      if (refresh || pageNum === 0) setPosts(res.content);
      else setPosts((prev) => [...prev, ...res.content]);
      setHasMore(!res.last);
    } catch {}
  };

  const fetchQnas = async () => {
    try {
      const res = await qnaApi.getQnas(language as any, 0, 20, !prestored);
      setQnas(res.content);
    } catch {}
  };

  const loadActive = useCallback(async (refresh = false) => {
    if (activeTab === 'BOARD') {
      setPage(0);
      await fetchPosts(0, refresh);
    } else {
      await fetchQnas();
    }
  }, [activeTab, language, prestored]);

  useEffect(() => {
    setLoading(true);
    loadActive(true).finally(() => setLoading(false));
  }, [activeTab, language, prestored]);

  useFocusEffect(useCallback(() => { loadActive(true); }, [activeTab, language, prestored]));

  // non-6 사용자: 현재 탭 목록의 제목을 한 번의 호출로 번역(이미 번역된 항목은 건너뜀).
  useEffect(() => {
    if (prestored) return;
    const items = activeTab === 'BOARD'
      ? posts.map((p) => ({ key: 'p' + p.postId, title: p.title }))
      : qnas.map((q) => ({ key: 'q' + q.qnaId, title: q.title }));
    const missing = items.filter((it) => it.title?.trim() && !(it.key in tTitles));
    if (missing.length === 0) return;
    let cancelled = false;
    translateApi.translate(missing.map((m) => m.title), preferredCode)
      .then((res) => {
        if (cancelled) return;
        setTTitles((prev) => {
          const next = { ...prev };
          missing.forEach((m, i) => { next[m.key] = res.translations[i] ?? m.title; });
          return next;
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [posts, qnas, activeTab, prestored, preferredCode, tTitles]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActive(true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (activeTab !== 'BOARD' || !hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchPosts(next);
  };

  const goCreate = () =>
    router.push(activeTab === 'BOARD' ? '/(main)/board/create' : '/(main)/qna/create');

  return (
    <Screen padded={false}>
      {/* 크림슨 헤더 배너 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.lionIcon}>
            <Ionicons
              name={activeTab === 'BOARD' ? 'newspaper-outline' : 'help-circle-outline'}
              size={18}
              color={Colors.textInverse}
            />
          </View>
          <Text style={styles.headerTitle}>{activeTab === 'BOARD' ? t.board : 'Q&A'}</Text>
        </View>
        {!isAdmin && (
          <TouchableOpacity onPress={goCreate} style={styles.writeBtn}>
            <Ionicons name="pencil-outline" size={17} color={Colors.primary} />
            <Text style={styles.writeBtnText}>{t.writePost}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 자유게시판 | QnA 탭 */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            style={[styles.tab, activeTab === tab.value && styles.tabActive]}
          >
            <Ionicons
              name={tab.icon}
              size={14}
              color={activeTab === tab.value ? Colors.primary : Colors.textTertiary}
            />
            <Text style={[styles.tabText, activeTab === tab.value && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 목록 */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : activeTab === 'BOARD' ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.postId)}
          renderItem={({ item }) => (
            <PostCard post={item} onPress={() => router.push(`/(main)/board/${item.postId}`)} t={t} displayTitle={prestored ? undefined : tTitles['p' + item.postId]} />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>{t.noPostsYet}</Text>
              <Text style={styles.emptySubText}>{t.createFirstPost}</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={qnas}
          keyExtractor={(item) => String(item.qnaId)}
          renderItem={({ item }) => (
            <QnACard item={item} onPress={() => router.push(`/(main)/qna/${item.qnaId}`)} t={t} displayTitle={prestored ? undefined : tTitles['q' + item.qnaId]} />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="help-circle-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>{t.noQuestionsYet}</Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}

function PostCard({ post, onPress, t, displayTitle }: { post: PostSummary; onPress: () => void; t: ReturnType<typeof useT>; displayTitle?: string }) {
  return (
    <Card onPress={onPress} style={styles.postCard}>
      <Text style={styles.postTitle} numberOfLines={2}>{displayTitle ?? post.title}</Text>
      <View style={styles.postMeta}>
        <Text style={styles.metaAuthor}>
          {post.isAnonymous ? t.anonymous : post.authorName ?? t.unknown}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaTime}>{timeAgo(post.createdAt, t)}</Text>
      </View>
      <View style={styles.postStats}>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={13} color={Colors.primary} />
          <Text style={styles.statText}>{post.likeCount}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={13} color={Colors.textTertiary} />
          <Text style={styles.statText}>{post.commentCount}</Text>
        </View>
      </View>
    </Card>
  );
}

function QnACard({ item, onPress, t, displayTitle }: { item: QnASummary; onPress: () => void; t: ReturnType<typeof useT>; displayTitle?: string }) {
  return (
    <Card onPress={onPress} style={styles.postCard}>
      <View style={styles.qnaTop}>
        <Text style={[styles.postTitle, { flex: 1 }]} numberOfLines={2}>{displayTitle ?? item.title}</Text>
        {item.isAdopted && (
          <View style={styles.adoptedBadge}>
            <Ionicons name="checkmark" size={11} color={Colors.success} />
            <Text style={styles.adoptedText}>{t.adopted}</Text>
          </View>
        )}
      </View>
      <View style={styles.postMeta}>
        <Text style={styles.metaAuthor}>{item.authorName}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaTime}>{timeAgo(item.createdAt, t)}</Text>
      </View>
      <View style={styles.postStats}>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={13} color={Colors.primary} />
          <Text style={styles.statText}>{item.likeCount}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={13} color={Colors.textTertiary} />
          <Text style={styles.statText}>{t.answerCount(item.answerCount)}</Text>
        </View>
      </View>
    </Card>
  );
}

export default CommunityScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[4],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  lionIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  writeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  writeBtnText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.surface,
    gap: Spacing[1],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary, backgroundColor: Colors.primaryLight },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textTertiary,
  },
  tabTextActive: { color: Colors.primary, fontWeight: Typography.bold },
  list: { padding: Spacing[5], paddingBottom: Spacing[10] },
  postCard: { gap: Spacing[2], borderLeftWidth: 3, borderLeftColor: 'transparent' },
  postTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.normal,
  },
  qnaTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[2] },
  adoptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: Colors.successLight,
  },
  adoptedText: { fontSize: Typography.xs, color: Colors.success, fontWeight: Typography.semibold },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  metaAuthor: { fontSize: Typography.xs, color: Colors.textSecondary, fontWeight: Typography.medium },
  metaDot: { fontSize: Typography.xs, color: Colors.textTertiary },
  metaTime: { fontSize: Typography.xs, color: Colors.textTertiary },
  postStats: { flexDirection: 'row', gap: Spacing[3] },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statText: { fontSize: Typography.xs, color: Colors.textTertiary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: Spacing[16], gap: Spacing[2] },
  emptyText: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textSecondary },
  emptySubText: { fontSize: Typography.sm, color: Colors.textTertiary },
});
