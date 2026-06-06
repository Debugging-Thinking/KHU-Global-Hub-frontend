import type { SelectOption } from '../components/ui/SearchableSelect';
import type { Language } from '../types/auth';
import { COUNTRIES } from './countries';
import { DEPARTMENTS } from './departments';
import { AZURE_LANGUAGES } from './azureLanguages';
import { pickLabel } from './labels';
import { SIX_AZURE_CODES } from '../i18n/preferredLanguage';

/** 학과 드롭다운 옵션 (보는 사람 언어로 라벨, 단과대학 부제, KO/EN 검색). */
export function departmentOptions(lang: Language): SelectOption[] {
  return DEPARTMENTS.map((d) => ({
    value: d.code,
    label: pickLabel(d.label, lang),
    subtitle: pickLabel(d.college, lang),
    searchText: `${d.label.KO} ${d.label.EN} ${d.college.EN}`,
  }));
}

/** 국적 드롭다운 옵션 (보는 사람 언어로 라벨, KO/EN/코드 검색). */
export function countryOptions(lang: Language): SelectOption[] {
  return COUNTRIES.map((c) => ({
    value: c.code,
    label: pickLabel(c.label, lang),
    searchText: `${c.label.KO} ${c.label.EN} ${c.code}`,
  }));
}

const labelOf = (l: { name: string; nativeName: string }) =>
  l.nativeName === l.name ? l.name : `${l.nativeName} (${l.name})`;

/** 선호 언어 드롭다운 옵션 — 6개 기본 언어를 상단 고정, 나머지는 이름순. */
export function languageOptions(): SelectOption[] {
  const pinned = SIX_AZURE_CODES
    .map((code) => AZURE_LANGUAGES.find((l) => l.code === code))
    .filter((l): l is (typeof AZURE_LANGUAGES)[number] => !!l);
  const rest = AZURE_LANGUAGES.filter((l) => !SIX_AZURE_CODES.includes(l.code));
  return [...pinned, ...rest].map((l) => ({
    value: l.code,
    label: labelOf(l),
    searchText: `${l.name} ${l.nativeName} ${l.code}`,
  }));
}

/** 선택된 선호 언어 코드의 표시 라벨 (nativeName (name)). 알 수 없으면 코드 그대로. */
export function languageDisplay(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  const l = AZURE_LANGUAGES.find((x) => x.code === code);
  return l ? labelOf(l) : code;
}
