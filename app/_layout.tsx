import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useAuthStore } from '@/src/store/authStore';
import { useThemeStore, schemeFromTheme } from '@/src/theme';

export const unstable_settings = {
  anchor: '(main)',
};

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadTokens } = useAuthStore();
  const profileTheme = useAuthStore((s) => s.profile?.theme);
  const scheme = useThemeStore((s) => s.scheme);
  const setScheme = useThemeStore((s) => s.setScheme);
  const segments = useSegments();
  const router = useRouter();

  // 앱 시작 시 저장된 토큰 로드
  useEffect(() => {
    loadTokens();
  }, []);

  // 프로필의 theme(LIGHT|DARK)에 맞춰 전역 스킴 동기화 (로그인/프로필 갱신 시)
  useEffect(() => {
    setScheme(schemeFromTheme(profileTheme));
  }, [profileTheme]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(main)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
