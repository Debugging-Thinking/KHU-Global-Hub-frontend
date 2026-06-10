import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/src/components/layout/Screen";
import { chatApi } from "@/src/api/chat";
import { useAuthStore } from "@/src/store/authStore";
import { AdminMemberSearchView } from "@/src/components/admin/AdminMemberSearchView";
import apiClient, { unwrap } from "@/src/api/client";
import { useT, timeAgo } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import type { ConversationSummary } from "@/src/types/chat";

interface MatchHistory {
  matchId: number;
  semester: string;
  status: string;
  myRole: string;
  matchedAt: string;
  partner: {
    memberId: number;
    name: string;
    profileImageUrl: string | null;
  };
}

// 이번 학기 계산 (상반기: X-1, 하반기: X-2)
function currentSemester() {
  const now = new Date();
  const year = now.getFullYear();
  const half = now.getMonth() < 6 ? "1" : "2";
  return `${year}-${half}`;
}

function ConversationItem({
  item,
  onPress,
  t,
  badge,
}: {
  item: ConversationSummary;
  onPress: () => void;
  t: ReturnType<typeof useT>;
  badge?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.avatarWrap}>
        {item.partnerProfileImage ? (
          <Image source={{ uri: item.partnerProfileImage }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.partnerName[0]}</Text>
          </View>
        )}
        {badge && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{item.partnerName}</Text>
          <Text style={styles.time}>{timeAgo(item.lastMessageAt, t, true)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.lastMsg} numberOfLines={1}>
            {item.lastMessage || t.chatStartConvo}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unreadCount > 99 ? "99+" : item.unreadCount}
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
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  const { highlightPartnerId } = useLocalSearchParams<{ highlightPartnerId?: string }>();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    try {
      const [convData, historyData] = await Promise.all([
        chatApi.getConversations(),
        apiClient.get("/mentoring/me/history").then(unwrap<MatchHistory[]>).catch(() => []),
      ]);
      setConversations(convData ?? []);
      setMatchHistory(historyData ?? []);
    } catch {
      setConversations([]);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // 멘토링 파트너 ID 목록 (이번 학기 ACTIVE 우선, 나머지는 matchedAt 내림차순)
  const semester = currentSemester();
  const sortedMatches = [...matchHistory].sort((a, b) => {
    const aActive = a.status === "ACTIVE" && a.semester === semester ? 1 : 0;
    const bActive = b.status === "ACTIVE" && b.semester === semester ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime();
  });

  // 멘토링 파트너 ID Set (채팅 목록 정렬 기준)
  const mentoringPartnerIds = sortedMatches.map((m) => m.partner.memberId);

  // 채팅 목록 정렬: 멘토링 파트너 순서 우선, 나머지는 lastMessageAt 내림차순
  const sortedConversations = [...conversations].sort((a, b) => {
    const aIdx = mentoringPartnerIds.indexOf(a.partnerId);
    const bIdx = mentoringPartnerIds.indexOf(b.partnerId);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });

  // 멘토링 파트너가 채팅 목록에 없으면 가상 항목으로 추가
  const mentoringOnlyItems: ConversationSummary[] = sortedMatches
    .filter((m) => !conversations.find((c) => c.partnerId === m.partner.memberId))
    .map((m) => ({
      partnerId: m.partner.memberId,
      partnerName: m.partner.name,
      partnerProfileImage: m.partner.profileImageUrl,
      lastMessage: "",
      unreadCount: 0,
      lastMessageAt: m.matchedAt,
    }));

  const finalList = [
    ...mentoringOnlyItems,
    ...sortedConversations,
  ];

  // 파트너 역할 뱃지 계산
  const getRoleBadge = (partnerId: number) => {
    const match = matchHistory.find((m) => m.partner.memberId === partnerId);
    if (!match) return undefined;
    if (match.status === "ACTIVE" && match.semester === semester) {
      return match.myRole === "MENTOR" ? t.mentee : t.mentor;
    }
    return undefined;
  };

  // 관리자: DM 목록 대신 회원 검색 화면
  if (isAdmin) return <AdminMemberSearchView />;

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
          data={finalList}
          keyExtractor={(item) => String(item.partnerId)}
          renderItem={({ item, index }) => {
            const isCurrentMatch =
              index < mentoringOnlyItems.length ||
              mentoringPartnerIds.indexOf(item.partnerId) === 0;
            return (
              <>
                {/* 이번 학기 매칭 구분선 */}
                {index === 0 && mentoringPartnerIds.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <Ionicons name="people-outline" size={14} color={Colors.primary} />
                    <Text style={styles.sectionHeaderText}>{t.chatThisSemesterMentoring}</Text>
                  </View>
                )}
                {/* 일반 채팅 구분선 */}
                {index === mentoringOnlyItems.length && mentoringOnlyItems.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <Ionicons name="chatbubbles-outline" size={14} color={Colors.textTertiary} />
                    <Text style={[styles.sectionHeaderText, { color: Colors.textTertiary }]}>
                      {t.chatAllChats}
                    </Text>
                  </View>
                )}
                <ConversationItem
                  item={item}
                  t={t}
                  badge={getRoleBadge(item.partnerId)}
                  onPress={() => {
                    router.push(`/(main)/chat/${item.partnerId}`);
                  }}
                />
              </>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchData(true);
              }}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[3],
    backgroundColor: Colors.surface,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeaderText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.surface,
    gap: Spacing[3],
  },
  avatarWrap: { position: "relative" },
  avatarImg: { width: 50, height: 50, borderRadius: Radius.full },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  roleBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  roleBadgeText: {
    fontSize: 9,
    color: Colors.textInverse,
    fontWeight: Typography.bold,
  },
  content: { flex: 1, gap: 3 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  time: { fontSize: Typography.xs, color: Colors.textTertiary },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMsg: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: Spacing[2],
  },
  unreadText: {
    fontSize: 11,
    color: Colors.textInverse,
    fontWeight: Typography.bold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: 70 + Spacing[5],
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing[16],
    gap: Spacing[2],
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textTertiary,
    fontWeight: Typography.medium,
  },
});