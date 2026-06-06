/**
 * 국가 목록(ISO alpha-2 + KO/EN/ZH 라벨)을 받아 src/data/countries.ts 를 재생성한다.
 * 출처: restcountries.com (키 불필요). 실행: npx tsx scripts/fetch-countries.ts
 * VI/UZ/MN 라벨은 scripts/translate-data.ts 로 보강(미보강 시 EN 폴백).
 */
import { writeFileSync } from 'fs';

async function main() {
  const res = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name,translations');
  const data: any[] = await res.json();
  const arr = data
    .filter((x) => x.cca2)
    .map((x) => ({
      code: x.cca2 as string,
      label: {
        KO: x.translations?.kor?.common ?? x.name.common,
        EN: x.name.common as string,
        ZH: x.translations?.zho?.common ?? x.name.common,
      },
    }))
    .sort((a, b) => a.label.EN.localeCompare(b.label.EN));

  const ts =
`// auto-generated (scripts/fetch-countries.ts, source: restcountries.com). DO NOT EDIT BY HAND.
// Nationality search dropdown options. ISO 3166-1 alpha-2 code stored; localized per viewer language.
// KO/EN/ZH from source; VI/UZ/MN backfilled by scripts/translate-data.ts (EN fallback until then).

import type { LocalizedLabel } from './labels';

export interface Country { code: string; label: LocalizedLabel; }

export const COUNTRIES: Country[] = ${JSON.stringify(arr, null, 2)};
`;
  writeFileSync(new URL('../src/data/countries.ts', import.meta.url), ts, 'utf8');
  console.log(`✅ countries.ts (${arr.length} countries)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
