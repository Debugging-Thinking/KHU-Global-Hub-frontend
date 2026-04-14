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

  const isNewStudent = admissionYear === CURRENT_YEAR;

  const handleSubmit = async () => {
    if (!name || !department || !nationality) {
      setError('모든 항목을 입력해주세요.');
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

      // isAuthenticated는 이미 true — 가드가 main으로 이동시킴
      const { useAuthStore: store } = await import('@/src/store/authStore');
      store.setState({ isAuthenticated: true });
      router.replace('/(main)');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '프로필 생성에 실패했습니다.');
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
          <Text style={styles.title}>프로필 설정</Text>
          <Text style={styles.desc}>
            KHU Global Hub에 오신 걸 환영합니다!{'\n'}
            프로필을 완성해주세요.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="이름"
            placeholder="이름을 입력하세요"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="학과"
            placeholder="예: 컴퓨터공학과"
            value={department}
            onChangeText={setDepartment}
          />
          <Input
            label="국적"
            placeholder="국적을 입력하세요"
            value={nationality}
            onChangeText={setNationality}
          />

          {/* 입학년도 */}
          <View>
            <Text style={styles.sectionLabel}>입학년도</Text>
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
              <Text style={styles.hint}>신입생은 멘티로 자동 배정됩니다</Text>
            ) : (
              <View style={styles.roleRow}>
                {(['MENTEE', 'MENTOR'] as MentoringRole[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setMentoringRole(r)}
                    style={[styles.chip, mentoringRole === r && styles.chipActive, styles.roleChip]}
                  >
                    <Text style={[styles.chipText, mentoringRole === r && styles.chipTextActive]}>
                      {r === 'MENTEE' ? '멘티' : '멘토'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 언어 선택 */}
          <View>
            <Text style={styles.sectionLabel}>선호 언어</Text>
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
          label="시작하기"
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
