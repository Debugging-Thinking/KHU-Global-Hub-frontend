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
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { BoardType, PostSummary } from '@/src/types/board';

const TABS: { value: BoardType; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { value: 'FRESHMAN', label: '신입생', icon: 'sparkles-outline' },
  { value: 'FREE', label: '자유', icon: 'chatbox-outline' },
  { value: 'GRADUATE', label: '졸업생', icon: 'school-outline' },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function PostCard({ post, onPress }: { post: PostSummary; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={styles.postCard}>
      <Text style={styles.postTitle} numberOfLines={2}>
        {post.title}
      </Text>
      <View style={styles.postMeta}>
        <Text style={styles.metaAuthor}>
          {post.isAnonymous ? '익명' : post.authorName ?? '알 수 없음'}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaTime}>{timeAgo(post.createdAt)}</Text>
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

export default function BoardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BoardType>('FREE');
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (tab: BoardType, pageNum: number, refresh = false) => {
    try {
      const res = await boardApi.getPosts(tab, 'KO', pageNum);
      if (refresh || pageNum === 0) {
        setPosts(res.content);
      } else {
        setPosts((prev) => [...prev, ...res.content]);
      }
      setHasMore(!res.last);
    } catch {}
  };

  useEffect(() => {
    setLoading(true);
    setPage(0);
    fetchPosts(activeTab, 0, true).finally(() => setLoading(false));
  }, [activeTab]);

  useFocusEffect(useCallback(() => {
    setPage(0);
    fetchPosts(activeTab, 0, true);
  }, [activeTab]));

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    await fetchPosts(activeTab, 0, true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchPosts(activeTab, next);
  };

  return (
    <Screen padded={false}>
      {/* 크림슨 헤더 배너 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.lionIcon}>
            <Ionicons name="newspaper-outline" size={18} color={Colors.textInverse} />
          </View>
          <Text style={styles.headerTitle}>게시판</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(main)/board/create')}
          style={styles.writeBtn}
        >
          <Ionicons name="pencil-outline" size={17} color={Colors.primary} />
          <Text style={styles.writeBtnText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* 탭 */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable
            key={t.value}
            onPress={() => setActiveTab(t.value)}
            style={[styles.tab, activeTab === t.value && styles.tabActive]}
          >
            <Ionicons
              name={t.icon}
              size={14}
              color={activeTab === t.value ? Colors.primary : Colors.textTertiary}
            />
            <Text style={[styles.tabText, activeTab === t.value && styles.tabTextActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 목록 */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.postId)}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => router.push(`/(main)/board/${item.postId}`)}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>아직 게시글이 없어요</Text>
              <Text style={styles.emptySubText}>첫 번째 글을 작성해보세요</Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}

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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
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
  tabActive: {
    borderBottomColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  list: {
    padding: Spacing[5],
    paddingBottom: Spacing[10],
  },
  postCard: {
    gap: Spacing[2],
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  postTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.normal,
  },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  metaAuthor: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  metaDot: { fontSize: Typography.xs, color: Colors.textTertiary },
  metaTime: { fontSize: Typography.xs, color: Colors.textTertiary },
  postStats: { flexDirection: 'row', gap: Spacing[3] },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statText: { fontSize: Typography.xs, color: Colors.textTertiary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing[16],
    gap: Spacing[2],
  },
  emptyText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  emptySubText: { fontSize: Typography.sm, color: Colors.textTertiary },
});
