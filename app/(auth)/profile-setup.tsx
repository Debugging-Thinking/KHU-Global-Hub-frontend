import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authApi, memberApi } from '@/src/api/auth';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { Language, MentoringRole } from '@/src/types/auth';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'KO', label: '한국어' },
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: '中文' },
  { value: 'VI', label: 'Tiếng Việt' },
  { value: 'ES', label: 'Español' },
  { value: 'MN', label: 'Монгол' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2015 + 1 }, (_, i) => CURRENT_YEAR - i);

export default function ProfileSetupScreen() {
  const router = useRouter();
  const setProfile = useAuthStore((s) => s.setProfile);

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [nationality, setNationality] = useState('');
  const [admissionYear, setAdmissionYear] = useState<number>(CURRENT_YEAR);
  const [language, setLanguage] = useState<Language>('KO');
  const [mentoringRole, setMentoringRole] = useState<MentoringRole>('MENTEE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use the locally selected language so UI updates in real-time as user picks language
  const t = useT(language);
  const isNewStudent = admissionYear === CURRENT_YEAR;

  const handleSubmit = async () => {
    if (!name || !department || !nationality) {
      setError(t.allFieldsRequired);
      return;
    }
    const role: MentoringRole = isNewStudent ? 'MENTEE' : mentoringRole;
    setError('');
    setLoading(true);
    try {
      await authApi.setupProfile({
        name,
        department,
        nationality,
        admissionYear,
        language,
        mentoringRole: role,
      });
      const profile = await memberApi.getMe();
      setProfile(profile);

      const { useAuthStore: store } = await import('@/src/store/authStore');
      store.setState({ isAuthenticated: true });
      router.replace('/(main)');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.profileCreateFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t.profileSetupTitle}</Text>
          <Text style={styles.desc}>{t.welcomeMessage}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t.nameLabel}
            placeholder={t.namePlaceholder}
            value={name}
            onChangeText={setName}
          />
          <Input
            label={t.department}
            placeholder={t.departmentPlaceholder}
            value={department}
            onChangeText={setDepartment}
          />
          <Input
            label={t.nationality}
            placeholder={t.nationalityPlaceholder}
            value={nationality}
            onChangeText={setNationality}
          />

          {/* Admission Year */}
          <View>
            <Text style={styles.sectionLabel}>{t.sectionAdmissionYear}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => setAdmissionYear(y)}
                  style={[styles.chip, admissionYear === y && styles.chipActive]}
                >
                  <Text style={[styles.chipText, admissionYear === y && styles.chipTextActive]}>
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {isNewStudent ? (
              <Text style={styles.hint}>{t.freshmanAutoMentee}</Text>
            ) : (
              <View style={styles.roleRow}>
                {(['MENTEE', 'MENTOR'] as MentoringRole[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setMentoringRole(r)}
                    style={[styles.chip, mentoringRole === r && styles.chipActive, styles.roleChip]}
                  >
                    <Text style={[styles.chipText, mentoringRole === r && styles.chipTextActive]}>
                      {r === 'MENTEE' ? t.mentee : t.mentor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Preferred Language */}
          <View>
            <Text style={styles.sectionLabel}>{t.sectionPreferredLanguage}</Text>
            <View style={styles.langGrid}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.value}
                  onPress={() => setLanguage(l.value)}
                  style={[styles.langChip, language === l.value && styles.chipActive]}
                >
                  <Text style={[styles.chipText, language === l.value && styles.chipTextActive]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Button
          label={t.start}
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing[4] }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[10],
    gap: Spacing[6],
  },
  header: { gap: Spacing[2] },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: Typography.base * Typography.relaxed,
  },
  form: { gap: Spacing[5] },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  chips: { gap: Spacing[2], paddingRight: Spacing[4] },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  chipText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  chipTextActive: { color: Colors.primary },
  hint: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: Spacing[2],
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginTop: Spacing[2],
  },
  roleChip: {
    flex: 1,
    alignItems: 'center',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  langChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  error: {
    fontSize: Typography.sm,
    color: Colors.error,
    textAlign: 'center',
  },
});
