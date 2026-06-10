import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
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
  imageUrls: string[];
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const THUMB_SIZE = 90;

export default function MentoringActivityDetailScreen() {
  const { matchId, activityId, partnerName } = useLocalSearchParams<{
    matchId: string;
    activityId: string;
    partnerName: string;
  }>();
  const router = useRouter();

  const [activity, setActivity] = useState<ActivityItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId || !activityId) return;
    apiClient
      .get(`/mentoring/${matchId}/activities`)
      .then((r) => {
        const list: ActivityItem[] = unwrap(r) ?? [];
        const found = list.find((a) => String(a.id) === activityId);
        setActivity(found ?? null);
      })
      .catch(() => setActivity(null))
      .finally(() => setLoading(false));
  }, [matchId, activityId]);

  return (
    <Screen>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>활동 기록 상세</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : !activity ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.border} />
          <Text style={styles.errorText}>활동 기록을 불러올 수 없습니다.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

          {/* 날짜 */}
          <Text style={styles.date}>{formatDate(activity.createdAt)}</Text>

          {/* 제목 */}
          <Text style={styles.title}>{activity.title}</Text>

          <View style={styles.divider} />

          {/* 내용 */}
          <Text style={styles.content}>{activity.content}</Text>

          {/* 첨부 사진 */}
          {activity.imageUrls && activity.imageUrls.length > 0 && (
            <View style={styles.imageSection}>
              <View style={styles.imageSectionHeader}>
                <Ionicons name="images-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.imageSectionTitle}>
                  첨부 사진 {activity.imageUrls.length}장
                </Text>
              </View>

              {/* 썸네일 가로 스크롤 */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {activity.imageUrls.map((uri, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelectedImage(uri)}
                    activeOpacity={0.8}
                    style={styles.thumbWrap}
                  >
                    <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
                    <View style={styles.thumbOverlay}>
                      <Ionicons name="expand-outline" size={14} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.tapHint}>사진을 탭하면 크게 볼 수 있습니다</Text>
            </View>
          )}

        </ScrollView>
      )}

      {/* 이미지 전체화면 모달 */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>
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
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing[3] },
  errorText: { fontSize: Typography.base, color: Colors.textSecondary },
  body: { padding: Spacing[5], gap: Spacing[4] },
  date: { fontSize: Typography.xs, color: Colors.textTertiary },
  title: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography["2xl"] * 1.4,
  },
  divider: { height: 1, backgroundColor: Colors.border },
  content: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.base * 1.8,
  },
  imageSection: { gap: Spacing[3], marginTop: Spacing[2] },
  imageSectionHeader: { flexDirection: "row", alignItems: "center", gap: Spacing[1] },
  imageSectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.md,
    marginRight: Spacing[2],
    overflow: "hidden",
  },
  thumb: { width: THUMB_SIZE, height: THUMB_SIZE },
  thumbOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 4,
    padding: 2,
  },
  tapHint: { fontSize: Typography.xs, color: Colors.textTertiary },
  // 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: Spacing[2],
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});
