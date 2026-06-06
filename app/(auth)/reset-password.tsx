import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authApi } from '@/src/api/auth';
import { useT } from '@/src/i18n';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const t = useT();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    if (code.length < 4) {
      setError(t.verifyCodeRequired);
      return;
    }
    if (newPassword.length < 8) {
      setError(t.passwordMin8Error);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, newPassword });
      setDone(true);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.resetFailed);
    } finally {
      setLoading(false);
    }
  };

  // 변경 성공 화면 (웹/네이티브 공통 — Alert 미사용)
  if (done) {
    return (
      <Screen padded>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.title}>{t.resetPasswordTitle}</Text>
          <Text style={styles.desc}>{t.resetSuccess}</Text>
          <Button
            label={t.loginLabel}
            onPress={() => router.replace('/(auth)/login')}
            fullWidth
            size="lg"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen keyboardAvoiding padded>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{t.resetPasswordTitle}</Text>
          <Text style={styles.desc}>
            <Text style={styles.bold}>{email}</Text>
            {'\n'}{t.resetPasswordDesc}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t.verifyCodeLabel}
            placeholder={t.verifyCodePlaceholder}
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />
          <Input
            label={t.newPasswordLabel}
            placeholder={t.passwordPlaceholder8}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            error={error}
          />
        </View>

        <Button
          label={t.resetPasswordLabel}
          onPress={handleReset}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing[8],
    gap: Spacing[6],
  },
  centered: { justifyContent: 'center', paddingTop: 0 },
  backButton: { alignSelf: 'flex-start' },
  backText: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: Typography.medium,
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
  bold: { fontWeight: Typography.bold, color: Colors.textPrimary },
  form: { gap: Spacing[4] },
});
