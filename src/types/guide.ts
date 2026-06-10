// 학사 가이드 응답 타입 (백엔드 GuideResponse 트리와 1:1).
// 텍스트(title/content)는 요청 언어로 이미 조립되어 내려온다(평문). badgeKey/emoji/color/icon/link는 언어 무관 메타.

export interface GuideTip {
  id: number;
  icon: string;
  link?: string | null;
  title: string;
  content: string;
}

export interface GuideCategory {
  id: number;
  badgeKey: string; // 프론트 뱃지 식별 키 (예: COURSE_REG) — 아이콘/색상/퀴즈 매핑에 사용
  emoji: string;
  color: string;
  title: string;
  tips: GuideTip[];
}
