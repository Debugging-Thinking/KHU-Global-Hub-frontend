import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/src/components/layout/Screen";
import apiClient, { unwrap } from "@/src/api/client";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";

interface ActivityItem {
  id: number;
  matchId: number;
  authorId: number;
  title: string;
  content: string;
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function MentoringActivityScreen() {
  const { matchId, partnerName } = useLocalSearchParams<{ matchId: string; partnerName: string }>();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Screen>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>멘토링 활동 기록</Text>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() =>
            router.push(`/(main)/mentoring-activity-create?matchId=${matchId}&partnerName=${partnerName}`)
          }
        >
          <Text style={styles.writeBtnText}>작성</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : activities.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="document-outline" size={48} color={Colors.border} />
          <Text style={styles.emptyText}>활동 기록이 아직 없어요</Text>
          <Text style={styles.emptyDesc}>첫 번째 활동 기록을 작성해보세요!</Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              {/* 타임라인 인디케이터 */}
              <View style={styles.timelineCol}>
                <View style={styles.timelineDot} />
                {index < activities.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody} numberOfLines={3}>
                  {item.content}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  writeBtn: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  writeBtnText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },
  emptyText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  emptyDesc: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  list: {
    padding: Spacing[5],
    gap: Spacing[1],
  },
  card: {
    flexDirection: "row",
    gap: Spacing[3],
    paddingBottom: Spacing[5],
  },
  timelineCol: {
    alignItems: "center",
    width: 20,
    paddingTop: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.primaryLight,
    marginTop: 4,
  },
  cardContent: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    gap: Spacing[2],
  },
  cardDate: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  cardBody: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * 1.6,
  },
});