import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API 서버 주소.
// - 기본값(개발): 로컬 백엔드 http://localhost:8080 — 별도 설정 없이 로컬 풀스택 개발이 바로 동작.
// - 운영/배포 빌드: `expo export` 전에 EXPO_PUBLIC_API_URL=http://{운영IP}:8080 을 반드시 주입할 것!
//   (미주입 시 배포본이 localhost를 가리켜 동작 안 함. HTTP라 Android는 usesCleartextTraffic 필요.)
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 — accessToken 자동 첨부
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 — 401 시 자동 토큰 갱신
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('no refresh token');

        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        const newToken: string = data.data.accessToken;

        await AsyncStorage.setItem('accessToken', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        // 갱신 실패 → 토큰 삭제 후 로그인으로
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        // 스토어에서 로그아웃 트리거는 authStore가 처리
      }
    }
    return Promise.reject(error);
  }
);

// 공통 응답 언래퍼
export function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

export default apiClient;
