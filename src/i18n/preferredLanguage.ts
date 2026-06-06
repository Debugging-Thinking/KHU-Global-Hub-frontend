import type { Language } from '../types/auth';

/**
 * 선호 언어(Azure 코드) ↔ 6개 기본 언어(enum) 매핑 및 모드 판별.
 * 백엔드 MemberService.toBucket 과 동일한 "엄격 매칭" 규칙을 따른다.
 */

/** 6개 기본 언어 enum → Azure 코드 (프로필 제출 시 버킷용 language 동봉). */
export const ENUM_TO_AZURE: Record<Language, string> = {
  KO: 'ko',
  EN: 'en',
  ZH: 'zh-Hans',
  VI: 'vi',
  UZ: 'uz',
  MN: 'mn-Cyrl',
};

/** 6개 기본 언어 Azure 코드(소문자) → enum. */
const SIX_AZURE: Record<string, Language> = {
  ko: 'KO',
  en: 'EN',
  'zh-hans': 'ZH',
  vi: 'VI',
  uz: 'UZ',
  'mn-cyrl': 'MN',
};

/** 6개 기본 언어 Azure 코드 집합 (UI 상단 고정/모드 판별용). */
export const SIX_AZURE_CODES = ['ko', 'en', 'zh-Hans', 'vi', 'uz', 'mn-Cyrl'];

/** Azure 코드 → UI 버킷. 6개 중 정확히 일치하면 그 언어, 그 외면 EN. */
export function bucketFromAzure(code: string | null | undefined): Language {
  if (!code) return 'EN';
  return SIX_AZURE[code.toLowerCase()] ?? 'EN';
}

/**
 * 사전번역(6개) 모드 여부.
 * true → 콘텐츠 사전번역본 + 원문/번역 토글(기존 동작).
 * false → 정적 UI=영어, 콘텐츠=원문 + "번역하기" on-demand.
 */
export function isPrestoredMode(code: string | null | undefined): boolean {
  return !!code && code.toLowerCase() in SIX_AZURE;
}
