import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { chatApi } from '@/src/api/chat';
import { useT, timeAgo } from '@/src/i18n';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { ConversationSummary } from '@/src/types/chat';

function ConversationItem({ item, onPress, t }: { item: ConversationSummary; onPress: () => void; t: ReturnType<typeof useT> }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.avatar}>
        {item.partnerProfileImage ? (
          <Image source={{ uri: item.partnerProfileImage }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.partnerName[0]}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{item.partnerName}</Text>
          <Text style={styles.time}>{timeAgo(item.lastMessageAt, t, true)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChatListScreen() {
  const router = useRouter();
  const t = useT();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (refresh = false) => {
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch {} finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="chatbubbles-outline" size={18} color={Colors.textInverse} />
          </View>
          <Text style={styles.headerTitle}>{t.chat}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.partnerId)}
          renderItem={({ item }) => (
            <ConversationItem
              item={item}
              t={t}
              onPress={() => router.push(`/(main)/chat/${item.partnerId}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchData(true); }}
              tintColor={Colors.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>{t.noChatYet}</Text>
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
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.surface,
    gap: Spacing[3],
  },
  avatar: { position: 'relative' },
  avatarImg: { width: 50, height: 50, borderRadius: Radius.full },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  content: { flex: 1, gap: 3 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  time: { fontSize: Typography.xs, color: Colors.textTertiary },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lastMsg: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: Spacing[2],
  },
  badgeText: { fontSize: 11, color: Colors.textInverse, fontWeight: Typography.bold },
  divider: { height: 1, backgroundColor: Colors.divider, marginLeft: 70 + Spacing[5] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: Spacing[16], gap: Spacing[2] },
  emptyText: { fontSize: Typography.base, color: Colors.textTertiary, fontWeight: Typography.medium },
});
