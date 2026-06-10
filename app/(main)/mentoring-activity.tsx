import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/src/components/layout/Screen";
import apiClient, { unwrap } from "@/src/api/client";
import { useT } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";

interface ActivityItem {
  id: number;
  matchId: number;
  authorId: number;
  title: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
}

type SortOrder = "asc" | "desc";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function MentoringActivityScreen() {
  const { matchId, partnerName } = useLocalSearchParams<{ matchId: string; partnerName: string }>();
  const router = useRouter();
  const t = useT();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const fetchActivities = useCallback(() => {
    if (!matchId) return;
    setLoading(true);
    apiClient
      .get(`/mentoring/${matchId}/activities`)
      .then((r) => setActivities(unwrap(r) ?? []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [matchId]);

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [fetchActivities])
  );

  // 정렬된 목록
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [activities, sortOrder]);

  const sortLabel = sortOrder === "asc" ? "오래된 순" : "최신 순";

  return (
    <Screen>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.mentoringActivityLog}</Text>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() =>
            router.push(`/(main)/mentoring-activity-create?matchId=${matchId}&partnerName=${partnerName}`)
          }
        >
          <Text style={styles.writeBtnText}>{t.writeLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* 정렬 바 */}
      {!loading && activities.length > 0 && (
        <View style={styles.sortBar}>
          <Text style={styles.sortCount}>총 {activities.length}개</Text>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortMenuVisible(true)}
          >
            <Ionicons name="swap-vertical-outline" size={14} color={Colors.primary} />
            <Text style={styles.sortBtnText}>{sortLabel}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : activities.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="document-outline" size={48} color={Colors.border} />
          <Text style={styles.emptyText}>{t.activityEmpty}</Text>
          <Text style={styles.emptyDesc}>{t.activityEmptyDesc}</Text>
        </View>
      ) : (
        <FlatList
          data={sortedActivities}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              {/* 타임라인 인디케이터 */}
              <View style={styles.timelineCol}>
                <View style={styles.timelineDot} />
                {index < sortedActivities.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <TouchableOpacity
                style={styles.cardContent}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(
                    `/(main)/mentoring-activity-detail?matchId=${matchId}&partnerName=${partnerName}&activityId=${item.id}`
                  )
                }
              >
                <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody} numberOfLines={2}>{item.content}</Text>

                {item.imageUrls && item.imageUrls.length > 0 && (
                  <View style={styles.imageCountRow}>
                    <Ionicons name="image-outline" size={14} color={Colors.textTertiary} />
                    <Text style={styles.imageCountText}>사진 {item.imageUrls.length}장</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* 정렬 선택 모달 */}
      <Modal
        visible={sortMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSortMenuVisible(false)}>
          <View style={styles.sortMenu}>
            <Text style={styles.sortMenuTitle}>정렬 기준</Text>

            <TouchableOpacity
              style={[styles.sortOption, sortOrder === "asc" && styles.sortOptionActive]}
              onPress={() => { setSortOrder("asc"); setSortMenuVisible(false); }}
            >
              <Ionicons
                name="arrow-up-outline"
                size={18}
                color={sortOrder === "asc" ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.sortOptionText, sortOrder === "asc" && styles.sortOptionTextActive]}>
                오래된 순
              </Text>
              {sortOrder === "asc" && (
                <Ionicons name="checkmark" size={18} color={Colors.primary} style={{ marginLeft: "auto" }} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, sortOrder === "desc" && styles.sortOptionActive]}
              onPress={() => { setSortOrder("desc"); setSortMenuVisible(false); }}
            >
              <Ionicons
                name="arrow-down-outline"
                size={18}
                color={sortOrder === "desc" ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.sortOptionText, sortOrder === "desc" && styles.sortOptionTextActive]}>
                최신 순
              </Text>
              {sortOrder === "desc" && (
                <Ionicons name="checkmark" size={18} color={Colors.primary} style={{ marginLeft: "auto" }} />
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.background },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  writeBtn: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], backgroundColor: Colors.primary, borderRadius: Radius.md },
  writeBtnText: { fontSize: Typography.sm, fontWeight: Typography.bold, color: "#fff" },
  // 정렬 바
  sortBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing[5], paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.backgroundSecondary },
  sortCount: { fontSize: Typography.sm, color: Colors.textTertiary },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.primary + "50", backgroundColor: Colors.primaryLight },
  sortBtnText: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.primary },
  // 목록
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing[2] },
  emptyText: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textSecondary },
  emptyDesc: { fontSize: Typography.sm, color: Colors.textTertiary },
  list: { padding: Spacing[5], gap: Spacing[1] },
  card: { flexDirection: "row", gap: Spacing[3], paddingBottom: Spacing[5] },
  timelineCol: { alignItems: "center", width: 20, paddingTop: 4 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.primaryLight },
  timelineLine: { flex: 1, width: 2, backgroundColor: Colors.primaryLight, marginTop: 4 },
  cardContent: { flex: 1, backgroundColor: Colors.background, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing[4], gap: Spacing[2] },
  cardDate: { fontSize: Typography.xs, color: Colors.textTertiary },
  cardTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  cardBody: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: Typography.sm * 1.6 },
  imageCountRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  imageCountText: { fontSize: Typography.xs, color: Colors.textTertiary },
  // 정렬 모달
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  sortMenu: { backgroundColor: Colors.background, borderRadius: Radius.xl, padding: Spacing[4], width: 240, gap: Spacing[2], shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  sortMenuTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing[2], textAlign: "center" },
  sortOption: { flexDirection: "row", alignItems: "center", gap: Spacing[3], paddingVertical: Spacing[3], paddingHorizontal: Spacing[3], borderRadius: Radius.md },
  sortOptionActive: { backgroundColor: Colors.primaryLight },
  sortOptionText: { fontSize: Typography.base, color: Colors.textSecondary },
  sortOptionTextActive: { color: Colors.primary, fontWeight: Typography.semibold },
});