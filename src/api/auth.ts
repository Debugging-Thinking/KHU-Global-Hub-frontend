import { Platform } from 'react-native';
import apiClient, { unwrap } from './client';
import type {
  AuthResponse,
  LoginRequest,
  ProfileSetupRequest,
  RegisterRequest,
  VerifyEmailRequest,
  Profile,
} from '../types/auth';
import type { ImagePickerAsset } from 'expo-image-picker';

export const authApi = {
  register: (body: RegisterRequest) =>
    apiClient.post('/auth/register', body).then(unwrap<null>),

  verifyEmail: (body: VerifyEmailRequest) =>
    apiClient.post('/auth/verify-email', body).then(unwrap<AuthResponse>),

  setupProfile: (body: ProfileSetupRequest) =>
    apiClient.post('/auth/profile', body).then(unwrap<null>),

  login: (body: LoginRequest) =>
    apiClient.post('/auth/login', body).then(unwrap<AuthResponse>),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }).then(unwrap<{ accessToken: string }>),

  logout: () =>
    apiClient.post('/auth/logout').then(unwrap<null>),
};

export const memberApi = {
  getMe: () =>
    apiClient.get('/members/me').then(unwrap<Profile>),

  updateMe: (body: Partial<ProfileSetupRequest>) =>
    apiClient.put('/members/me', body).then(unwrap<Profile>),

  updateProfileImage: async (asset: ImagePickerAsset): Promise<Profile> => {
    const form = new FormData();
    if (Platform.OS === 'web') {
      // 웹: file 객체가 있으면 바로 사용, 없으면 blob URL fetch해서 변환
      const file = (asset as any).file;
      if (file) {
        form.append('image', file);
      } else {
        const res = await fetch(asset.uri);
        const blob = await res.blob();
        form.append('image', blob, 'profile.jpg');
      }
      // 웹: Content-Type 수동 설정 금지 → 브라우저가 boundary 포함해서 자동 설정
      return apiClient.patch('/members/me/profile-image', form).then(unwrap<Profile>);
    } else {
      form.append('image', { uri: asset.uri, type: 'image/jpeg', name: 'profile.jpg' } as any);
      return apiClient.patch('/members/me/profile-image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(unwrap<Profile>);
    }
  },
};
