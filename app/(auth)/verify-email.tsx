import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authApi, memberApi } from '@/src/api/auth';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { Spacing, Typography, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/src/theme';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const t = useT();
  const styles = useThemedStyles(makeStyles);
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (code.length < 4) {
      setError(t.verifyCodeRequired);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyEmail({ email, code });
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.multiSet([
        ['accessToken', res.accessToken],
        ['refreshToken', res.refreshToken],
      ]);

      if (!res.hasProfile) {
        router.replace('/(auth)/profile-setup');
      } else {
        const profile = await memberApi.getMe();
        useAuthStore.setState({ isAuthenticated: true, profile });
        router.replace('/(main)');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.verifyFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboardAvoiding padded>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{t.verifyEmailTitle}</Text>
          <Text style={styles.desc}>
            <Text style={styles.bold}>{email}</Text>
            {'\n'}{t.verifyEmailDesc('')}
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
            error={error}
          />
        </View>

        <Button
          label={t.verifyLabel}
          onPress={handleVerify}
          loading={loading}
          fullWidth
          size="lg"
        />

        <TouchableOpacity style={styles.resend}>
          <Text style={styles.resendText}>{t.resend}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing[8],
    gap: Spacing[6],
  },
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
  resend: { alignSelf: 'center' },
  resendText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
});
