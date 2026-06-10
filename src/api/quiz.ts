import apiClient, { unwrap } from './client';
import type { MyQuizResult, QuizAnswerItem, QuizQuestion, QuizSubmitResponse } from '../types/quiz';
import type { Language } from '../types/board';

export const quizApi = {
  /** 문항 목록 조회. language로 번역 선택, category(badgeKey)로 필터(생략 시 전체). */
  getQuestions: (language: Language, category?: string) =>
    apiClient
      .get('/quiz/questions', { params: { language, ...(category ? { category } : {}) } })
      .then(unwrap<QuizQuestion[]>),

  /** 답안 제출 → 백엔드 채점. language는 해설(explanation) 언어 선택. */
  submit: (answers: QuizAnswerItem[], language: Language) =>
    apiClient
      .post('/quiz/submit', { answers, language })
      .then(unwrap<QuizSubmitResponse>),

  getMyResults: () =>
    apiClient.get('/quiz/results/me').then(unwrap<MyQuizResult[]>),

  getMyBestScore: () =>
    apiClient.get('/quiz/score/me').then(unwrap<number>),
};
