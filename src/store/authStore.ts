import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, memberApi } from '../api/auth';
import type { AuthState, LoginRequest, Profile } from '../types/auth';

interface AuthActions {
  login: (body: LoginRequest) => Promise<{ hasProfile: boolean }>;
  logout: () => Promise<void>;
  loadTokens: () => Promise<void>;
  setProfile: (profile: Profile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  refreshToken: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  loadTokens: async () => {
    try {
      const [accessToken, refreshToken] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
      ]);
      const at = accessToken[1];
      const rt = refreshToken[1];

      if (at && rt) {
        const profile = await memberApi.getMe();
        set({ accessToken: at, refreshToken: rt, profile, isAuthenticated: true });
      }
    } catch {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (body) => {
    const res = await authApi.login(body);
    await AsyncStorage.multiSet([
      ['accessToken', res.accessToken],
      ['refreshToken', res.refreshToken],
    ]);

    if (res.hasProfile) {
      const profile = await memberApi.getMe();
      set({ accessToken: res.accessToken, refreshToken: res.refreshToken, profile, isAuthenticated: true });
    } else {
      // 프로필 미완성 — profile-setup 완료 후 isAuthenticated: true 세팅
      set({ accessToken: res.accessToken, refreshToken: res.refreshToken, isAuthenticated: false });
    }

    return { hasProfile: res.hasProfile };
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {}
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    set({ accessToken: null, refreshToken: null, profile: null, isAuthenticated: false });
  },

  setProfile: (profile) => set({ profile }),

  clearAuth: () => {
    AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    set({ accessToken: null, refreshToken: null, profile: null, isAuthenticated: false });
  },
}));
