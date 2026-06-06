import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { SearchableSelect } from '@/src/components/ui/SearchableSelect';
import { authApi, memberApi } from '@/src/api/auth';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { bucketFromAzure } from '@/src/i18n/preferredLanguage';
import { departmentOptions, countryOptions, languageOptions, languageDisplay } from '@/src/data/selectOptions';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { MentoringRole } from '@/src/types/auth';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2015 + 1 }, (_, i) => CURRENT_YEAR - i);

export default function ProfileSetupScreen() {
  const router = useRouter();
  const setProfile = useAuthStore((s) => s.setProfile);

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [nationality, setNationality] = useState('');
  const [admissionYear, setAdmissionYear] = useState<number>(CURRENT_YEAR);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('ko');
  const [mentoringRole, setMentoringRole] = useState<MentoringRole>('MENTEE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 선택한 선호 언어의 UI 버킷으로 실시간 미리보기 (6개 외 → EN)
  const uiLang = bucketFromAzure(preferredLanguage);
  const t = useT(uiLang);
  const deptOpts = useMemo(() => departmentOptions(uiLang), [uiLang]);
  const countryOpts = useMemo(() => countryOptions(uiLang), [uiLang]);
  const langOpts = useMemo(() => languageOptions(), []);
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
        language: uiLang,
        preferredLanguage,
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
          <SearchableSelect
            label={t.department}
            placeholder={t.selectDepartment}
            modalTitle={t.selectDepartment}
            searchPlaceholder={t.searchPlaceholder}
            noResultsText={t.noResults}
            options={deptOpts}
            value={department}
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
            onSelect={setNationality}
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
          <SearchableSelect
            label={t.sectionPreferredLanguage}
            placeholder={t.selectLanguage}
            modalTitle={t.selectLanguage}
            searchPlaceholder={t.searchPlaceholder}
            noResultsText={t.noResults}
            options={langOpts}
            value={preferredLanguage}
            displayValue={languageDisplay(preferredLanguage)}
            onSelect={setPreferredLanguage}
          />

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
