import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authApi } from '@/src/api/auth';
import { useT } from '@/src/i18n';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email.endsWith('@khu.ac.kr')) {
      setError(t.khuEmailOnly);
      return;
    }
    if (password.length < 8) {
      setError(t.passwordMin8Error);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.register({ email, password });
      router.push({ pathname: '/(auth)/verify-email', params: { email } });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.emailSendFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboardAvoiding padded>
      <View style={styles.container}>
        {/* 뒤로가기 */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>

        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.registerTitle}</Text>
          <Text style={styles.desc}>{t.registerDesc}</Text>
        </View>

        {/* 폼 */}
        <View style={styles.form}>
          <Input
            label={t.khuEmail}
            placeholder="example@khu.ac.kr"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            hint={t.khuEmailOnly}
          />
          <Input
            label={t.passwordLabel}
            placeholder={t.passwordPlaceholder8}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={error}
          />
        </View>

        <Button
          label={t.getVerifyCode}
          onPress={handleSendCode}
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
