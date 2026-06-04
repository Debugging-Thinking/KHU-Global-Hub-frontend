export type BadgeId =
  | 'COURSE_REG'
  | 'TRANSPORT'
  | 'FOOD'
  | 'CAMPUS_SITE'
  | 'HUMANITIES';

export interface BadgeInfo {
  badgeId: BadgeId;
  badgeNameKO: string;
  badgeNameEN: string;
  emoji: string;
  earnedAt: string;
}

export const BADGE_META: Record<BadgeId, { nameKO: string; nameEN: string; emoji: string }> = {
  COURSE_REG:  { nameKO: '수강신청 박사', nameEN: 'Course Reg Expert', emoji: '📚' },
  TRANSPORT:   { nameKO: '교통 박사',     nameEN: 'Transport Expert',  emoji: '🚌' },
  FOOD:        { nameKO: '맛집 박사',     nameEN: 'Food Expert',        emoji: '🍽️' },
  CAMPUS_SITE: { nameKO: '사이트 박사',   nameEN: 'Campus Site Expert', emoji: '🔗' },
  HUMANITIES:  { nameKO: '교양 박사',     nameEN: 'Humanities Expert',  emoji: '🎓' },
};
