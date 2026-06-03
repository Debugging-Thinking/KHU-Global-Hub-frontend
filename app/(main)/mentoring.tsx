import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/src/components/layout/Screen";
import { Card } from "@/src/components/ui/Card";
import apiClient, { unwrap } from "@/src/api/client";
import { useAuthStore } from "@/src/store/authStore";
import { useT } from "@/src/i18n";
import { Colors, Radius, Shadow, Spacing, Typography } from "@/constants/theme";

interface MatchInfo {
  matchId: number;
  semester: string;
  status: string;
  myRole: "MENTOR" | "MENTEE";
  matchedAt: string;
  partner: {
    memberId: number;
    name: string;
    department: string;
    nationality: string;
    profileImageUrl: string | null;
    mentoringRole: string;
  };
}

export default function MentoringScreen() {
  const router = useRouter();
  const t = useT();
  const profile = useAuthStore((s) => s.profile);
  const [match, setMatch] = useState<MatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [noMatch, setNoMatch] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    apiClient
      .get("/mentoring/me")
      .then((r) => setMatch(unwrap(r)))
      .catch(() => setNoMatch(true))
      .finally(() => setLoading(false));
  }, []);

  const roleLabel =
    profile?.mentoringRole === "MENTOR" ? t.mentor : t.mentee;
  const roleColor =
    profile?.mentoringRole === "MENTOR" ? Colors.accent : Colors.primary;

  const partnerRoleLabel =
    profile?.mentoringRole === "MENTOR" ? t.mentee : t.mentor;

  return (
    <Screen scrollable padded>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.mentoring}</Text>
      </View>

      {/* 내 역할 카드 */}
      <Card style={styles.roleCard}>
        <View style={styles.roleRow}>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + "20" }]}>
            <Ionicons
              name={profile?.mentoringRole === "MENTOR" ? "school-outline" : "person-outline"}
              size={20}
              color={roleColor}
            />
            <Text style={[styles.roleBadgeText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
          <Text style={styles.roleDesc}>
            {profile?.mentoringRole === "MENTOR" ? t.mentorDesc : t.menteeDesc}
          </Text>
        </View>
      </Card>

      {/* 매칭 정보 */}
      <Text style={styles.subtitle}>{t.currentMatch}</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : noMatch || !match ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="people-outline" size={40} color={Colors.border} />
          <Text style={styles.emptyTitle}>{t.noMatchYet}</Text>
          <Text style={styles.emptyDesc}>{t.matchAutoDesc}</Text>
        </Card>
      ) : (
        <>
          <Card style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <Text style={styles.matchSemester}>{t.matchSemester(match.semester)}</Text>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>{t.active}</Text>
              </View>
            </View>

            {/* 파트너 프로필 - 터치 시 팝업 */}
            <TouchableOpacity
              style={styles.partnerRow}
              activeOpacity={0.7}
              onPress={() => setPopupVisible(true)}
            >
              {match.partner.profileImageUrl ? (
                <Image
                  source={{ uri: match.partner.profileImageUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{match.partner.name[0]}</Text>
                </View>
              )}
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>{match.partner.name}</Text>
                <Text style={styles.partnerDetail}>{match.partner.department}</Text>
                <Text style={styles.partnerDetail}>{match.partner.nationality}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>

            <Text style={styles.tapHint}>
              {profile?.mentoringRole === "MENTOR"
                ? "멘티 프로필을 터치하면 메뉴가 열립니다"
                : "멘토 프로필을 터치하면 메뉴가 열립니다"}
            </Text>
          </Card>

          {/* 팝업 메뉴 */}
          <Modal
            visible={popupVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setPopupVisible(false)}
          >
            <Pressable style={styles.overlay} onPress={() => setPopupVisible(false)}>
              <View style={styles.popup}>
                {/* 팝업 헤더 */}
                <View style={styles.popupHeader}>
                  {match.partner.profileImageUrl ? (
                    <Image
                      source={{ uri: match.partner.profileImageUrl }}
                      style={styles.popupAvatar}
                    />
                  ) : (
                    <View style={styles.popupAvatarPlaceholder}>
                      <Text style={styles.popupAvatarText}>{match.partner.name[0]}</Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.popupName}>{match.partner.name}</Text>
                    <Text style={styles.popupRole}>{partnerRoleLabel}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* 메뉴 항목 1: 프로필 정보 */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setPopupVisible(false);
                    router.push(`/(main)/mentor-profile?memberId=${match.partner.memberId}`);
                  }}
                >
                  <View style={[styles.menuIcon, { backgroundColor: Colors.primaryLight }]}>
                    <Ionicons name="person-outline" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>프로필 정보</Text>
                    <Text style={styles.menuDesc}>{match.partner.name}의 상세 프로필</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>

                {/* 메뉴 항목 2: 멘토링 활동 기록 */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setPopupVisible(false);
                    router.push(`/(main)/mentoring-activity?matchId=${match.matchId}&partnerName=${match.partner.name}`);
                  }}
                >
                  <View style={[styles.menuIcon, { backgroundColor: Colors.accent + "20" }]}>
                    <Ionicons name="document-text-outline" size={20} color={Colors.accent} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>멘토링 활동 기록</Text>
                    <Text style={styles.menuDesc}>함께한 멘토링 히스토리</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>

                {/* 메뉴 항목 3: 채팅으로 이동 */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setPopupVisible(false);
                    router.push({ pathname: "/(main)/chat", params: { highlightPartnerId: String(match.partner.memberId) } });
                  }}
                >
                  <View style={[styles.menuIcon, { backgroundColor: Colors.successLight }]}>
                    <Ionicons name="chatbubble-outline" size={20} color={Colors.success} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>채팅으로 이동</Text>
                    <Text style={styles.menuDesc}>{match.partner.name}에게 메시지 보내기</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>

                {/* 닫기 버튼 */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.closeButtonText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { paddingTop: Spacing[5], paddingBottom: Spacing[3] },
  sectionTitle: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  roleCard: { marginBottom: Spacing[5] },
  roleRow: { flexDirection: "row", alignItems: "center", gap: Spacing[3] },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
  },
  roleBadgeText: { fontSize: Typography.base, fontWeight: Typography.bold },
  roleDesc: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },
  subtitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  center: { paddingVertical: Spacing[10], alignItems: "center" },
  emptyCard: { alignItems: "center", gap: Spacing[2], paddingVertical: Spacing[8] },
  emptyTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  emptyDesc: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: Typography.sm * Typography.relaxed,
  },
  matchCard: { gap: Spacing[4] },
  matchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  matchSemester: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.full,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  activeText: { fontSize: Typography.xs, color: Colors.success, fontWeight: Typography.semibold },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[1],
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundSecondary,
    paddingLeft: Spacing[3],
  },
  avatar: { width: 60, height: 60, borderRadius: Radius.full },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: Typography["2xl"], fontWeight: Typography.bold, color: Colors.primary },
  partnerInfo: { flex: 1, gap: 3 },
  partnerName: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  partnerDetail: { fontSize: Typography.sm, color: Colors.textSecondary },
  tapHint: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: "center",
  },

  // 팝업
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
    gap: Spacing[1],
  },
  popupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  popupAvatar: { width: 48, height: 48, borderRadius: Radius.full },
  popupAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  popupAvatarText: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.primary },
  popupName: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  popupRole: { fontSize: Typography.sm, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing[2] },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextGroup: { flex: 1 },
  menuTitle: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  menuDesc: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  closeButton: {
    marginTop: Spacing[4],
    paddingVertical: Spacing[3],
    alignItems: "center",
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundSecondary,
  },
  closeButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
});