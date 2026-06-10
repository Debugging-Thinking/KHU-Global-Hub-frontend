import apiClient, { unwrap } from './client';
import type { Language } from '../types/board';

// 관리자 전용 퀴즈 문항 운영 API (백엔드 AdminGuard로 관리자만 허용).
// 폼 입력/저장은 전부 KO 원문 기준 — 백엔드가 KO 저장 후 나머지 5개 언어를 자동 사전번역한다.
// (adminGuide.ts와 동일 스타일)

/**
 * 퀴즈 문항 생성/수정 요청 (백엔드 AdminQuizQuestionRequest).
 * category/answerIndex는 메타, question/options/explanation은 원문(KO) 번역 행으로 저장.
 */
export interface AdminQuizQuestionBody {
  category: string;       // badgeKey (COURSE_REG/TRANSPORT/FOOD/CAMPUS_SITE/HUMANITIES)
  question: string;
  options: string[];
  answerIndex: number;    // 정답 보기 인덱스 (0-based)
  explanation: string;
  language: Language;     // 항상 'KO'
}

/**
 * 관리자 문항 조회 응답 (백엔드 AdminQuizQuestionResponse).
 * 공개 조회(quizApi)와 달리 정답(answerIndex)·해설(explanation)을 포함 → 수정 폼 프리필용.
 */
export interface AdminQuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const adminQuizApi = {
  /** 문항 조회 (정답/해설 포함, 관리자 전용). category 필터 + language 번역 — 수정 폼은 'KO'로 시드. */
  getQuestions: (category: string, language: Language) =>
    apiClient
      .get('/admin/quiz/questions', { params: { category, language } })
      .then(unwrap<AdminQuizQuestion[]>),

  /** 문항 생성 (KO 원문 저장 + 5개 언어 자동번역) → 생성된 문항 id. */
  createQuestion: (body: AdminQuizQuestionBody) =>
    apiClient.post('/admin/quiz/questions', body).then(unwrap<number>),

  /** 문항 수정 (메타 갱신 + KO 원문 upsert + 재번역). */
  updateQuestion: (questionId: number, body: AdminQuizQuestionBody) =>
    apiClient.put(`/admin/quiz/questions/${questionId}`, body).then(unwrap<null>),

  /** 문항 삭제 (번역행 cascade). */
  deleteQuestion: (questionId: number) =>
    apiClient.delete(`/admin/quiz/questions/${questionId}`).then(unwrap<null>),
};
