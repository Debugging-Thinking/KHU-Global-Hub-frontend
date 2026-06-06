/**
 * 로컬 퀴즈 헬퍼 (언어 인식).
 * quizQuestions.ts(L10n 구조, 자동 생성)를 현재 언어의 평문으로 변환한다.
 * 별도 파일로 둔 이유: quizQuestions.ts는 번역 스크립트/에이전트가 재생성하므로 헬퍼를 분리.
 */
import { LOCAL_QUIZ_QUESTIONS, type L10n } from './quizQuestions';
import type { Language } from '../types/board';
import type { QuizQuestion, QuizSubmitResponse } from '../types/quiz';

const pick = (m: L10n, lang: Language): string => m[lang] ?? m.EN ?? m.KO;

/** 로컬 퀴즈를 현재 언어의 평문 QuizQuestion[]로 변환 (category 비면 전체). */
export function getLocalQuestions(category: string | undefined, lang: Language): QuizQuestion[] {
  const src = category
    ? LOCAL_QUIZ_QUESTIONS.filter((q) => q.category === category)
    : LOCAL_QUIZ_QUESTIONS;
  return src.map((q) => ({
    id: q.id,
    category: q.category,
    question: pick(q.question, lang),
    options: q.options.map((o) => pick(o, lang)),
  }));
}

/** 로컬 채점 (백엔드 제출 실패 시 폴백). 해설은 현재 언어. */
export function gradeLocally(
  answers: { questionId: number; selectedOption: number }[],
  lang: Language,
): QuizSubmitResponse {
  const map = Object.fromEntries(LOCAL_QUIZ_QUESTIONS.map((q) => [q.id, q]));
  let correct = 0;
  const results = answers.map((a) => {
    const q = map[a.questionId];
    const isCorrect = q ? q.answer === a.selectedOption : false;
    if (isCorrect) correct++;
    return {
      questionId: a.questionId,
      correct: isCorrect,
      correctAnswer: q?.answer ?? 0,
      explanation: q ? pick(q.explanation, lang) : '',
    };
  });
  const total = results.length;
  const score = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;
  return { correctCount: correct, totalCount: total, score, results };
}
