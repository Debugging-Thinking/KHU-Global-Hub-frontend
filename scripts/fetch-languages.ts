/**
 * Azure Translator 지원 언어 목록을 받아 src/data/azureLanguages.ts 를 재생성한다.
 * 키 불필요(공개 엔드포인트). 실행: npx tsx scripts/fetch-languages.ts
 */
import { writeFileSync } from 'fs';

const ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

async function main() {
  const res = await fetch(`${ENDPOINT}/languages?api-version=3.0&scope=translation`);
  const data: any = await res.json();
  const langs = Object.entries<any>(data.translation)
    .map(([code, v]) => ({ code, name: v.name, nativeName: v.nativeName, dir: v.dir }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const ts =
`// auto-generated (scripts/fetch-languages.ts). DO NOT EDIT BY HAND.
// Azure Translator full translation language list (GET /languages?scope=translation).

export interface AzureLanguage { code: string; name: string; nativeName: string; dir: 'ltr' | 'rtl'; }

export const AZURE_LANGUAGES: AzureLanguage[] = ${JSON.stringify(langs, null, 2)};
`;
  writeFileSync(new URL('../src/data/azureLanguages.ts', import.meta.url), ts, 'utf8');
  console.log(`✅ azureLanguages.ts (${langs.length} languages)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
