import React, { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}
import { Ionicons } from '@expo/vector-icons';
import { pickImages } from '@/src/lib/pickImages';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { SearchableSelect } from '@/src/components/ui/SearchableSelect';
import { useAuthStore } from '@/src/store/authStore';
import { memberApi } from '@/src/api/auth';
import { useT, badgeName } from '@/src/i18n';
import { bucketFromAzure } from '@/src/i18n/preferredLanguage';
import { departmentOptions, countryOptions, languageOptions, languageDisplay } from '@/src/data/selectOptions';
import { departmentLabel, countryLabel } from '@/src/data/labels';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { MentoringRole } from '@/src/types/auth';
import { badgeApi } from '@/src/api/badge';
import { BADGE_META } from '@/src/types/badge';
import type { BadgeId, BadgeInfo } from '@/src/types/badge';

const ROLE_COLORS: Record<string, string> = {
  MENTOR: Colors.accent, MENTEE: Colors.primary, NONE: Colors.textTertiary,
  ADMIN: '#C41230',
};
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2015 + 1 }, (_, i) => CURRENT_YEAR - i);

interface InfoRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}
function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={17} color={Colors.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { profile, setProfile, logout } = useAuthStore();
  const t = useT();

  const ROLE_LABELS: Record<string, string> = {
    MENTOR: t.mentor, MENTEE: t.mentee, NONE: t.none, ADMIN: '관리자',
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [nationality, setNationality] = useState('');
  const [admissionYear, setAdmissionYear] = useState(CURRENT_YEAR);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('ko');
  const [mentoringRole, setMentoringRole] = useState<MentoringRole>('MENTEE');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<BadgeInfo[]>([]);

  // 편집 중 선택한 선호 언어 버킷으로 드롭다운 옵션 현지화.
  const editLang = bucketFromAzure(preferredLanguage);
  const deptOpts = useMemo(() => departmentOptions(editLang), [editLang]);
  const countryOpts = useMemo(() => countryOptions(editLang), [editLang]);
  const langOpts = useMemo(() => languageOptions(), []);

  useFocusEffect(
    useCallback(() => {
      badgeApi.getMyBadges()
        .then(setEarnedBadges)
        .catch(() => {});
    }, [])
  );

  const handleEditStart = () => {
    if (!profile) return;
    setName(profile.name);
    setDepartment(profile.department);
    setNationality(profile.nationality);
    setAdmissionYear(profile.admissionYear);
    setPreferredLanguage(profile.preferredLanguage ?? 'ko');
    setMentoringRole(profile.mentoringRole === 'NONE' ? 'MENTEE' : profile.mentoringRole);
    setBio(profile.bio ?? '');
    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!name || !department || !nationality) {
      setError(t.allFieldsRequired);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const isNewStudent = admissionYear === CURRENT_YEAR;
      const updated = await memberApi.updateMe({
        name,
        department,
        nationality,
        admissionYear,
        language: bucketFromAzure(preferredLanguage),
        preferredLanguage,
        bio: bio.trim(),
        // 신입생은 mentoringRole 전송하지 않음 (백엔드에서도 MENTEE 고정)
        ...(isNewStudent ? {} : { mentoringRole }),
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  // 관리자: 편집 모드 없이 선호 언어만 즉시 변경 (학생 정보는 기존 값 유지).
  const handleAdminLanguageSelect = async (lang: string) => {
    if (!profile || lang === (profile.preferredLanguage ?? 'ko')) return;
    setSaving(true);
    setError('');
    try {
      const updated = await memberApi.updateMe({
        name: profile.name,
        department: profile.department,
        nationality: profile.nationality,
        admissionYear: profile.admissionYear,
        language: bucketFromAzure(lang),
        preferredLanguage: lang,
        bio: profile.bio ?? '',
        // mentoringRole 미전송 → 백엔드가 기존 역할 유지
      });
      setProfile(updated);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    const picked = await pickImages(false);
    if (!picked[0]) return;
    try {
      const updated = await memberApi.updateProfileImage(picked[0]);
      setProfile(updated);
    } catch {
      showAlert(t.errorTitle, t.photoUploadFailed);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${t.logoutConfirmTitle}\n${t.logoutConfirmMessage}`)) logout();
    } else {
      Alert.alert(t.logoutConfirmTitle, t.logoutConfirmMessage, [
        { text: t.cancel, style: 'cancel' },
        { text: t.logout, style: 'destructive', onPress: logout },
      ]);
    }
  };

  if (!profile) return null;

  const isAdmin = profile.isAdmin;
  const displayRole = profile.isAdmin ? 'ADMIN' : profile.mentoringRole;
  const roleColor = ROLE_COLORS[displayRole] ?? Colors.textTertiary;
  const isNewStudent = admissionYear === CURRENT_YEAR;

  return (
    <Screen scrollable padded>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="people" size={14} color={Colors.textInverse} />
          </View>
          <Text style={styles.headerTitle}>{t.profile}</Text>
        </View>
        {!isAdmin && (!isEditing ? (
          <TouchableOpacity onPress={handleEditStart} style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
            <Text style={styles.editBtnText}>{t.edit}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleCancel} style={styles.editBtn}>
            <Text style={styles.cancelBtnText}>{t.cancel}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 프로필 배너 */}
      <View style={styles.profileBanner}>
        <View style={styles.bannerAccent} />
        <View style={styles.avatarSection}>
          <Pressable onPress={() => profile.profileImageUrl && setPhotoModalVisible(true)}>
            {profile.profileImageUrl ? (
              <Image source={{ uri: profile.profileImageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{profile.name[0]}</Text>
              </View>
            )}
          </Pressable>
          {isEditing && (
            <TouchableOpacity style={styles.editAvatarBtn} onPress={handlePickImage}>
              <Ionicons name="camera" size={13} color={Colors.textInverse} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleColor + '22' }]}>
          <Ionicons
            name={profile.isAdmin ? 'shield-checkmark' : profile.mentoringRole === 'MENTOR' ? 'school' : 'person'}
            size={12}
            color={roleColor}
          />
          <Text style={[styles.roleText, { color: roleColor }]}>
            {ROLE_LABELS[displayRole] ?? displayRole}
          </Text>
        </View>
      </View>

      {!isAdmin && !isEditing && (
        <View style={styles.badgeSection}>
          <Text style={styles.badgeSectionTitle}>{t.myBadges}</Text>
          <View style={styles.badgeGrid}>
            {(Object.keys(BADGE_META) as BadgeId[]).map((badgeId) => {
              const meta = BADGE_META[badgeId];
              const earned = earnedBadges.find((b) => b.badgeId === badgeId);
              return (
                <View
                  key={badgeId}
                  style={[styles.badgeItem, earned ? styles.badgeItemEarned : styles.badgeItemLocked]}
                >
                  <Text style={[styles.badgeEmoji, !earned && styles.badgeEmojiLocked]}>
                    {earned ? meta.emoji : '🔒'}
                  </Text>
                  <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>
                    {badgeName(t, badgeId)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 정보 카드 */}
      {isAdmin ? (
        /* 관리자: 학생 정보 없이 언어 설정만 (편집 모드 없이 바로 변경) */
        <Card style={styles.editCard}>
          <SearchableSelect
            label={t.preferredLanguage}
            placeholder={t.selectLanguage}
            modalTitle={t.selectLanguage}
            searchPlaceholder={t.searchPlaceholder}
            noResultsText={t.noResults}
            options={langOpts}
            value={profile.preferredLanguage ?? 'ko'}
            displayValue={languageDisplay(profile.preferredLanguage ?? 'ko')}
            onSelect={handleAdminLanguageSelect}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </Card>
      ) : !isEditing ? (
        <Card style={styles.infoCard}>
          <InfoRow icon="school-outline" label={t.department} value={departmentLabel(profile.department, profile.language)} />
          <View style={styles.divider} />
          <InfoRow icon="flag-outline" label={t.nationality} value={countryLabel(profile.nationality, profile.language)} />
          <View style={styles.divider} />
          <InfoRow icon="calendar-outline" label={t.admissionYear} value={t.admissionYearValue(profile.admissionYear)} />
          <View style={styles.divider} />
          <InfoRow icon="language-outline" label={t.languageLabel} value={languageDisplay(profile.preferredLanguage) ?? profile.language} />
          <View style={styles.divider} />
          <InfoRow icon="people-outline" label={t.mentoringLabel} value={ROLE_LABELS[displayRole] ?? displayRole} />
          <View style={styles.divider} />
          <InfoRow icon="person-circle-outline" label={t.bioLabel} value={profile.bio?.trim() ? profile.bio : t.noBio} />
        </Card>
      ) : (
        <Card style={styles.editCard}>
          <Input label={t.nameLabel} value={name} onChangeText={setName} />
          <SearchableSelect
            label={t.department}
            placeholder={t.selectDepartment}
            modalTitle={t.selectDepartment}
            searchPlaceholder={t.searchPlaceholder}
            noResultsText={t.noResults}
            options={deptOpts}
            value={department}
            displayValue={department ? departmentLabel(department, editLang) : undefined}
            onSelect={setDepartment}
          />
          <SearchableSelect
            label={t.nationality}
            placeholder={t.selectNationality}
            modalTitle={t.selectNationality}
            searchPlaceholder={t.searchPlaceholder}
            noResultsText={t.noResults}
            options={countryOpts}
            value={nationality}
            displayValue={nationality ? countryLabel(nationality, editLang) : undefined}
            onSelect={setNationality}
          />

          {/* 입학년도 */}
          <View>
            <Text style={styles.sectionLabel}>{t.sectionAdmissionYear}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => setAdmissionYear(y)}
                  style={[styles.chip, admissionYear === y && styles.chipActive]}
                >
                  <Text style={[styles.chipText, admissionYear === y && styles.chipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 선호 언어 */}
          <SearchableSelect
            label={t.preferredLanguage}
            placeholder={t.selectLanguage}
            modalTitle={t.selectLanguage}
            searchPlaceholder={t.searchPlaceholder}
            noResultsText={t.noResults}
            options={langOpts}
            value={preferredLanguage}
            displayValue={languageDisplay(preferredLanguage)}
            onSelect={setPreferredLanguage}
          />

          {/* 멘토링 역할 */}
          <View>
            <Text style={styles.sectionLabel}>{t.mentoringRole}</Text>
            {isNewStudent ? (
              <Text style={styles.hint}>{t.freshmanAutoMentee}</Text>
            ) : (
              <View style={styles.roleRow}>
                {(['MENTEE', 'MENTOR'] as MentoringRole[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setMentoringRole(r)}
                    style={[styles.chip, styles.roleChip, mentoringRole === r && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, mentoringRole === r && styles.chipTextActive]}>
                      {r === 'MENTEE' ? t.mentee : t.mentor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 자기소개 */}
          <Input label={t.bioLabel} placeholder={t.bioLabel} value={bio} onChangeText={setBio} multiline maxLength={500} />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label={t.save} onPress={handleSave} loading={saving} fullWidth size="lg" />
        </Card>
      )}

      <View style={styles.khuWatermark}>
        <View style={styles.crimsonLine} />
        <Text style={styles.khuText}>KYUNG HEE UNIVERSITY</Text>
        <View style={styles.crimsonLine} />
      </View>

      {!isEditing && (
        <Button label={t.logout} onPress={handleLogout} variant="outline" fullWidth style={styles.logoutBtn} />
      )}

      {/* 프로필 사진 확대 Modal */}
      <Modal visible={photoModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setPhotoModalVisible(false)}>
          <Image
            source={{ uri: profile.profileImageUrl ?? '' }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[5],
    paddingBottom: Spacing[4],
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  headerIcon: {
    width: 28,
    height: 28,
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editBtnText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },
  cancelBtnText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  profileBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    alignItems: 'center',
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
    gap: Spacing[2],
    overflow: 'hidden',
    ...Shadow.md,
  },
  bannerAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 6,
    backgroundColor: Colors.primary,
  },
  avatarSection: { position: 'relative', marginTop: Spacing[3] },
  avatar: { width: 80, height: 80, borderRadius: Radius.full },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarInitial: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: 26, height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  name: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: Spacing[1],
  },
  email: { fontSize: Typography.sm, color: Colors.textTertiary },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    marginTop: Spacing[1],
  },
  roleText: { fontSize: Typography.xs, fontWeight: Typography.bold },
  infoCard: { gap: 0, marginBottom: Spacing[4] },
  editCard: { gap: Spacing[4], marginBottom: Spacing[4] },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[4],
  },
  infoLabel: { fontSize: Typography.base, color: Colors.textSecondary, width: 60 },
  infoValue: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  divider: { height: 1, backgroundColor: Colors.divider },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  chips: { gap: Spacing[2], paddingRight: Spacing[4] },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  chipTextActive: { color: Colors.primary },
  roleRow: { flexDirection: 'row', gap: Spacing[2] },
  roleChip: { flex: 1, alignItems: 'center' },
  hint: { fontSize: Typography.xs, color: Colors.primary, marginTop: Spacing[1] },
  error: { fontSize: Typography.sm, color: Colors.error, textAlign: 'center' },
  khuWatermark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  crimsonLine: { height: 1.5, width: 32, backgroundColor: Colors.accent },
  khuText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.accent,
    letterSpacing: 1.5,
  },
  logoutBtn: { marginBottom: Spacing[8] },
  badgeSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  badgeSectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  badgeItem: {
    width: '45%',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: Spacing[1],
  },
  badgeItemEarned: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  badgeItemLocked: {
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  badgeEmoji: { fontSize: 28 },
  badgeEmojiLocked: { opacity: 0.4 },
  badgeName: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    textAlign: 'center',
  },
  badgeNameLocked: { color: Colors.textTertiary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
  },
});
