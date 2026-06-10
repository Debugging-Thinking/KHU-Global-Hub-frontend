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

/** 매칭 대기열 멤버 카드 (백엔드 MentoringQueueResponse.MemberCard). */
export interface QueueMember {
  memberId: number;
  name: string;
  department: string;
  nationality: string;
  admissionYear: number;
}

/** 매칭 대기열 (전역 — 현재 ACTIVE 매칭 없는 활성 멤버). */
export interface MentoringQueue {
  waitingMentors: QueueMember[];
  waitingMentees: QueueMember[];
}

export type MentoringRole = 'MENTOR' | 'MENTEE' | 'NONE';

export const adminApi = {
  /** 회원 이름 검색 (관리자 전용). name이 빈 문자열이면 전체 회원 반환. */
  searchMembers: (name: string = '') =>
    apiClient
      .get('/members/search', { params: { name, size: 30 } })
      .then(unwrap<Page<MemberSearchResult>>)
      .then((p) => p.content),

  /** 계정 정지 (관리자 전용). */
  suspend: (memberId: number) =>
    apiClient.post(`/admin/members/${memberId}/suspend`).then(unwrap<null>),

  /** 계정 정지 해제 (관리자 전용). */
  activate: (memberId: number) =>
    apiClient.post(`/admin/members/${memberId}/activate`).then(unwrap<null>),

  /** 전체 매칭 현황 조회 (관리자 전용). */
  getAllMatches: () =>
    apiClient.get('/admin/mentoring/matches').then(unwrap<AdminMatch[]>),

  /** 매칭 대기열 조회 (전역 — ACTIVE 매칭 없는 활성 멤버). */
  getQueue: () =>
    apiClient.get('/admin/mentoring/queue').then(unwrap<MentoringQueue>),

  /** 선택 매칭 실행 — 선택된 memberIds에만 그리디 적용(자동 승격 포함). */
  runMatching: (semester: string, memberIds: number[]) =>
    apiClient.post('/admin/mentoring/run', { semester, memberIds }).then(unwrap<null>),

  /** 관리자 역할 변경 — 타인 멤버의 mentoringRole 직접 변경. */
  updateRole: (memberId: number, mentoringRole: MentoringRole) =>
    apiClient.patch(`/members/${memberId}/role`, { mentoringRole }).then(unwrap<unknown>),
};
