import apiClient, { unwrap } from './client';
import type { GuideCategory } from '../types/guide';
import type { Language } from '../types/board';

export const guideApi = {
  /** 학사 가이드 조회 (카테고리 + 하위 팁 트리, 요청 언어로 조립). */
  getGuide: (language: Language) =>
    apiClient.get('/guide', { params: { language } }).then(unwrap<GuideCategory[]>),
};
