import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authApi } from '@/src/api/auth';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email.endsWith('@khu.ac.kr')) {
      setError('@khu.ac.kr 이메일만 가입 가능합니다.');
      return;
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.register({ email, password });
      router.push({ pathname: '/(auth)/verify-email', params: { email } });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '이메일 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboardAvoiding padded>
      <View style={styles.container}>
        {/* 뒤로가기 */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← 돌아가기</Text>
        </TouchableOpacity>

        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.desc}>
            경희대학교 이메일로 인증 코드를 받아{'\n'}
            계정을 만들어보세요.
          </Text>
        </View>

        {/* 폼 */}
        <View style={styles.form}>
          <Input
            label="경희대 이메일"
            placeholder="example@khu.ac.kr"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            hint="@khu.ac.kr 이메일만 가입 가능합니다"
          />
          <Input
            label="비밀번호"
            placeholder="8자 이상 입력하세요"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={error}
          />
        </View>

        <Button
          label="인증 코드 받기"
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
