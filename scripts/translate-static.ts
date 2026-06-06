/**
 * 정적 콘텐츠(가이드/퀴즈) 사전번역 스크립트.
 *
 * KO 원문을 Azure Translator로 6개국(KO/EN/ZH/VI/UZ/MN) 번역해
 * src/data/khuGuide.ts, src/data/quizQuestions.ts 를 L10n 구조로 재생성한다.
 * - 가이드: 사람이 쓴 EN은 유지, KO→ZH/VI/UZ/MN 만 추가.
 * - 퀴즈: KO만 있으므로 KO→EN/ZH/VI/UZ/MN 추가.
 *
 * 실행 (frontend 폴더에서, Azure 키를 env로 주입):
 *   AZURE_TRANSLATOR_KEY=... AZURE_REGION=koreacentral npx tsx scripts/translate-static.ts
 * 키는 Key.txt에서 로드해 주입 (스크립트/데이터에 키 미포함).
 */
import { writeFileSync } from 'fs';
import { KHU_GUIDE } from '../src/data/khuGuide';
import { LOCAL_QUIZ_QUESTIONS } from '../src/data/quizQuestions';

type Lang = 'KO' | 'EN' | 'ZH' | 'VI' | 'UZ' | 'MN';
const AZ: Record<Lang, string> = { KO: 'ko', EN: 'en', ZH: 'zh-Hans', VI: 'vi', UZ: 'uz', MN: 'mn-Cyrl' };

const KEY = process.env.AZURE_TRANSLATOR_KEY;
const REGION = process.env.AZURE_REGION || 'koreacentral';
const ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

if (!KEY) { console.error('AZURE_TRANSLATOR_KEY env 미설정'); process.exit(1); }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** KO 텍스트 배열을 지정 언어들로 번역. 429(rate limit) 시 backoff 재시도 + 배치 간 throttle. */
async function translateBatch(texts: string[], toLangs: Lang[]): Promise<Record<string, string>[]> {
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
      if (data?.error?.code === 429001) { await sleep(4000 * (attempt + 1)); continue; } // F0 rate limit backoff
      throw new Error('Azure 응답 오류: ' + JSON.stringify(data));
    }
    if (!Array.isArray(data)) throw new Error('429 재시도 초과');
    for (const item of data) {
      const m: Record<string, string> = {};
      item.translations.forEach((tr: any, idx: number) => { m[toLangs[idx]] = tr.text; });
      out.push(m);
    }
    process.stdout.write(`  translated ${Math.min(i + 25, texts.length)}/${texts.length}\r`);
    await sleep(1500); // 배치 간 throttle (F0 rate limit 회피)
  }
  process.stdout.write('\n');
  return out;
}

const ADD: Lang[] = ['ZH', 'VI', 'UZ', 'MN']; // 가이드: KO/EN 외 추가
const ADD_Q: Lang[] = ['EN', 'ZH', 'VI', 'UZ', 'MN']; // 퀴즈: KO 외 추가

async function main() {
  // ── 1) 가이드: 모든 번역 대상 KO 문자열 수집 (카테고리 제목 + 팁 제목/본문) ──
  const guideKO: string[] = [];
  for (const cat of KHU_GUIDE) {
    guideKO.push(cat.titleKO);
    for (const tip of cat.tips) { guideKO.push(tip.titleKO); guideKO.push(tip.contentKO); }
  }
  console.log(`[guide] ${guideKO.length} strings → ${ADD.join('/')}`);
  const guideTr = await translateBatch(guideKO, ADD);

  let gi = 0;
  const guideOut = KHU_GUIDE.map((cat) => {
    const catTitle = { KO: cat.titleKO, EN: cat.titleEN, ...guideTr[gi++] };
    const tips = cat.tips.map((tip) => {
      const title = { KO: tip.titleKO, EN: tip.titleEN, ...guideTr[gi++] };
      const content = { KO: tip.contentKO, EN: tip.contentEN, ...guideTr[gi++] };
      return { icon: tip.icon, title, content, ...(tip.link ? { link: tip.link } : {}) };
    });
    return { id: cat.id, title: catTitle, emoji: cat.emoji, color: cat.color, tips };
  });

  // ── 2) 퀴즈: question / options[] / explanation 수집 ──
  const quizKO: string[] = [];
  for (const q of LOCAL_QUIZ_QUESTIONS) {
    quizKO.push(q.question);
    for (const o of q.options) quizKO.push(o);
    quizKO.push(q.explanation);
  }
  console.log(`[quiz] ${quizKO.length} strings → ${ADD_Q.join('/')}`);
  const quizTr = await translateBatch(quizKO, ADD_Q);

  let qi = 0;
  const quizOut = LOCAL_QUIZ_QUESTIONS.map((q) => {
    const question = { KO: q.question, ...quizTr[qi++] };
    const options = q.options.map((o) => ({ KO: o, ...quizTr[qi++] }));
    const explanation = { KO: q.explanation, ...quizTr[qi++] };
    return { id: q.id, category: q.category, question, options, answer: q.answer, explanation };
  });

  // ── 3) TS 파일로 출력 (UTF-8) ──
  const guideTs =
`import type { BadgeId } from '../types/badge';
import type { Language } from '../types/board';

export type L10n = Record<Language, string>;

export interface GuideTip { icon: string; title: L10n; content: L10n; link?: string; }
export interface GuideCategory { id: BadgeId; title: L10n; emoji: string; color: string; tips: GuideTip[]; }

// ⚠️ 자동 생성 (scripts/translate-static.ts). KO/EN은 사람 작성, ZH/VI/UZ/MN은 Azure 번역(네이티브 검수 권장).
export const KHU_GUIDE: GuideCategory[] = ${JSON.stringify(guideOut, null, 2)};
`;
  writeFileSync(new URL('../src/data/khuGuide.ts', import.meta.url), guideTs, 'utf8');

  const quizTs =
`import type { BadgeId } from '../types/badge';
import type { Language } from '../types/board';

export type L10n = Record<Language, string>;

export interface LocalQuizQuestion {
  id: number;
  category: BadgeId;
  question: L10n;
  options: L10n[];
  answer: number;
  explanation: L10n;
}

// ⚠️ 자동 생성 (scripts/translate-static.ts). KO는 사람 작성, 나머지는 Azure 번역(네이티브 검수 권장).
export const LOCAL_QUIZ_QUESTIONS: LocalQuizQuestion[] = ${JSON.stringify(quizOut, null, 2)};
`;
  writeFileSync(new URL('../src/data/quizQuestions.ts', import.meta.url), quizTs, 'utf8');

  console.log('✅ khuGuide.ts / quizQuestions.ts 재생성 완료');
}

main().catch((e) => { console.error(e); process.exit(1); });
