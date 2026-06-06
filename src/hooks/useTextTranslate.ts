import { useEffect, useState } from 'react';
import { translateApi } from '../api/translate';
import type { Language } from '../types/auth';

/**
 * 동적 자동 번역 + 원문 토글.
 * enabled면 마운트/텍스트 변경 시 자동으로 target 언어로 번역하고 **기본은 번역본**을 보여준다.
 * 사용자가 토글하면 원문(원래 texts)을 보여준다. 같은 texts는 1회만 번역(컴포넌트 인스턴스가 유지되면 재호출 없음).
 *
 * - 6개 언어 사용자(prestored 모드)는 서버가 이미 번역본을 주므로 enabled=false로 끄고 원문 그대로 사용.
 * - 6개 외 언어 사용자/채팅은 enabled=true로 동적 번역.
 *
 * @returns displays texts와 같은 순서. (번역본 또는 원문)
 */
export function useAutoTranslate(texts: string[], target: string, enabled: boolean) {
  const [translated, setTranslated] = useState<string[] | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(false);
  const joined = texts.join('');

  useEffect(() => {
    setTranslated(null);
    setShowOriginal(false);
    if (!enabled) return;
    if (!texts.some((t) => t && t.trim())) return;
    let cancelled = false;
    setLoading(true);
    translateApi
      .translate(texts, target)
      .then((res) => { if (!cancelled) setTranslated(res.translations); })
      .catch(() => { /* 실패 시 원문 유지 */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // joined로 texts 변경 감지 (배열 참조 변경은 무시)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, target, enabled]);

  const displays = enabled && !showOriginal && translated ? translated : texts;
  return {
    displays,
    showOriginal,
    loading,
    ready: !!translated,
    toggle: () => setShowOriginal((v) => !v),
  };
}

/**
 * 항목별(게시글 본문/질문/각 댓글/각 답변) 원문↔번역 토글.
 * - prestored(6개 언어): 서버가 내려준 번역본(texts)/원문(originals)을 in-memory로 토글.
 *   원문 언어가 보는 사람 언어와 같으면 토글 불필요(showToggle=false).
 * - 그 외 언어: originals를 preferredCode로 동적 번역(기본 번역본) + 원문 토글.
 * 각 항목이 독립이라 원문 언어가 제각각이어도 개별 토글된다.
 */
export function useItemTranslation(
  texts: string[],
  originals: string[],
  originalLanguage: string | undefined,
  prestored: boolean,
  viewerBucket: Language,
  preferredCode: string,
) {
  const [showOriginal, setShowOriginal] = useState(false);
  const dyn = useAutoTranslate(originals, preferredCode, !prestored);

  if (prestored) {
    const sameLang = !originalLanguage || originalLanguage === viewerBucket;
    return {
      displays: showOriginal ? originals : texts,
      showToggle: !sameLang,
      loading: false,
      showOriginal,
      toggle: () => setShowOriginal((v) => !v),
    };
  }
  return {
    displays: dyn.displays,
    showToggle: dyn.ready || dyn.loading,
    loading: dyn.loading,
    showOriginal: dyn.showOriginal,
    toggle: dyn.toggle,
  };
}
