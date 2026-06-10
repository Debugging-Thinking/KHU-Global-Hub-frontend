import apiClient, { unwrap } from './client';
import type { Language } from '../types/board';

// 관리자 전용 학사 가이드 운영 API (AdminGuard로 백엔드에서 관리자만 허용).
// 폼 입력/저장은 전부 KO 원문 기준 — 백엔드가 KO 저장 후 나머지 5개 언어를 자동 사전번역한다.

/** 카테고리 수정 요청 (백엔드 AdminGuideCategoryRequest). badgeKey/sortOrder는 폼 미노출 — 기존값 그대로 전송. */
export interface AdminCategoryBody {
  badgeKey: string;
  emoji: string;
  color: string;
  sortOrder: number;
  title: string;
  language: Language; // 항상 'KO'
}

/** 팁 생성/수정 요청 (백엔드 AdminGuideTipRequest). link 비우면 null. */
export interface AdminTipBody {
  categoryId: number;
  icon: string;
  link: string | null;
  sortOrder: number;
  title: string;
  content: string;
  language: Language; // 항상 'KO'
}

export const adminGuideApi = {
  /** 카테고리 수정 (메타 + KO 원문 upsert, 나머지 5개 언어 자동 재번역). 카테고리 추가/삭제는 범위 외. */
  updateCategory: (categoryId: number, body: AdminCategoryBody) =>
    apiClient.put(`/admin/guide/categories/${categoryId}`, body).then(unwrap<null>),

  /** 팁 생성 (KO 원문 저장 + 자동번역). */
  createTip: (body: AdminTipBody) =>
    apiClient.post('/admin/guide/tips', body).then(unwrap<number>),

  /** 팁 수정 (KO 원문 upsert + 재번역). */
  updateTip: (tipId: number, body: AdminTipBody) =>
    apiClient.put(`/admin/guide/tips/${tipId}`, body).then(unwrap<null>),

  /** 팁 삭제 (번역행 cascade). */
  deleteTip: (tipId: number) =>
    apiClient.delete(`/admin/guide/tips/${tipId}`).then(unwrap<null>),
};
