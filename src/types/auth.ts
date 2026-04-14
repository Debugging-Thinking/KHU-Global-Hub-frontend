export type Language = 'KO' | 'EN' | 'ZH' | 'VI' | 'ES' | 'MN';
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

export interface ProfileSetupRequest {
  name: string;
  department: string;
  nationality: string;
  admissionYear: number;
  language: Language;
  mentoringRole: MentoringRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  hasProfile: boolean;
}

export interface Profile {
  memberId: number;
  email: string;
  name: string;
  department: string;
  nationality: string;
  admissionYear: number;
  language: Language;
  mentoringRole: MentoringRole;
  profileImageUrl: string | null;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
