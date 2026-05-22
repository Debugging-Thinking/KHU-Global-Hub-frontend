import React, { useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';

import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useAuthStore } from '@/src/store/authStore';
import { memberApi } from '@/src/api/auth';
import { useT } from '@/src/i18n';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { Language, MentoringRole } from '@/src/types/auth';

const LANG_LABELS: Record<string, string> = {
  KO: '한국어', EN: 'English', ZH: '中文',
  VI: 'Tiếng Việt', ES: 'Español', MN: 'Монгол',
};
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'KO', label: '한국어' },
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: '中文' },
  { value: 'VI', label: 'Tiếng Việt' },
  { value: 'ES', label: 'Español' },
  { value: 'MN', label: 'Монгол' },
];
const ROLE_COLORS: Record<string, string> = {
  MENTOR: Colors.accent, MENTEE: Colors.primary, NONE: Colors.textTertiary,
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
    MENTOR: t.mentor, MENTEE: t.mentee, NONE: t.none,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [nationality, setNationality] = useState('');
  const [admissionYear, setAdmissionYear] = useState(CURRENT_YEAR);
  const [language, setLanguage] = useState<Language>('KO');
  const [mentoringRole, setMentoringRole] = useState<MentoringRole>('MENTEE');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const handleEditStart = () => {
    if (!profile) return;
    setName(profile.name);
    setDepartment(profile.department);
    setNationality(profile.nationality);
    setAdmissionYear(profile.admissionYear);
    setLanguage(profile.language);
    setMentoringRole(profile.mentoringRole === 'NONE' ? 'MENTEE' : profile.mentoringRole);
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
      const updated = await memberApi.updateMe({ name, department, nationality, admissionYear, language, mentoringRole });
      setProfile(updated);
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert(t.permissionNeeded, t.photoPermission);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    try {
      const updated = await memberApi.updateProfileImage(result.assets[0]);
      setProfile(updated);
    } catch {
      showAlert('오류', t.photoUploadFailed);
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

  const roleColor = ROLE_COLORS[profile.mentoringRole] ?? Colors.textTertiary;
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
        {!isEditing ? (
          <TouchableOpacity onPress={handleEditStart} style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
            <Text style={styles.editBtnText}>{t.edit}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleCancel} style={styles.editBtn}>
            <Text style={styles.cancelBtnText}>{t.cancel}</Text>
          </TouchableOpacity>
        )}
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
            name={profile.mentoringRole === 'MENTOR' ? 'school' : 'person'}
            size={12}
            color={roleColor}
          />
          <Text style={[styles.roleText, { color: roleColor }]}>
            {ROLE_LABELS[profile.mentoringRole] ?? profile.mentoringRole}
          </Text>
        </View>
      </View>

      {/* 경희 온도 — 구조만 (퀴즈·멘토링·참여도 점수 나중에 연결) */}
      {!isEditing && (
        <View style={styles.tempCard}>
          <View style={styles.tempRow}>
            <Ionicons name="thermometer-outline" size={18} color={Colors.accent} />
            <Text style={styles.tempLabel}>경희 온도</Text>
            <View style={styles.tempBadge}>
              <Text style={styles.tempValue}>--°</Text>
            </View>
          </View>
          <Text style={styles.tempHint}>퀴즈 점수·멘토링 참여도 등이 반영될 예정이에요</Text>
        </View>
      )}

      {/* 정보 카드 */}
      {!isEditing ? (
        <Card style={styles.infoCard}>
          <InfoRow icon="school-outline" label={t.department} value={profile.department} />
          <View style={styles.divider} />
          <InfoRow icon="flag-outline" label={t.nationality} value={profile.nationality} />
          <View style={styles.divider} />
          <InfoRow icon="calendar-outline" label={t.admissionYear} value={t.admissionYearValue(profile.admissionYear)} />
          <View style={styles.divider} />
          <InfoRow icon="language-outline" label={t.languageLabel} value={LANG_LABELS[profile.language] ?? profile.language} />
          <View style={styles.divider} />
          <InfoRow icon="people-outline" label={t.mentoringLabel} value={ROLE_LABELS[profile.mentoringRole] ?? profile.mentoringRole} />
        </Card>
      ) : (
        <Card style={styles.editCard}>
          <Input label={t.nameLabel} value={name} onChangeText={setName} />
          <Input label={t.department} value={department} onChangeText={setDepartment} />
          <Input label={t.nationality} value={nationality} onChangeText={setNationality} />

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
          <View>
            <Text style={styles.sectionLabel}>{t.preferredLanguage}</Text>
            <View style={styles.langGrid}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.value}
                  onPress={() => setLanguage(l.value)}
                  style={[styles.chip, language === l.value && styles.chipActive]}
                >
                  <Text style={[styles.chipText, language === l.value && styles.chipTextActive]}>{l.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
  tempCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.accentLight,
    ...Shadow.sm,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[1],
  },
  tempLabel: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  tempBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.full,
  },
  tempValue: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.accent,
  },
  tempHint: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginLeft: Spacing[7],
  },
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
