import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/src/components/layout/Screen";
import apiClient, { unwrap } from "@/src/api/client";
import { adminApi } from "@/src/api/admin";
import { badgeApi } from "@/src/api/badge";
import type { BadgeInfo } from "@/src/types/badge";
import { useAuthStore } from "@/src/store/authStore";
import { useLanguage, useT, badgeName } from "@/src/i18n";
import { departmentLabel, countryLabel } from "@/src/data/labels";
import { languageDisplay } from "@/src/data/selectOptions";
import { Radius, Spacing, Typography, type ThemeColors } from "@/constants/theme";
import { useColors, useThemedStyles } from "@/src/theme";

interface PartnerProfile {
  memberId: number;
  name: string;
  profileImageUrl: string | null;
  department: string;
  nationality: string;
  language: string;
  preferredLanguage?: string;
  mentoringRole: string;
  admissionYear: number;
  bio: string | null;
  /** 계정 활성 여부 (false = 정지됨). 관리자 정지 토글용. */
  isActive?: boolean;
}

const LANGUAGE_LABEL: Record<string, string> = {
  KO: "Korean",
  EN: "English",
  ZH: "Chinese",
  VI: "Vietnamese",
  UZ: "Uzbek",
  MN: "Mongolian",
};

export default function MentorProfileScreen() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const router = useRouter();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const lang = useLanguage();
  const t = useT();
  const roleText = (r: string) => (r === "MENTOR" ? t.mentor : r === "MENTEE" ? t.mentee : t.none);
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [badges, setBadges] = useState<BadgeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toggling, setToggling] = useState(false);

  // showSpinner=true: 최초 진입(전체 화면 로딩) · false: 정지 토글 후 조용한 재조회
  const load = useCallback(
    (showSpinner: boolean) => {
      if (!memberId) return;
      if (showSpinner) setLoading(true);
      apiClient
        .get(`/members/${memberId}`)
        .then((r) => {
          setProfile(unwrap(r));
          setError(false);
        })
        .catch(() => {
          if (showSpinner) setError(true);
        })
        .finally(() => {
          if (showSpinner) setLoading(false);
        });
    },
    [memberId]
  );

  useEffect(() => {
    load(true);
  }, [load]);

  // 상대방이 획득한 뱃지 (있을 때만 표시)
  useEffect(() => {
    if (!memberId) return;
    badgeApi
      .getMemberBadges(Number(memberId))
      .then(setBadges)
      .catch(() => setBadges([]));
  }, [memberId]);

  const suspended = profile?.isActive === false;

  // 관리자: 대상 회원 활동 정지/해제 토글 후 프로필 재조회
  const onToggleSuspend = async () => {
    if (!profile) return;
    setToggling(true);
    try {
      if (suspended) await adminApi.activate(profile.memberId);
      else await adminApi.suspend(profile.memberId);
      load(false);
    } catch {
      // 실패 시 상태 유지
    } finally {
      setToggling(false);
    }
  };

  // 관리자: 대상 회원 멘토링 역할 직접 변경(시연 노출 X, 운영 편의용)
  const onChangeRole = async (role: "MENTOR" | "MENTEE") => {
    if (!profile || profile.mentoringRole === role) return;
    setToggling(true);
    try {
      await adminApi.updateRole(profile.memberId, role);
      load(false);
    } catch {
      // 실패 시 상태 유지
    } finally {
      setToggling(false);
    }
  };

  const roleColor =
    profile?.mentoringRole === "MENTOR" ? Colors.accent : Colors.primary;

  return (
    <Screen>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.profileInfo}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : error || !profile ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.border} />
          <Text style={styles.errorText}>{t.profileLoadFail}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

          {/* 프로필 사진 + 이름 + 역할 */}
          <View style={styles.heroSection}>
            {profile.profileImageUrl ? (
              <Image source={{ uri: profile.profileImageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{profile.name[0]}</Text>
              </View>
            )}
            <Text style={styles.name}>{profile.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: roleColor + "20" }]}>
              <Ionicons
                name={profile.mentoringRole === "MENTOR" ? "school-outline" : "person-outline"}
                size={16}
                color={roleColor}
              />
              <Text style={[styles.roleText, { color: roleColor }]}>
                {roleText(profile.mentoringRole)}
              </Text>
            </View>
            {suspended && (
              <View style={styles.suspendedBadge}>
                <Ionicons name="ban" size={14} color={Colors.error} />
                <Text style={styles.suspendedText}>정지됨</Text>
              </View>
            )}
          </View>

          {/* 상세 정보 카드 */}
          <View style={styles.infoCard}>

            {/* 학과 */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="school-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t.department}</Text>
                <Text style={styles.infoValue}>{departmentLabel(profile.department, lang)}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* 국적 */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="globe-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t.nationality}</Text>
                <Text style={styles.infoValue}>{countryLabel(profile.nationality, lang)}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* 언어 */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t.languageLabel}</Text>
                <Text style={styles.infoValue}>
                  {languageDisplay(profile.preferredLanguage) ?? LANGUAGE_LABEL[profile.language] ?? profile.language}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* 자기소개 */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t.bioLabel}</Text>
                <Text style={[styles.infoValue, !profile.bio && styles.infoValueEmpty]}>
                  {profile.bio ?? t.noBio}
                </Text>
              </View>
            </View>

          </View>

          {badges.length > 0 && (
            <View style={styles.badgeGrid}>
              {badges.map((b) => (
                <View key={b.badgeId} style={styles.badgeChip}>
                  <Text style={styles.badgeChipEmoji}>{b.emoji}</Text>
                  <Text style={styles.badgeChipName}>{badgeName(t, b.badgeId)}</Text>
                </View>
              ))}
            </View>
          )}

          {isAdmin ? (
            /* 관리자: 채팅 대신 활동 정지/해제 토글 */
            <TouchableOpacity
              style={[styles.chatBtn, suspended ? styles.activateBtn : styles.suspendBtn]}
              onPress={onToggleSuspend}
              disabled={toggling}
              activeOpacity={0.85}
            >
              {toggling ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <>
                  <Ionicons
                    name={suspended ? "checkmark-circle-outline" : "ban-outline"}
                    size={18}
                    color={Colors.textInverse}
                  />
                  <Text style={styles.chatBtnText}>{suspended ? "정지 해제" : "활동 정지하기"}</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            /* 1:1 채팅하기 — 대화 시작 전엔 방이 생기지 않고, 메시지를 보내면 기록에 남음 */
            <TouchableOpacity
              style={styles.chatBtn}
              onPress={() => router.push(`/(main)/chat/${profile.memberId}`)}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.textInverse} />
              <Text style={styles.chatBtnText}>{t.mentoringGoToChat}</Text>
            </TouchableOpacity>
          )}

          {isAdmin && profile && (
            <View style={styles.roleSwitch}>
              <Text style={styles.roleSwitchLabel}>역할 변경 (관리자용)</Text>
              <View style={styles.roleSwitchRow}>
                {(["MENTOR", "MENTEE"] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleOpt, profile.mentoringRole === r && styles.roleOptActive]}
                    onPress={() => onChangeRole(r)}
                    disabled={toggling}
                  >
                    <Text style={[styles.roleOptText, profile.mentoringRole === r && styles.roleOptTextActive]}>
                      {r === "MENTOR" ? "멘토" : "멘티"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
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
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    marginTop: Spacing[5],
  },
  chatBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textInverse,
  },
  suspendBtn: { backgroundColor: Colors.error },
  roleSwitch: { marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  roleSwitchLabel: { fontSize: 12, color: Colors.textTertiary, marginBottom: 8 },
  roleSwitchRow: { flexDirection: "row", gap: 8 },
  roleOpt: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: "#E5E7EB" },
  roleOptActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleOptText: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  roleOptTextActive: { color: Colors.textInverse },
  activateBtn: { backgroundColor: Colors.success },
  suspendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    backgroundColor: Colors.errorLight,
  },
  suspendedText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.error,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[3],
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  body: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[10],
    gap: Spacing[6],
  },
  heroSection: {
    alignItems: "center",
    gap: Spacing[3],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.primary + "30",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  name: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
  },
  roleText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  infoCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    gap: Spacing[4],
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  infoContent: { flex: 1, gap: 4 },
  infoLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.base * 1.5,
  },
  infoValueEmpty: {
    color: Colors.textTertiary,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[5],
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
  },
  badgeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.accent + "40",
  },
  badgeChipEmoji: { fontSize: 16 },
  badgeChipName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.accentDark,
  },
});