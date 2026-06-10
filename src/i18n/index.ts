import { useAuthStore } from '../store/authStore';
import { translations, type Language, type T } from './translations';

export type { Language, T };

/**
 * 현재 유저의 언어 설정에 맞는 번역 객체를 반환하는 훅.
 * @param override 선택적 언어 오버라이드 (프로필 설정 화면 등에서 사용)
 */
export function useT(override?: Language): T {
  // profile.language는 6개 버킷(6개 외 사용자는 EN). 미설정/누락 시 EN 폴백.
  const language = useAuthStore((s) => s.profile?.language ?? 'EN') as Language;
  return translations[override ?? language] ?? translations.EN;
}

/** 현재 유저의 언어 코드만 반환 (정적 콘텐츠 L10n 선택용). 미설정 시 KO. */
export function useLanguage(): Language {
  return useAuthStore((s) => s.profile?.language ?? 'KO') as Language;
}

/** 뱃지 ID → 현지화된 뱃지 이름. */
export function badgeName(t: T, id: string): string {
  switch (id) {
    case 'COURSE_REG': return t.badgeCourseReg;
    case 'TRANSPORT': return t.badgeTransport;
    case 'FOOD': return t.badgeFood;
    case 'CAMPUS_SITE': return t.badgeCampusSite;
    case 'HUMANITIES': return t.badgeHumanities;
    default: return id;
  }
}

/**
 * 백엔드 LocalDateTime(타임존 표식 없는 UTC 시각)을 UTC로 명시 파싱한다.
 * 서버 JVM이 UTC라 createdAt은 "2026-06-10T05:01:24"처럼 Z 없이 직렬화되는데,
 * new Date()는 이를 브라우저 로컬(KST)로 해석해 9시간 어긋난다. → Z를 붙여 UTC로 고정.
 * 이미 타임존(Z 또는 ±hh:mm)이 있는 문자열은 그대로 둔다.
 */
export function parseServerDate(dateStr: string): Date {
  const hasTz = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(dateStr);
  return new Date(hasTz ? dateStr : dateStr + 'Z');
}

/**
 * 날짜 문자열을 "N분 전" 형식으로 변환.
 * short=true이면 "N분" 형식 (채팅 목록용).
 */
export function timeAgo(dateStr: string, t: T, short = false): string {
  const diff = Date.now() - parseServerDate(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return short ? t.justNowShort : t.justNow;
  if (mins < 60) return short ? t.minsAgoShort(mins) : t.minsAgo(mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return short ? t.hoursAgoShort(hours) : t.hoursAgo(hours);
  return short ? t.daysAgoShort(Math.floor(hours / 24)) : t.daysAgo(Math.floor(hours / 24));
}
