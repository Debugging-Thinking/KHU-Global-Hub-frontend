import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authApi, memberApi } from '@/src/api/auth';
import { useAuthStore } from '@/src/store/authStore';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (code.length < 4) {
      setError('인증 코드를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyEmail({ email, code });
      // 토큰 저장 후 다음 단계로
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
      setError(e?.response?.data?.message ?? '인증에 실패했습니다. 코드를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboardAvoiding padded>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← 돌아가기</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>이메일 인증</Text>
          <Text style={styles.desc}>
            <Text style={styles.bold}>{email}</Text>
            {'\n'}으로 발송된 인증 코드를 입력해주세요.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="인증 코드"
            placeholder="인증 코드 6자리"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            error={error}
          />
        </View>

        <Button
          label="인증하기"
          onPress={handleVerify}
          loading={loading}
          fullWidth
          size="lg"
        />

        <TouchableOpacity style={styles.resend}>
          <Text style={styles.resendText}>코드를 받지 못했나요? 재발송</Text>
        </TouchableOpacity>
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
  bold: { fontWeight: Typography.bold, color: Colors.textPrimary },
  form: { gap: Spacing[4] },
  resend: { alignSelf: 'center' },
  resendText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
});
