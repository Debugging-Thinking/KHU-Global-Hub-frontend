/**
 * countries.ts 라벨의 VI/UZ/MN을 KO 원문에서 Azure로 보강해 재생성한다.
 * (KO/EN/ZH는 데이터 소스 제공 → 그대로 유지)
 *
 * 실행 (frontend 폴더에서, Azure 키 주입):
 *   AZURE_TRANSLATOR_KEY=... AZURE_REGION=koreacentral npx tsx scripts/translate-data.ts
 */
import { writeFileSync } from 'fs';
import { COUNTRIES } from '../src/data/countries';

type AddLang = 'VI' | 'UZ' | 'MN';
const AZ: Record<AddLang, string> = { VI: 'vi', UZ: 'uz', MN: 'mn-Cyrl' };
const ADD: AddLang[] = ['VI', 'UZ', 'MN'];

const KEY = process.env.AZURE_TRANSLATOR_KEY;
const REGION = process.env.AZURE_REGION || 'koreacentral';
const ENDPOINT = 'https://api.cognitive.microsofttranslator.com';
if (!KEY) { console.error('AZURE_TRANSLATOR_KEY env 미설정'); process.exit(1); }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** KO 텍스트 배열 → 지정 언어들로 번역 (F0 rate limit backoff/throttle). */
async function translateBatch(texts: string[], toLangs: AddLang[]): Promise<Record<string, string>[]> {
  const out: Record<string, string>[] = [];
  const toParams = toLangs.map((l) => `to=${AZ[l]}`).join('&');
  for (let i = 0; i < texts.length; i += 25) {
    const chunk = texts.slice(i, i + 25);
    let data: any = null;
    for (let attempt = 0; attempt < 6; attempt++) {
      const res = await fetch(`${ENDPOINT}/translate?api-version=3.0&from=ko&${toParams}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': KEY!,
          'Ocp-Apim-Subscription-Region': REGION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk.map((t) => ({ Text: t }))),
      });
      data = await res.json();
      if (Array.isArray(data)) break;
      if (data?.error?.code === 429001) { await sleep(4000 * (attempt + 1)); continue; }
      throw new Error('Azure 응답 오류: ' + JSON.stringify(data));
    }
    if (!Array.isArray(data)) throw new Error('429 재시도 초과');
    for (const item of data) {
      const m: Record<string, string> = {};
      item.translations.forEach((tr: any, idx: number) => { m[toLangs[idx]] = tr.text; });
      out.push(m);
    }
    process.stdout.write(`  ${Math.min(i + 25, texts.length)}/${texts.length}\r`);
    await sleep(1500);
  }
  process.stdout.write('\n');
  return out;
}

async function main() {
  const ko = COUNTRIES.map((c) => c.label.KO);
  console.log(`[countries] ${ko.length} strings → ${ADD.join('/')}`);
  const tr = await translateBatch(ko, ADD);

  const arr = COUNTRIES.map((c, i) => ({
    code: c.code,
    label: { KO: c.label.KO, EN: c.label.EN, ZH: c.label.ZH, ...tr[i] },
  }));

  const ts =
`// auto-generated (scripts/fetch-countries.ts + scripts/translate-data.ts). DO NOT EDIT BY HAND.
// Nationality search dropdown options. ISO 3166-1 alpha-2 code stored; localized per viewer language.

import type { LocalizedLabel } from './labels';

export interface Country { code: string; label: LocalizedLabel; }

export const COUNTRIES: Country[] = ${JSON.stringify(arr, null, 2)};
`;
  writeFileSync(new URL('../src/data/countries.ts', import.meta.url), ts, 'utf8');
  console.log(`✅ countries.ts 라벨 보강 완료 (${arr.length})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
