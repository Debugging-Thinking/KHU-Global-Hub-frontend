import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authApi } from '@/src/api/auth';
import { useT } from '@/src/i18n';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email) {
      setError(t.emailRequiredError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      router.push({ pathname: '/(auth)/reset-password', params: { email } });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.sendCodeFailed);
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
          <Text style={styles.title}>{t.forgotPasswordTitle}</Text>
          <Text style={styles.desc}>{t.forgotPasswordDesc}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t.khuEmail}
            placeholder="example@khu.ac.kr"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={error}
          />
        </View>

        <Button
          label={t.sendResetCodeLabel}
          onPress={handleSend}
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
  form: { gap: Spacing[4] },
});
