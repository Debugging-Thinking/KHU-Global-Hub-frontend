import apiClient, { unwrap } from './client';

export interface TranslateResponse {
  translations: string[];
  detectedSource: string | null;
}

export const translateApi = {
  /**
   * on-demand 텍스트 번역 (POST /api/translate).
   * 6개 외 언어 사용자의 콘텐츠 "번역하기" + 채팅 메시지 "번역"에 사용.
   * @param target 목표 언어 Azure 코드 (보통 내 preferredLanguage)
   * @param source 원문 언어 코드(생략 시 자동 감지)
   */
  translate: (texts: string[], target: string, source?: string) =>
    apiClient.post('/translate', { texts, target, source }).then(unwrap<TranslateResponse>),
};
