import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { qnaApi } from '@/src/api/qna';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { QnASummary } from '@/src/types/qna';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function QnACard({ item, onPress }: { item: QnASummary; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.isAdopted && (
          <View style={styles.adoptedBadge}>
            <Ionicons name="checkmark" size={11} color={Colors.success} />
            <Text style={styles.adoptedText}>채택</Text>
          </View>
        )}
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{item.authorName}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{timeAgo(item.createdAt)}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={12} color={Colors.textTertiary} />
          <Text style={styles.statText}>{item.likeCount}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={12} color={Colors.textTertiary} />
          <Text style={styles.statText}>답변 {item.answerCount}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function QnAScreen() {
  const router = useRouter();
  const [items, setItems] = useState<QnASummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (refresh = false) => {
    try {
      const res = await qnaApi.getQnas();
      setItems(res.content);
    } catch {} finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>Q</Text>
          </View>
          <Text style={styles.headerTitle}>Q&A</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(main)/qna/create')}
          style={styles.writeBtn}
        >
          <Ionicons name="add" size={22} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.qnaId)}
          renderItem={({ item }) => (
            <QnACard item={item} onPress={() => router.push(`/(main)/qna/${item.qnaId}`)} />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchData(true); }}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="help-circle-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>아직 질문이 없어요</Text>
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
    paddingBottom: Spacing[3],
    backgroundColor: Colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  writeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  list: { padding: Spacing[5], paddingBottom: Spacing[10] },
  card: { gap: Spacing[2] },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[2] },
  title: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.normal,
  },
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
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  metaText: { fontSize: Typography.xs, color: Colors.textTertiary },
  metaDot: { fontSize: Typography.xs, color: Colors.textTertiary },
  stats: { flexDirection: 'row', gap: Spacing[3] },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statText: { fontSize: Typography.xs, color: Colors.textTertiary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: Spacing[16], gap: Spacing[3] },
  emptyText: { fontSize: Typography.base, color: Colors.textTertiary },
});
