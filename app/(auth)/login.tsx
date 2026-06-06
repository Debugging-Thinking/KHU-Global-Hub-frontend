import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const t = useT();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t.emailPasswordRequired);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { hasProfile } = await login({ email, password });
      if (!hasProfile) {
        router.replace('/(auth)/profile-setup');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable padded style={{ backgroundColor: Colors.surface }}>
      <View style={styles.container}>
        {/* 로고 영역 */}
        <View style={styles.logoSection}>
          <View style={styles.lionBadge}>
            <Ionicons name="people" size={38} color={Colors.textInverse} />
          </View>
          <Text style={styles.appName}>KHU Global Hub</Text>
          <Text style={styles.tagline}>{t.communityTagline}</Text>
          <View style={styles.khuLine}>
            <View style={styles.crimsonBar} />
            <Text style={styles.khuText}>KYUNG HEE UNIVERSITY</Text>
            <View style={styles.crimsonBar} />
          </View>
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
          />
          <Input
            label={t.passwordLabel}
            placeholder={t.passwordPlaceholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Button
          label={t.loginLabel}
          onPress={handleLogin}
          loading={loading}
          fullWidth
          size="lg"
        />

        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          style={styles.forgotLink}
        >
          <Text style={styles.link}>{t.forgotPassword}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.noAccount}</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>{t.signUp}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing[6],
  },
  logoSection: {
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  lionBadge: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
    ...Shadow.lg,
  },
  appName: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  khuLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginTop: Spacing[1],
  },
  crimsonBar: {
    height: 1.5,
    width: 24,
    backgroundColor: Colors.accent,
  },
  khuText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.accent,
    letterSpacing: 1.5,
  },
  form: { gap: Spacing[4] },
  forgotLink: { alignSelf: 'center' },
  error: {
    fontSize: Typography.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[1],
  },
  footerText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  link: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
});
