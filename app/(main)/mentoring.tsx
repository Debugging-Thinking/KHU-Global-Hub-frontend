import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import apiClient, { unwrap } from '@/src/api/client';
import { useAuthStore } from '@/src/store/authStore';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

interface MatchInfo {
  matchId: number;
  semester: string;
  status: string;
  myRole: 'MENTOR' | 'MENTEE';
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
  const profile = useAuthStore((s) => s.profile);
  const [match, setMatch] = useState<MatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [noMatch, setNoMatch] = useState(false);

  useEffect(() => {
    apiClient
      .get('/mentoring/me')
      .then((r) => setMatch(unwrap(r)))
      .catch(() => setNoMatch(true))
      .finally(() => setLoading(false));
  }, []);

  const roleLabel = profile?.mentoringRole === 'MENTOR' ? '멘토' : '멘티';
  // 멘토 = 골드(경험·권위), 멘티 = 크림슨(열정·성장)
  const roleColor = profile?.mentoringRole === 'MENTOR' ? Colors.accent : Colors.primary;

  return (
    <Screen scrollable padded>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>멘토링</Text>
      </View>

      {/* 내 역할 */}
      <Card style={styles.roleCard}>
        <View style={styles.roleRow}>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '20' }]}>
            <Ionicons
              name={profile?.mentoringRole === 'MENTOR' ? 'school-outline' : 'person-outline'}
              size={20}
              color={roleColor}
            />
            <Text style={[styles.roleBadgeText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
          <Text style={styles.roleDesc}>
            {profile?.mentoringRole === 'MENTOR'
              ? '후배 유학생을 도와주는 역할이에요'
              : '선배 유학생에게 도움을 받을 수 있어요'}
          </Text>
        </View>
      </Card>

      {/* 매칭 정보 */}
      <Text style={styles.subtitle}>현재 매칭</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : noMatch || !match ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="people-outline" size={40} color={Colors.border} />
          <Text style={styles.emptyTitle}>아직 매칭이 없어요</Text>
          <Text style={styles.emptyDesc}>
            매년 3월과 9월에 자동으로{'\n'}멘토-멘티 매칭이 이루어져요
          </Text>
        </Card>
      ) : (
        <Card style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchSemester}>{match.semester} 매칭</Text>
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>활성</Text>
            </View>
          </View>

          <View style={styles.partnerRow}>
            {match.partner.profileImageUrl ? (
              <Image source={{ uri: match.partner.profileImageUrl }} style={styles.avatar} />
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
          </View>

          <Button
            label="메시지 보내기"
            onPress={() => router.push(`/(main)/chat/${match.partner.memberId}`)}
            fullWidth
            variant="outline"
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: Spacing[5],
    paddingBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  roleCard: {
    marginBottom: Spacing[5],
  },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  center: { paddingVertical: Spacing[10], alignItems: 'center' },
  emptyCard: { alignItems: 'center', gap: Spacing[2], paddingVertical: Spacing[8] },
  emptyTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  emptyDesc: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: Typography.sm * Typography.relaxed,
  },
  matchCard: { gap: Spacing[4] },
  matchHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchSemester: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.full,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  activeText: { fontSize: Typography.xs, color: Colors.success, fontWeight: Typography.semibold },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4] },
  avatar: { width: 60, height: 60, borderRadius: Radius.full },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: Typography['2xl'], fontWeight: Typography.bold, color: Colors.primary },
  partnerInfo: { flex: 1, gap: 3 },
  partnerName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  partnerDetail: { fontSize: Typography.sm, color: Colors.textSecondary },
});
