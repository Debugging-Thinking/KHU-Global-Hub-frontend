import apiClient, { unwrap } from './client';

/** 관리자 전체 매칭 현황 행 (백엔드 AdminMatchResponse). */
export interface AdminMatch {
  matchId: number;
  mentorId: number;
  mentorName: string;
  menteeId: number;
  menteeName: string;
  semester: string;
  status: string;
  matchedAt: string;
}

/** 회원검색 결과 행 (백엔드 MemberSearchResponse). */
export interface MemberSearchResult {
  memberId: number;
  name: string;
  profileImageUrl: string | null;
  department: string;
}

/** Spring Page 응답의 일부 (content만 사용). */
interface Page<T> {
  content: T[];
  totalElements: number;
}

export const adminApi = {
  /** 회원 이름 검색 (관리자 전용). */
  searchMembers: (name: string) =>
    apiClient
      .get('/members/search', { params: { name, size: 30 } })
      .then(unwrap<Page<MemberSearchResult>>)
      .then((p) => p.content),

  /** 전체 매칭 현황 조회 (관리자 전용). */
  getAllMatches: () =>
    apiClient.get('/admin/mentoring/matches').then(unwrap<AdminMatch[]>),

  /** 수동 매칭 실행 (관리자 전용). semester 미지정 시 백엔드가 현재 학기 계산. */
  runMatching: (semester?: string) =>
    apiClient
      .post('/admin/mentoring/run', null, { params: semester ? { semester } : undefined })
      .then(unwrap<null>),
};
