import type { Language } from '../types/board';
import { COUNTRIES } from './countries';
import { DEPARTMENTS } from './departments';

/**
 * 코드 기반 라벨. KO/EN은 필수, 나머지 6개 언어는 선택(미보강 시 EN→KO 폴백).
 * 학과/국적은 안정적 코드로 저장하고 보는 사람 언어로 현지화 표시한다.
 */
export type LocalizedLabel = { KO: string; EN: string } & Partial<Record<Language, string>>;

/** 사용자 언어로 라벨 선택. 해당 언어 없으면 EN, 그것도 없으면 KO. */
export function pickLabel(label: LocalizedLabel, lang: Language): string {
  return label[lang] ?? label.EN ?? label.KO;
}

const COUNTRY_MAP: Record<string, LocalizedLabel> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.label]),
);
const DEPARTMENT_MAP: Record<string, LocalizedLabel> = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.code, d.label]),
);

/**
 * 저장된 국적 값을 보는 사람 언어로 변환.
 * 값이 알려진 ISO 코드면 현지화, 아니면(레거시 자유텍스트) 원문 그대로 반환.
 */
export function countryLabel(value: string | null | undefined, lang: Language): string {
  if (!value) return '';
  const label = COUNTRY_MAP[value];
  return label ? pickLabel(label, lang) : value;
}

/** 저장된 학과 값을 보는 사람 언어로 변환. 코드가 아니면 원문 그대로(레거시 호환). */
export function departmentLabel(value: string | null | undefined, lang: Language): string {
  if (!value) return '';
  const label = DEPARTMENT_MAP[value];
  return label ? pickLabel(label, lang) : value;
}
