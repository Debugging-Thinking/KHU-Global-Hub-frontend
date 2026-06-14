export type Language = 'KO' | 'EN' | 'ZH' | 'VI' | 'UZ' | 'MN';
export type MentoringRole = 'MENTOR' | 'MENTEE' | 'NONE';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ProfileSetupRequest {
  name: string;
  department: string;
  nationality: string;
  admissionYear: number;
  language: Language;
  /** 실제 선호 언어 Azure 코드 (6개 외 포함, 예 'fr'). 백엔드가 language(버킷)를 파생. */
  preferredLanguage: string;
  mentoringRole: MentoringRole;
  /** 자기소개 (선택, 최대 500자). */
  bio?: string | null;
  /** UI 테마 선호 ("LIGHT" | "DARK"). 미입력 시 백엔드가 LIGHT 처리. */
  theme?: 'LIGHT' | 'DARK';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  hasProfile: boolean;
  /** 관리자 계정 여부 — 관리자 모드 진입 분기용. */
  isAdmin?: boolean;
}

export interface Profile {
  memberId: number;
  email: string;
  name: string;
  department: string;
  nationality: string;
  admissionYear: number;
  /** UI 버킷 (6개 중 하나, 6개 외 사용자는 EN). 정적 UI 언어 선택용. */
  language: Language;
  /** 실제 선호 언어 Azure 코드 (on-demand 번역 목표 언어, 모드 판별용). */
  preferredLanguage: string;
  mentoringRole: MentoringRole;
  profileImageUrl: string | null;
  /** 자기소개 (선택, 최대 500자). */
  bio?: string | null;
  /** UI 테마 선호 ("LIGHT" | "DARK"). 다크모드 동기화용. */
  theme?: 'LIGHT' | 'DARK';
  /** 관리자 계정 여부 — 관리자 모드 화면 분기용. */
  isAdmin?: boolean;
  /** 계정 활성 여부 (false = 정지됨). 관리자 정지 토글용. */
  isActive?: boolean;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
