import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useAuthStore } from '@/src/store/authStore';

export const unstable_settings = {
  anchor: '(main)',
};

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadTokens } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 앱 시작 시 저장된 토큰 로드
  useEffect(() => {
    loadTokens();
  }, []);

  // 인증 상태에 따른 라우팅 가드
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
      <StatusBar style="dark" />
    </>
  );
}
